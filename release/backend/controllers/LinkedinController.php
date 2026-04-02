<?php

namespace App\Controllers;
use App\Utils\Response;

use PDO;

class LinkedinController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function analyze(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $input = $this->getJsonInput();

        if (empty($input['profile_data'])) {
            Response::error('Profile data is required', 400);
            return;
        }

        // Analyze LinkedIn profile (simplified version - can be expanded)
        $score = $this->calculateOptimizationScore($input['profile_data']);
        $suggestions = $this->generateSuggestions($input['profile_data'], $score);

        $id = uniqid('', true) . bin2hex(random_bytes(8));

        $sql = "INSERT INTO linkedin_profiles
                (id, user_id, profile_data, headline, summary, experience, skills, optimization_score, suggestions)
                VALUES (:id, :user_id, :profile_data, :headline, :summary, :experience, :skills, :optimization_score, :suggestions)
                ON DUPLICATE KEY UPDATE
                profile_data = VALUES(profile_data),
                headline = VALUES(headline),
                summary = VALUES(summary),
                experience = VALUES(experience),
                skills = VALUES(skills),
                optimization_score = VALUES(optimization_score),
                suggestions = VALUES(suggestions),
                updated_at = NOW()";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $userId,
            ':profile_data' => json_encode($input['profile_data']),
            ':headline' => $input['headline'] ?? null,
            ':summary' => $input['summary'] ?? null,
            ':experience' => json_encode($input['experience'] ?? []),
            ':skills' => json_encode($input['skills'] ?? []),
            ':optimization_score' => $score,
            ':suggestions' => json_encode($suggestions)
        ]);

        Response::success([
            'score' => $score,
            'suggestions' => $suggestions,
            'message' => 'Profile analyzed successfully'
        ]);
    }

    public function get(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        $sql = "SELECT * FROM linkedin_profiles WHERE user_id = :user_id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        $profile = $stmt->fetch();

        if (!$profile) {
            Response::error('No LinkedIn profile analysis found', 404);
            return;
        }

        // Decode JSON fields
        foreach (['profile_data', 'experience', 'skills', 'suggestions'] as $field) {
            if (isset($profile[$field]) && is_string($profile[$field])) {
                $profile[$field] = json_decode($profile[$field], true);
            }
        }

        Response::success(['profile' => $profile]);
    }

    private function calculateOptimizationScore(array $data): float
    {
        $score = 0;
        $maxScore = 100;

        if (!empty($data['headline'])) $score += 20;
        if (!empty($data['summary'])) $score += 25;
        if (!empty($data['experience']) && is_array($data['experience']) && count($data['experience']) >= 1) $score += 25;
        if (!empty($data['skills']) && is_array($data['skills']) && count($data['skills']) >= 10) $score += 20;
        if (!empty($data['profile_picture'])) $score += 10;

        return min($maxScore, $score);
    }

    private function generateSuggestions(array $data, float $score): array
    {
        $suggestions = [];

        if (empty($data['headline']) || mb_strlen($data['headline']) < 10) {
            $suggestions[] = 'Add a compelling headline with keywords (max 220 characters)';
        }

        if (empty($data['summary']) || mb_strlen($data['summary']) < 100) {
            $suggestions[] = 'Write a detailed summary (minimum 100 characters) highlighting your value proposition';
        }

        if (empty($data['experience']) || count($data['experience']) < 2) {
            $suggestions[] = 'Add more work experience with bullet points using action verbs';
        }

        if (empty($data['skills']) || count($data['skills']) < 10) {
            $suggestions[] = 'Add at least 10 relevant skills to improve searchability';
        }

        if ($score >= 80) {
            $suggestions[] = 'Great profile! Keep it updated and engage with content regularly.';
        }

        return $suggestions;
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
