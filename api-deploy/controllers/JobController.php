<?php

namespace App\Controllers;

use PDO;

class JobController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function list(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        $sql = "SELECT * FROM job_postings WHERE interviewer_id = :interviewer_id ORDER BY created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':interviewer_id' => $userId]);
        $jobs = $stmt->fetchAll();

        // Decode JSON fields
        foreach ($jobs as &$job) {
            if (isset($job['requirements']) && is_string($job['requirements'])) {
                $job['requirements'] = json_decode($job['requirements'], true);
            }
            if (isset($job['filters']) && is_string($job['filters'])) {
                $job['filters'] = json_decode($job['filters'], true);
            }
        }

        Response::success([
            'jobs' => $jobs,
            'count' => count($jobs)
        ]);
    }

    public function create(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $input = $this->getJsonInput();

        // Validation
        if (empty($input['title'])) {
            Response::error('Job title is required', 400);
            return;
        }

        $id = uniqid('', true) . bin2hex(random_bytes(8));

        $sql = "INSERT INTO job_postings
                (id, interviewer_id, title, company, description, requirements, filters, status)
                VALUES (:id, :interviewer_id, :title, :company, :description, :requirements, :filters, :status)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':interviewer_id' => $userId,
            ':title' => trim($input['title']),
            ':company' => $input['company'] ?? null,
            ':description' => $input['description'] ?? null,
            ':requirements' => json_encode($input['requirements'] ?? []),
            ':filters' => json_encode($input['filters'] ?? []),
            ':status' => $input['status'] ?? 'active'
        ]);

        Response::success([
            'job' => [
                'id' => $id,
                'title' => $input['title'],
                'company' => $input['company'] ?? null,
                'description' => $input['description'] ?? null,
                'requirements' => $input['requirements'] ?? [],
                'filters' => $input['filters'] ?? [],
                'status' => $input['status'] ?? 'active'
            ]
        ], 'Job created successfully');
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
