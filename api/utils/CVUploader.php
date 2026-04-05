<?php

namespace App\Utils;

use PDO;
use App\Config\Database;

class CVUploader
{
    private string $uploadDir;
    private int $maxFileSize;
    private array $allowedTypes = ['pdf', 'docx', 'txt'];

    public function __construct()
    {
        // Get upload directory from env or default
        $this->uploadDir = $_ENV['UPLOAD_DIR'] ?? 'upload';

        // Ensure upload directory exists
        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0755, true);
        }

        // Get max file size from env (default 10MB)
        $this->maxFileSize = (int)($_ENV['MAX_FILE_SIZE'] ?? 10485760);
    }

    /**
     * Handle file upload and return file info
     */
    public function upload(array $file, int $userId): array
    {
        // Validate upload
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new \Exception('Upload failed with error code: ' . $file['error']);
        }

        // Check file size
        if ($file['size'] > $this->maxFileSize) {
            throw new \Exception('File too large. Maximum size is ' . ($this->maxFileSize / 1024 / 1024) . 'MB');
        }

        // Validate file type
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $this->allowedTypes)) {
            throw new \Exception('Unsupported file type. Allowed: ' . implode(', ', $this->allowedTypes));
        }

        // Generate unique filename
        $uniqueName = uniqid() . '_' . time() . '.' . $ext;
        $destination = $this->uploadDir . '/' . $uniqueName;

        // Move uploaded file
        if (!move_uploaded_file($file['tmp_name'], $destination)) {
            throw new \Exception('Failed to move uploaded file');
        }

        // Set proper permissions
        chmod($destination, 0644);

        return [
            'name' => $file['name'],
            'path' => $destination,
            'size' => $file['size'],
            'type' => $ext,
            'unique_name' => $uniqueName
        ];
    }

    /**
     * Save analysis to database
     */
    public function saveAnalysis(int $userId, string $extractedText, array $fileInfo, array $analysis): array
    {
        $pdo = Database::getConnection();

        $id = uniqid();
        $now = date('Y-m-d H:i:s');

        $stmt = $pdo->prepare("
            INSERT INTO cv_analyses
            (id, user_id, file_name, file_path, file_size, file_type, extracted_text, analysis_data, created_at, updated_at)
            VALUES (:id, :user_id, :file_name, :file_path, :file_size, :file_type, :extracted_text, :analysis_data, :created_at, :updated_at)
        ");

        $stmt->execute([
            ':id' => $id,
            ':user_id' => $userId,
            ':file_name' => $fileInfo['name'],
            ':file_path' => $fileInfo['path'],
            ':file_size' => $fileInfo['size'],
            ':file_type' => $fileInfo['type'],
            ':extracted_text' => $extractedText,
            ':analysis_data' => json_encode($analysis, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ':created_at' => $now,
            ':updated_at' => $now
        ]);

        return [
            'id' => $id,
            'created_at' => $now
        ];
    }

    /**
     * Get all analyses for a user
     */
    public function getUserAnalyses(int $userId): array
    {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("
            SELECT
                id,
                file_name,
                file_size,
                file_type,
                created_at,
                updated_at
            FROM cv_analyses
            WHERE user_id = :user_id
            ORDER BY created_at DESC
        ");

        $stmt->execute([':user_id' => $userId]);
        $analyses = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode analysis_data for each analysis
        foreach ($analyses as &$analysis) {
            // Get full analysis data
            $full = $this->getAnalysis($analysis['id'], $userId);
            if ($full) {
                $analysis = array_merge($analysis, $full);
            }
        }

        return $analyses;
    }

    /**
     * Get a single analysis
     */
    public function getAnalysis(string $id, int $userId): ?array
    {
        $pdo = Database::getConnection();

        $stmt = $pdo->prepare("
            SELECT * FROM cv_analyses
            WHERE id = :id AND user_id = :user_id
        ");

        $stmt->execute([
            ':id' => $id,
            ':user_id' => $userId
        ]);

        $analysis = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$analysis) {
            return null;
        }

        // Decode analysis_data JSON
        if (isset($analysis['analysis_data'])) {
            $analysisData = json_decode($analysis['analysis_data'], true);
            if (is_array($analysisData)) {
                // Merge analysis data into main array
                $analysis = array_merge($analysis, $analysisData);
            }
        }

        // Remove internal fields
        unset($analysis['extracted_text'], $analysis['analysis_data']);

        return $analysis;
    }

    /**
     * Delete an analysis
     */
    public function deleteAnalysis(string $id, int $userId): bool
    {
        $pdo = Database::getConnection();

        // First get the file path to delete the file
        $stmt = $pdo->prepare("SELECT file_path FROM cv_analyses WHERE id = :id AND user_id = :user_id");
        $stmt->execute([':id' => $id, ':user_id' => $userId]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$result) {
            return false;
        }

        // Delete from database
        $stmt = $pdo->prepare("DELETE FROM cv_analyses WHERE id = :id AND user_id = :user_id");
        $deleted = $stmt->execute([':id' => $id, ':user_id' => $userId]);

        if ($deleted) {
            // Delete file if it exists
            if (file_exists($result['file_path'])) {
                @unlink($result['file_path']);
            }
        }

        return $deleted;
    }
}
