<?php

namespace App\Controllers;

use PDO;

class InterviewController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function getQuestions(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        $industry = $_GET['industry'] ?? null;
        $role = $_GET['role'] ?? null;
        $difficulty = $_GET['difficulty'] ?? null;
        $limit = min(50, (int)($_GET['limit'] ?? 20));

        $sql = "SELECT * FROM interview_questions WHERE 1=1";
        $params = [];

        if ($industry) {
            $sql .= " AND industry = :industry";
            $params[':industry'] = $industry;
        }
        if ($role) {
            $sql .= " AND role = :role";
            $params[':role'] = $role;
        }
        if ($difficulty) {
            $sql .= " AND difficulty = :difficulty";
            $params[':difficulty'] = $difficulty;
        }

        $sql .= " ORDER BY RAND() LIMIT :limit";
        $params[':limit'] = $limit;

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $questions = $stmt->fetchAll();

        // Decode tips JSON
        foreach ($questions as &$q) {
            if (isset($q['tips']) && is_string($q['tips'])) {
                $q['tips'] = json_decode($q['tips'], true);
            }
        }

        Response::success([
            'questions' => $questions,
            'count' => count($questions)
        ]);
    }

    public function getQuestion(string $id): void
    {
        $sql = "SELECT * FROM interview_questions WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $question = $stmt->fetch();

        if (!$question) {
            Response::error('Question not found', 404);
            return;
        }

        if (isset($question['tips']) && is_string($question['tips'])) {
            $question['tips'] = json_decode($question['tips'], true);
        }

        Response::success(['question' => $question]);
    }

    public function recordPractice(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $input = $this->getJsonInput();

        if (empty($input['question_id']) || empty($input['user_answer'])) {
            Response::error('question_id and user_answer are required', 400);
            return;
        }

        $id = uniqid('', true) . bin2hex(random_bytes(8));

        $sql = "INSERT INTO interview_practice
                (id, user_id, question_id, user_answer, self_rating, ai_feedback)
                VALUES (:id, :user_id, :question_id, :user_answer, :self_rating, :ai_feedback)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $userId,
            ':question_id' => $input['question_id'],
            ':user_answer' => $input['user_answer'],
            ':self_rating' => $input['self_rating'] ?? null,
            ':ai_feedback' => $input['ai_feedback'] ?? null
        ]);

        Response::success(null, 'Practice recorded');
    }

    public function getPracticeHistory(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        $sql = "SELECT ip.*, iq.question, iq.category, iq.difficulty
                FROM interview_practice ip
                JOIN interview_questions iq ON ip.question_id = iq.id
                WHERE ip.user_id = :user_id
                ORDER BY ip.attempted_at DESC
                LIMIT 50";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        $history = $stmt->fetchAll();

        Response::success([
            'history' => $history,
            'count' => count($history)
        ]);
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
