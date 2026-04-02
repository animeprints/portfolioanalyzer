<?php

// Start output buffering to prevent accidental output before headers
ob_start();

// Enable error logging AND display for debugging (remove in production)
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Import Response class
use App\Utils\Response;

// Load environment variables
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Load middleware
require_once __DIR__ . '/middleware/cors.php';
$cors = new \App\Middleware\CorsMiddleware();
$cors->handle();

// Load Response class manually to avoid autoload issues
require_once __DIR__ . '/utils/Response.php';

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$path = str_replace('/api', '', $uri);

// Remove trailing slash
if ($path !== '/' && str_ends_with($path, '/')) {
    $path = rtrim($path, '/');
}

// Simple router
try {
    // Auth routes
    if ($path === '/auth/register' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new \App\Controllers\AuthController();
        $controller->register();
        exit;
    }

    if ($path === '/auth/login' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new \App\Controllers\AuthController();
        $controller->login();
        exit;
    }

    if ($path === '/auth/refresh' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new \App\Controllers\AuthController();
        $controller->refresh();
        exit;
    }

    if ($path === '/auth/me' && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/AuthController.php';
        $controller = new \App\Controllers\AuthController();
        $controller->me();
        exit;
    }

    // Analysis routes
    if (preg_match('#^/analysis(?:/(\w+))?$#', $path, $matches) && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/AnalysisController.php';
        $controller = new \App\Controllers\AnalysisController();

        if (isset($matches[1])) {
            $action = $matches[1];
            if ($action === 'upload') {
                $controller->upload();
            } else {
                Response::error('Invalid analysis action', 404);
            }
        } else {
            Response::error('Analysis action required', 400);
        }
        exit;
    }

    if (preg_match('#^/analysis/([a-zA-Z0-9]+)$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/AnalysisController.php';
        $controller = new \App\Controllers\AnalysisController();
        $controller->get($matches[1]);
        exit;
    }

    if (preg_match('#^/analysis/([a-zA-Z0-9]+)$#', $path, $matches) && $method === 'DELETE') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/AnalysisController.php';
        $controller = new \App\Controllers\AnalysisController();
        $controller->delete($matches[1]);
        exit;
    }

    if ($path === '/analysis' && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/AnalysisController.php';
        $controller = new \App\Controllers\AnalysisController();
        $controller->list();
        exit;
    }

    // Profile routes
    if ($path === '/profile' && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ProfileController.php';
        $controller = new \App\Controllers\ProfileController();
        $controller->get();
        exit;
    }

    if ($path === '/profile' && $method === 'PUT') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ProfileController.php';
        $controller = new \App\Controllers\ProfileController();
        $controller->update();
        exit;
    }

    // Job posting routes (Interviewer only)
    if (preg_match('#^/jobs(?:/(\w+))?$#', $path, $matches)) {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/middleware/role.php';
        $role = new \App\Middleware\RoleMiddleware(['interviewer', 'admin']);
        $role->handle();

        require_once __DIR__ . '/controllers/JobController.php';
        $controller = new \App\Controllers\JobController();

        if ($method === 'POST' && !isset($matches[1])) {
            $controller->create();
        } elseif ($method === 'GET' && !isset($matches[1])) {
            $controller->list();
        } elseif (isset($matches[1])) {
            // Future: get, update, delete single job
            Response::error('Not implemented', 501);
        } else {
            Response::error('Invalid route', 404);
        }
        exit;
    }

    // Candidate search (Interviewer only)
    if (preg_match('#^/candidates/search$#', $path) && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/middleware/role.php';
        $role = new \App\Middleware\RoleMiddleware(['interviewer', 'admin']);
        $role->handle();

        require_once __DIR__ . '/controllers/CandidateController.php';
        $controller = new \App\Controllers\CandidateController();
        $controller->search();
        exit;
    }

    // Share routes
    if (preg_match('#^/share(?:/([a-f0-9]+))?$#', $path, $matches)) {
        require_once __DIR__ . '/controllers/ShareController.php';
        $controller = new \App\Controllers\ShareController();

        if ($method === 'POST' && !isset($matches[1])) {
            require_once __DIR__ . '/middleware/auth.php';
            $auth = new \App\Middleware\AuthMiddleware();
            $auth->handle();
            $controller->createShareLink();
        } elseif ($method === 'GET' && isset($matches[1])) {
            // Public access - no auth required
            $controller->viewSharedAnalysis($matches[1]);
        } elseif ($method === 'DELETE' && isset($matches[1])) {
            require_once __DIR__ . '/middleware/auth.php';
            $auth = new \App\Middleware\AuthMiddleware();
            $auth->handle();
            $controller->revoke($matches[1]);
        } else {
            Response::error('Invalid share route', 404);
        }
        exit;
    }

    // Templates routes (public or auth)
    if ($path === '/templates' && $method === 'GET') {
        // Optionally require auth? For now, public
        require_once __DIR__ . '/controllers/TemplateController.php';
        $controller = new \App\Controllers\TemplateController();
        $controller->list();
        exit;
    }

    if ($path === '/templates' && $method === 'POST') {
        // Create template (admin only could be enforced)
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        // Optional: role check for admin
        require_once __DIR__ . '/controllers/TemplateController.php';
        $controller = new \App\Controllers\TemplateController();
        $controller->create();
        exit;
    }

    // Interview routes
    if (preg_match('#^/interview/questions(?:/([a-zA-Z0-9-]+))?$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/controllers/InterviewController.php';
        $controller = new \App\Controllers\InterviewController();

        if (isset($matches[1])) {
            $controller->getQuestion($matches[1]);
        } else {
            $controller->getQuestions();
        }
        exit;
    }

    if ($path === '/interview/practice' && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/InterviewController.php';
        $controller = new \App\Controllers\InterviewController();
        $controller->recordPractice();
        exit;
    }

    if ($path === '/interview/practice' && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/InterviewController.php';
        $controller = new \App\Controllers\InterviewController();
        $controller->getPracticeHistory();
        exit;
    }

    // LinkedIn routes
    if ($path === '/linkedin/analyze' && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/LinkedinController.php';
        $controller = new \App\Controllers\LinkedinController();
        $controller->analyze();
        exit;
    }

    if ($path === '/linkedin/profile' && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/LinkedinController.php';
        $controller = new \App\Controllers\LinkedinController();
        $controller->get();
        exit;
    }

    // Export route
    if (preg_match('#^/export$#', $path) && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ExportController.php';
        $controller = new \App\Controllers\ExportController();
        $controller->export();
        exit;
    }

    // Health check
    if ($path === '/health' && $method === 'GET') {
        Response::json([
            'status' => 'ok',
            'timestamp' => date('c'),
            'version' => '1.0.0'
        ]);
        exit;
    }

    // API Documentation
    if ($path === '/' || $path === '') {
        header('Content-Type: text/html');
        echo "<!DOCTYPE html>
        <html>
        <head><title>CV Analyzer API</title></head>
        <body style='font-family: monospace; padding: 20px; background: #1a1a1a; color: #0f0;'>
            <h1>CV Analyzer API</h1>
            <p>Status: <strong style='color: #0f0;'>✓ Online</strong></p>
            <h3>Available Endpoints:</h3>
            <ul>
                <li><strong>POST</strong> /api/auth/register - Register new user</li>
                <li><strong>POST</strong> /api/auth/login - User login</li>
                <li><strong>POST</strong> /api/auth/refresh - Refresh token</li>
                <li><strong>GET</strong>  /api/auth/me - Get current user</li>
                <li><strong>POST</strong> /api/analysis/upload - Upload CV (multipart/form-data)</li>
                <li><strong>GET</strong>  /api/analysis - List user's CV analyses</li>
                <li><strong>GET</strong>  /api/analysis/:id - Get specific analysis</li>
                <li><strong>DELETE</strong> /api/analysis/:id - Delete analysis</li>
                <li><strong>GET</strong>  /api/profile - Get profile</li>
                <li><strong>PUT</strong>  /api/profile - Update profile</li>
                <li><strong>POST</strong> /api/jobs - Create job posting (interviewer only)</li>
                <li><strong>GET</strong>  /api/jobs - List jobs (interviewer only)</li>
                <li><strong>POST</strong> /api/candidates/search - Search candidates (interviewer only)</li>
                <li><strong>GET</strong>  /api/templates - List resume templates</li>
                <li><strong>POST</strong> /api/templates - Create template (admin)</li>
                <li><strong>GET</strong>  /api/interview/questions - Get interview questions (filters: industry, role, difficulty)</li>
                <li><strong>GET</strong>  /api/interview/questions/:id - Get specific question</li>
                <li><strong>POST</strong> /api/interview/practice - Record practice answer</li>
                <li><strong>GET</strong>  /api/interview/practice - Get practice history</li>
                <li><strong>POST</strong> /api/linkedin/analyze - Analyze LinkedIn profile</li>
                <li><strong>GET</strong>  /api/linkedin/profile - Get saved LinkedIn analysis</li>
                <li><strong>POST</strong> /api/export - Export analysis (formats: json, html, docx)</li>
                <li><strong>POST</strong> /api/share - Create share link for analysis</li>
                <li><strong>GET</strong>  /api/share/:token - View shared analysis (public)</li>
                <li><strong>DELETE</strong> /api/share/:token - Revoke share link</li>
                <li><strong>GET</strong>  /api/health - Health check</li>
            </ul>
            <p><em>All endpoints except /auth/register and /auth/login require Bearer token</em></p>
            <hr>
            <small>CV Analyzer Backend API v1.0</small>
        </body>
        </html>";
        exit;
    }

    // Not found
    http_response_code(404);
    Response::error('Endpoint not found', 404);

} catch (\Throwable $e) {
    error_log('API Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
    http_response_code(500);
    // Try to return JSON even if Response class fails
    if (!headers_sent()) {
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => 'Internal server error',
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Headers already sent']);
    }
}
