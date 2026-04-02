<?php
require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/middleware/cors.php';
$cors = new \App\Middleware\CorsMiddleware();
$cors->handle();
header('Content-Type: application/json');
echo json_encode([
    'origin' => $_SERVER['HTTP_ORIGIN'] ?? 'none',
    'allow_origin' => $_SERVER['HTTP_ACCESS_CONTROL_ALLOW_ORIGIN'] ?? 'not set',
    'method' => $_SERVER['REQUEST_METHOD']
]);
