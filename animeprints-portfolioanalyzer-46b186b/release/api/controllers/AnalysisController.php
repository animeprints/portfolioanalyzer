<?php

namespace App\Controllers;
use App\Utils\Response;

use App\Utils\CVUploader;
use App\Utils\AnalysisEngine;

class AnalysisController
{
    private CVUploader $uploader;
    private AnalysisEngine $engine;

    public function __construct()
    {
        $this->uploader = new CVUploader();
        $this->engine = new AnalysisEngine();
    }

    public function upload(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        // Check file upload
        if (!isset($_FILES['cv']) || $_FILES['cv']['error'] === UPLOAD_ERR_NO_FILE) {
            Response::error('No file uploaded', 400);
            return;
        }

        try {
            // 1. Upload file
            $fileInfo = $this->uploader->upload($_FILES['cv'], $userId);

            // 2. Parse file content
            $parsed = CVParser::parseFile($fileInfo['path'], $fileInfo['original_name']);
            $extractedText = $parsed['text'];

            // 3. Analyze CV
            $analysis = $this->engine->analyze($extractedText);

            // 4. Transform analysis data to match frontend expectation
            $transformed = [
                'personal_info' => $analysis['personalInfo'] ?? [],
                'summary' => $analysis['summary'] ?? null,
                'extracted_skills' => $analysis['skills'] ?? [
                    'technical' => [],
                    'soft' => [],
                    'business' => [],
                    'languages' => [],
                    'tools' => [],
                ],
                'experience' => $analysis['experience'] ?? ['years' => 0, 'level' => 'junior', 'positions' => []],
                'education' => $analysis['education'] ?? [],
                'overall_score' => $analysis['scores']['overall'] ?? 0,
                'ats_score' => $analysis['scores']['ats'] ?? 0,
                'readability_score' => $analysis['scores']['readability'] ?? 0,
                'impact_score' => $analysis['scores']['impact'] ?? 0,
                'completeness_score' => $analysis['scores']['completeness'] ?? 0,
            ];

            // 5. Save analysis (store the raw analysis + transformed data)
            $result = $this->uploader->saveAnalysis($userId, $extractedText, $fileInfo, array_merge($analysis, $transformed));

            // 6. Return transformed data to frontend
            $responseData = [
                'id' => $result['id'],
                'file_name' => $fileInfo['name'],
                'created_at' => $result['created_at'] ?? date('c'),
            ] + $transformed;

            Response::success(['analysis' => $responseData], 'CV analyzed successfully');

        } catch (\Exception $e) {
            Response::error('Analysis failed: ' . $e->getMessage(), 500);
        }
    }

    public function list(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $analyses = $this->uploader->getUserAnalyses($userId);

        Response::success([
            'analyses' => $analyses,
            'count' => count($analyses)
        ]);
    }

    public function get(string $id): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $analysis = $this->uploader->getAnalysis($id, $userId);

        if (!$analysis) {
            Response::error('Analysis not found', 404);
            return;
        }

        Response::success(['analysis' => $analysis]);
    }

    public function delete(string $id): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $success = $this->uploader->deleteAnalysis($id, $userId);

        if ($success) {
            Response::success(null, 'Analysis deleted successfully');
        } else {
            Response::error('Analysis not found or delete failed', 404);
        }
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
