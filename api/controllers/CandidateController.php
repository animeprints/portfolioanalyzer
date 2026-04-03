<?php

namespace App\Controllers;
use App\Utils\Response;

use PDO;

class CandidateController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function search(): void
    {
        $input = $this->getJsonInput();

        // Build dynamic query with filters
        $where = [];
        $params = [];

        // Filter by required skills
        if (!empty($input['skills'])) {
            $skillConditions = [];
            foreach ((array)$input['skills'] as $index => $skill) {
                $key = "skill_$index";
                $skillConditions[] = "JSON_CONTAINS(JSON_EXTRACT(analysis_data, '$.skills'), JSON_QUOTE(:$key), '$')";
                $params[":$key"] = $skill;
            }
            if ($skillConditions) {
                $where[] = '(' . implode(' OR ', $skillConditions) . ')';
            }
        }

        // Filter by minimum experience level
        if (!empty($input['min_experience'])) {
            $where[] = "JSON_EXTRACT(analysis_data, '$.experience.years') >= :min_exp";
            $params[':min_exp'] = (int)$input['min_experience'];
        }

        // Filter by keywords (search in extracted text)
        if (!empty($input['keywords'])) {
            $keywordConditions = [];
            foreach ((array)$input['keywords'] as $index => $keyword) {
                $key = "kw_$index";
                $keywordConditions[] = "extracted_text LIKE :$key";
                $params[":$key"] = "%$keyword%";
            }
            if ($keywordConditions) {
                $where[] = '(' . implode(' OR ', $keywordConditions) . ')';
            }
        }

        // Search by skills overlap to calculate match score
        $sql = "SELECT ca.*, u.name, u.email
                FROM cv_analyses ca
                JOIN users u ON ca.user_id = u.id
                WHERE u.role = 'candidate'";

        if (!empty($where)) {
            $sql .= ' AND ' . implode(' AND ', $where);
        }

        // Optional: order by created date (newest first) or could add relevance scoring
        $sql .= " ORDER BY ca.created_at DESC LIMIT 100";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        $candidates = $stmt->fetchAll();

        // Decode analysis_data for each candidate
        foreach ($candidates as &$candidate) {
            if (isset($candidate['analysis_data']) && is_string($candidate['analysis_data'])) {
                $candidate['analysis_data'] = json_decode($candidate['analysis_data'], true);
            }
        }

        Response::success([
            'candidates' => $candidates,
            'count' => count($candidates),
            'filters_applied' => $input
        ]);
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
