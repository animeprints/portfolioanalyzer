<?php

namespace App\Controllers;
use App\Utils\Response;

use PDO;

class TemplateController
{
    private PDO $db;

    public function __construct()
    {
        $this->db = \App\Config\Database::getConnection();
    }

    public function list(): void
    {
        $sql = "SELECT * FROM resume_templates WHERE is_active = 1 ORDER BY created_at DESC";
        $stmt = $this->db->query($sql);
        $templates = $stmt->fetchAll();

        // Decode JSON fields
        foreach ($templates as &$template) {
            if (isset($template['industry']) && is_string($template['industry'])) {
                $template['industry'] = json_decode($template['industry'], true);
            }
            if (isset($template['structure']) && is_string($template['structure'])) {
                $template['structure'] = json_decode($template['structure'], true);
            }
        }

        Response::success([
            'templates' => $templates,
            'count' => count($templates)
        ]);
    }

    public function create(): void
    {
        $input = $this->getJsonInput();

        if (empty($input['name']) || empty($input['industry']) || empty($input['file_url'])) {
            Response::error('Name, industry, and file_url are required', 400);
            return;
        }

        $id = uniqid('', true) . bin2hex(random_bytes(8));

        $sql = "INSERT INTO resume_templates
                (id, name, industry, file_url, preview_url, structure, ats_score, is_active)
                VALUES (:id, :name, :industry, :file_url, :preview_url, :structure, :ats_score, :is_active)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':name' => trim($input['name']),
            ':industry' => json_encode($input['industry']),
            ':file_url' => $input['file_url'],
            ':preview_url' => $input['preview_url'] ?? null,
            ':structure' => json_encode($input['structure'] ?? []),
            ':ats_score' => $input['ats_score'] ?? null,
            ':is_active' => $input['is_active'] ?? 1
        ]);

        Response::success([
            'template' => [
                'id' => $id,
                'name' => $input['name'],
                'industry' => $input['industry'],
                'file_url' => $input['file_url'],
                'preview_url' => $input['preview_url'] ?? null
            ]
        ], 'Template created successfully');
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
