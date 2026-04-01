<?php

namespace App\Controllers;
use App\Utils\Response;

use PDO;

class ShareController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function createShareLink(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $input = $this->getJsonInput();

        if (empty($input['analysis_id'])) {
            Response::error('analysis_id is required', 400);
            return;
        }

        // Verify ownership of analysis
        $sql = "SELECT id FROM cv_analyses WHERE id = :id AND user_id = :user_id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $input['analysis_id'],
            ':user_id' => $userId
        ]);

        if (!$stmt->fetch()) {
            Response::error('Analysis not found or access denied', 404);
            return;
        }

        // Generate unique token
        $token = bin2hex(random_bytes(32));
        $id = uniqid('', true) . bin2hex(random_bytes(8));

        // Optional expiry
        $expiresAt = null;
        if (!empty($input['expires_in_days'])) {
            $expiresAt = date('Y-m-d H:i:s', time() + ((int)$input['expires_in_days'] * 86400));
        }

        $sql = "INSERT INTO share_links (id, analysis_id, token, password_hash, expires_at)
                VALUES (:id, :analysis_id, :token, :password_hash, :expires_at)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':analysis_id' => $input['analysis_id'],
            ':token' => $token,
            ':password_hash' => !empty($input['password']) ? password_hash($input['password'], PASSWORD_BCRYPT) : null,
            ':expires_at' => $expiresAt
        ]);

        Response::success([
            'share_url' => $_ENV['APP_URL'] ?? 'http://localhost:5173' . '/shared/' . $token,
            'token' => $token,
            'expires_at' => $expiresAt
        ], 'Share link created');
    }

    public function viewSharedAnalysis(string $token): void
    {
        // Check if token is valid
        $sql = "SELECT sl.*, ca.analysis_data, ca.file_name
                FROM share_links sl
                JOIN cv_analyses ca ON sl.analysis_id = ca.id
                WHERE sl.token = :token";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':token' => $token]);
        $share = $stmt->fetch();

        if (!$share) {
            Response::error('Invalid share link', 404);
            return;
        }

        // Check expiry
        if ($share['expires_at'] && strtotime($share['expires_at']) < time()) {
            Response::error('Share link has expired', 410);
            return;
        }

        // Check password if required
        if ($share['password_hash']) {
            $input = $this->getJsonInput();
            $password = $input['password'] ?? '';

            if (!$password || !password_verify($password, $share['password_hash'])) {
                Response::error('Password required or incorrect', 401);
                return;
            }
        }

        // Increment access count
        $sql = "UPDATE share_links SET access_count = access_count + 1, last_accessed_at = NOW() WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $share['id']]);

        // Return analysis data
        $analysis = json_decode($share['analysis_data'], true);

        Response::success([
            'analysis' => $analysis,
            'file_name' => $share['file_name'],
            'shared_by' => 'CV Analyzer User',
            'shared_at' => $share['created_at']
        ]);
    }

    public function revoke(string $token): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        $sql = "SELECT sl.id
                FROM share_links sl
                JOIN cv_analyses ca ON sl.analysis_id = ca.id
                WHERE sl.token = :token AND ca.user_id = :user_id";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':token' => $token,
            ':user_id' => $userId
        ]);

        $share = $stmt->fetch();

        if (!$share) {
            Response::error('Share link not found or access denied', 404);
            return;
        }

        $sql = "DELETE FROM share_links WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $share['id']]);

        Response::success(null, 'Share link revoked');
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
