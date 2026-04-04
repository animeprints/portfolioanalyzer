<?php

namespace App\Controllers;
use App\Utils\Response;

use PDO;

class ApplicationController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    /**
     * Candidate applies to a job
     */
    public function apply(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $input = $this->getJsonInput();

        $jobId = $input['job_id'] ?? null;
        $analysisId = $input['analysis_id'] ?? null;

        if (!$jobId || !$analysisId) {
            Response::error('job_id and analysis_id are required', 400);
            return;
        }

        // Verify job exists and is active
        $stmt = $this->db->prepare("SELECT id, status FROM job_postings WHERE id = :id");
        $stmt->execute([':id' => $jobId]);
        $job = $stmt->fetch();

        if (!$job) {
            Response::error('Job not found', 404);
            return;
        }

        if ($job['status'] !== 'active') {
            Response::error('This job is not accepting applications', 400);
            return;
        }

        // Verify analysis exists and belongs to this user
        $stmt = $this->db->prepare("SELECT id, user_id FROM cv_analyses WHERE id = :id");
        $stmt->execute([':id' => $analysisId]);
        $analysis = $stmt->fetch();

        if (!$analysis) {
            Response::error('CV analysis not found', 404);
            return;
        }

        if ($analysis['user_id'] !== $userId) {
            Response::error('You can only use your own CV analyses', 403);
            return;
        }

        // Check if already applied
        $stmt = $this->db->prepare("SELECT id FROM job_applications WHERE job_id = :job_id AND candidate_id = :candidate_id");
        $stmt->execute([
            ':job_id' => $jobId,
            ':candidate_id' => $userId
        ]);
        if ($stmt->fetch()) {
            Response::error('You have already applied to this job', 400);
            return;
        }

        // Calculate match score (simple version: can be enhanced later)
        // For now, we'll use a placeholder or calculate based on job requirements vs skills
        $matchScore = $this->calculateMatchScore($jobId, $analysisId);

        $applicationId = uniqid('', true) . bin2hex(random_bytes(8));

        $sql = "INSERT INTO job_applications
                (id, job_id, candidate_id, analysis_id, match_score, status)
                VALUES (:id, :job_id, :candidate_id, :analysis_id, :match_score, :status)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $applicationId,
            ':job_id' => $jobId,
            ':candidate_id' => $userId,
            ':analysis_id' => $analysisId,
            ':match_score' => $matchScore,
            ':status' => 'pending'
        ]);

        // Fetch the created application with related data
        $application = $this->getApplicationWithDetails($applicationId);

        Response::success([
            'application' => $application
        ], 'Application submitted successfully');
    }

    /**
     * List applications for a specific job (interviewer view)
     */
    public function listByJob(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $userRole = \App\Middleware\AuthMiddleware::getUserRole();

        // Get job_id from query param
        $jobId = $_GET['job_id'] ?? null;

        $sql = "SELECT ja.*,
                       j.title as job_title,
                       j.company as job_company,
                       u.name as candidate_name,
                       u.email as candidate_email,
                       ca.file_name as cv_file_name
                FROM job_applications ja
                JOIN job_postings j ON ja.job_id = j.id
                JOIN users u ON ja.candidate_id = u.id
                LEFT JOIN cv_analyses ca ON ja.analysis_id = ca.id
                WHERE 1=1";

        $params = [];

        // If job_id provided, filter by it
        if ($jobId) {
            $sql .= " AND ja.job_id = :job_id";
            $params[':job_id'] = $jobId;
        }

        // Interviewer sees only their jobs, admin sees all, candidate sees own apps
        if ($userRole === 'interviewer') {
            $sql .= " AND j.interviewer_id = :interviewer_id";
            $params[':interviewer_id'] = $userId;
        } elseif ($userRole === 'candidate') {
            $sql .= " AND ja.candidate_id = :candidate_id";
            $params[':candidate_id'] = $userId;
        }
        // admin sees all

        $sql .= " ORDER BY ja.created_at DESC";

        $stmt = $this->db->prepare($sql);
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->execute();
        $applications = $stmt->fetchAll();

        // Decode JSON fields if any
        foreach ($applications as &$app) {
            if (isset($app['notes']) && is_string($app['notes'])) {
                $app['notes'] = json_decode($app['notes'], true);
            }
        }

        Response::success([
            'applications' => $applications,
            'count' => count($applications)
        ]);
    }

    /**
     * Get single application with full details
     */
    public function get(string $id): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $userRole = \App\Middleware\AuthMiddleware::getUserRole();

        $sql = "SELECT ja.*,
                       j.title as job_title,
                       j.description as job_description,
                       j.requirements as job_requirements,
                       j.company as job_company,
                       u.name as candidate_name,
                       u.email as candidate_email,
                       ca.* as cv_analysis_data
                FROM job_applications ja
                JOIN job_postings j ON ja.job_id = j.id
                JOIN users u ON ja.candidate_id = u.id
                LEFT JOIN cv_analyses ca ON ja.analysis_id = ca.id
                WHERE ja.id = :id LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $application = $stmt->fetch();

        if (!$application) {
            Response::error('Application not found', 404);
            return;
        }

        // Authorization: candidate can only see own, interviewer can see if it's their job
        if ($userRole === 'candidate' && $application['candidate_id'] !== $userId) {
            Response::error('Not authorized', 403);
            return;
        }
        if ($userRole === 'interviewer') {
            // Verify this job belongs to the interviewer
            $stmt = $this->db->prepare("SELECT interviewer_id FROM job_postings WHERE id = :id");
            $stmt->execute([':id' => $application['job_id']]);
            $job = $stmt->fetch();
            if (!$job || $job['interviewer_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
        }

        // Parse JSON fields
        if (isset($application['job_requirements']) && is_string($application['job_requirements'])) {
            $application['job_requirements'] = json_decode($application['job_requirements'], true);
        }
        if (isset($application['cv_analysis_data']) && is_string($application['cv_analysis_data'])) {
            $application['cv_analysis_data'] = json_decode($application['cv_analysis_data'], true);
        }
        if (isset($application['notes']) && is_string($application['notes'])) {
            $application['notes'] = json_decode($application['notes'], true);
        }

        Response::success([
            'application' => $application
        ]);
    }

    /**
     * Update application status
     */
    public function updateStatus(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $userRole = \App\Middleware\AuthMiddleware::getUserRole();
        $input = $this->getJsonInput();

        $id = $_GET['id'] ?? null;
        $status = $input['status'] ?? null;

        if (!$id || !$status) {
            Response::error('Application ID and status are required', 400);
            return;
        }

        $validStatuses = ['pending', 'reviewing', 'interviewing', 'rejected', 'accepted', 'withdrawn'];
        if (!in_array($status, $validStatuses)) {
            Response::error('Invalid status', 400);
            return;
        }

        // Get application
        $stmt = $this->db->prepare("SELECT job_id, candidate_id FROM job_applications WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $application = $stmt->fetch();

        if (!$application) {
            Response::error('Application not found', 404);
            return;
        }

        // Authorization: only interviewer for the job can update (or candidate withdrawing own)
        if ($userRole === 'interviewer') {
            // Check if job belongs to interviewer
            $stmt = $this->db->prepare("SELECT interviewer_id FROM job_postings WHERE id = :id");
            $stmt->execute([':id' => $application['job_id']]);
            $job = $stmt->fetch();
            if (!$job || $job['interviewer_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
        } elseif ($userRole === 'candidate') {
            // Candidate can only update their own application to 'withdrawn'
            if ($application['candidate_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
            if ($status !== 'withdrawn') {
                Response::error('Candidates can only withdraw applications', 403);
                return;
            }
        } elseif ($userRole !== 'admin') {
            Response::error('Not authorized', 403);
            return;
        }

        $stmt = $this->db->prepare("UPDATE job_applications SET status = :status, updated_at = NOW() WHERE id = :id");
        $stmt->execute([
            ':status' => $status,
            ':id' => $id
        ]);

        Response::success(null, 'Status updated');
    }

    /**
     * Update application notes
     */
    public function updateNotes(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $userRole = \App\Middleware\AuthMiddleware::getUserRole();
        $input = $this->getJsonInput();

        $id = $_GET['id'] ?? null;
        $notes = $input['notes'] ?? null;

        if ($id === null) {
            Response::error('Application ID is required', 400);
            return;
        }

        // Get application
        $stmt = $this->db->prepare("SELECT job_id FROM job_applications WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $application = $stmt->fetch();

        if (!$application) {
            Response::error('Application not found', 404);
            return;
        }

        // Only interviewer (or admin) can add notes
        if ($userRole === 'interviewer') {
            $stmt = $this->db->prepare("SELECT interviewer_id FROM job_postings WHERE id = :id");
            $stmt->execute([':id' => $application['job_id']]);
            $job = $stmt->fetch();
            if (!$job || $job['interviewer_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
        } elseif ($userRole !== 'admin') {
            Response::error('Not authorized', 403);
            return;
        }

        // Store notes as JSON to allow history/timestamps
        $notesJson = json_encode([
            'content' => $notes,
            'updated_by' => $userId,
            'updated_at' => date('c')
        ]);

        $stmt = $this->db->prepare("UPDATE job_applications SET notes = :notes, updated_at = NOW() WHERE id = :id");
        $stmt->execute([
            ':notes' => $notesJson,
            ':id' => $id
        ]);

        Response::success(null, 'Notes saved');
    }

    /**
     * Delete/withdraw application
     */
    public function delete(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();
        $userRole = \App\Middleware\AuthMiddleware::getUserRole();

        $id = $_GET['id'] ?? null;
        if (!$id) {
            Response::error('Application ID is required', 400);
            return;
        }

        $stmt = $this->db->prepare("SELECT candidate_id, job_id FROM job_applications WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $application = $stmt->fetch();

        if (!$application) {
            Response::error('Application not found', 404);
            return;
        }

        // Candidate can delete own, interviewer can delete for their job
        if ($userRole === 'candidate') {
            if ($application['candidate_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
        } elseif ($userRole === 'interviewer') {
            $stmt = $this->db->prepare("SELECT interviewer_id FROM job_postings WHERE id = :id");
            $stmt->execute([':id' => $application['job_id']]);
            $job = $stmt->fetch();
            if (!$job || $job['interviewer_id'] !== $userId) {
                Response::error('Not authorized', 403);
                return;
            }
        } elseif ($userRole !== 'admin') {
            Response::error('Not authorized', 403);
            return;
        }

        $stmt = $this->db->prepare("DELETE FROM job_applications WHERE id = :id");
        $stmt->execute([':id' => $id]);

        Response::success(null, 'Application deleted');
    }

    /**
     * Helper: Calculate match score between job and analysis
     */
    private function calculateMatchScore(string $jobId, string $analysisId): float
    {
        // Get job requirements
        $stmt = $this->db->prepare("SELECT requirements FROM job_postings WHERE id = :id");
        $stmt->execute([':id' => $jobId]);
        $job = $stmt->fetch();

        if (!$job) {
            return 0.0;
        }

        $requirements = json_decode($job['requirements'], true) ?? [];

        if (empty($requirements)) {
            return 50.0; // Default if no requirements specified
        }

        // Get candidate skills from analysis
        $stmt = $this->db->prepare("SELECT analysis_data FROM cv_analyses WHERE id = :id");
        $stmt->execute([':id' => $analysisId]);
        $analysis = $stmt->fetch();

        if (!$analysis) {
            return 0.0;
        }

        $analysisData = json_decode($analysis['analysis_data'], true);
        $candidateSkills = $analysisData['skills'] ?? [];

        if (empty($candidateSkills)) {
            return 0.0;
        }

        // Simple match: percentage of required skills that candidate has
        $candidateSkillNames = array_column($candidateSkills, 'name');
        $candidateSkillNames = array_map('strtolower', $candidateSkillNames);

        $matches = 0;
        foreach ($requirements as $req) {
            if (in_array(strtolower($req), $candidateSkillNames)) {
                $matches++;
            }
        }

        $score = ($matches / count($requirements)) * 100;
        return round($score, 2);
    }

    /**
     * Helper: Get application with joined data
     */
    private function getApplicationWithDetails(string $id): array
    {
        $sql = "SELECT ja.*,
                       j.title as job_title,
                       j.company as job_company,
                       u.name as candidate_name,
                       u.email as candidate_email,
                       ca.file_name as cv_file_name,
                       ca.analysis_data as cv_analysis_data
                FROM job_applications ja
                JOIN job_postings j ON ja.job_id = j.id
                JOIN users u ON ja.candidate_id = u.id
                LEFT JOIN cv_analyses ca ON ja.analysis_id = ca.id
                WHERE ja.id = :id LIMIT 1";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $app = $stmt->fetch();

        if ($app) {
            if (isset($app['job_requirements']) && is_string($app['job_requirements'])) {
                $app['job_requirements'] = json_decode($app['job_requirements'], true);
            }
            if (isset($app['cv_analysis_data']) && is_string($app['cv_analysis_data'])) {
                $app['cv_analysis_data'] = json_decode($app['cv_analysis_data'], true);
            }
            if (isset($app['notes']) && is_string($app['notes'])) {
                $app['notes'] = json_decode($app['notes'], true);
            }
        }

        return $app;
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
