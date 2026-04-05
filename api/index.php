<?php

// Enable error logging and display
ini_set('display_errors', '1');
error_reporting(E_ALL);

// Load environment variables
require_once __DIR__ . '/vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

// Handle OPTIONS preflight requests (for same-origin, simple 200 OK)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['status' => 'ok']);
    exit;
}

// Load core classes
require_once __DIR__ . '/utils/Response.php';
class_alias('App\Utils\Response', 'Response');

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

    // Application routes
    if (preg_match('#^/applications$#', $path) && $method === 'POST') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        // Candidates and admins can apply
        require_once __DIR__ . '/middleware/role.php';
        $role = new \App\Middleware\RoleMiddleware(['candidate', 'admin']);
        $role->handle();

        require_once __DIR__ . '/controllers/ApplicationController.php';
        $controller = new \App\Controllers\ApplicationController();
        $controller->apply();
        exit;
    }

    if (preg_match('#^/applications/(\w+)$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ApplicationController.php';
        $controller = new \App\Controllers\ApplicationController();
        $controller->get($matches[1]);
        exit;
    }

    if (preg_match('#^/applications/(\w+)$#', $path, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ApplicationController.php';
        $controller = new \App\Controllers\ApplicationController();

        if (isset($matches[1])) {
            // Check if it's status or notes update based on query param
            $action = $_GET['action'] ?? 'status';
            if ($action === 'status') {
                require_once __DIR__ . '/middleware/role.php';
                $role = new \App\Middleware\RoleMiddleware(['interviewer', 'admin']);
                $role->handle();
                $controller->updateStatus();
            } elseif ($action === 'notes') {
                require_once __DIR__ . '/middleware/role.php';
                $role = new \App\Middleware\RoleMiddleware(['interviewer', 'admin']);
                $role->handle();
                $controller->updateNotes();
            } else {
                Response::error('Invalid action', 404);
            }
        }
        exit;
    }

    if (preg_match('#^/applications/(\w+)$#', $path, $matches) && $method === 'DELETE') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ApplicationController.php';
        $controller = new \App\Controllers\ApplicationController();
        $controller->delete();
        exit;
    }

    if (preg_match('#^/jobs/([a-zA-Z0-9]+)/applications$#', $path, $matches) && $method === 'GET') {
        require_once __DIR__ . '/middleware/auth.php';
        $auth = new \App\Middleware\AuthMiddleware();
        $auth->handle();

        require_once __DIR__ . '/controllers/ApplicationController.php';
        $controller = new \App\Controllers\ApplicationController();
        $controller->listByJob();
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

    // Not found
    http_response_code(404);
    Response::error('Endpoint not found', 404);

} catch (\Throwable $e) {
    // Log to error log
    error_log('API Error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());

    // Also output to screen for debugging
    if (!headers_sent()) {
        header('Content-Type: application/json');
    }
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ], JSON_PRETTY_PRINT);
    exit;
}
