<?php
require_once __DIR__ . '/vendor/autoload.php';
$cors = new \App\Middleware\CorsMiddleware();
$cors->handle();
header('Content-Type: application/json');
echo json_encode(['test'=>'cors ok','origin'=>$_SERVER['HTTP_ORIGIN']??'none']);
