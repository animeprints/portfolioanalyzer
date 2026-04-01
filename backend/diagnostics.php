<?php
header('Content-Type: application/json');
try {
    require_once __DIR__ . '/vendor/autoload.php';
    $pdo = \App\Config\Database::getConnection();
    $pdo->query("SELECT 1");
    $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
    echo json_encode(['success'=>true,'db'=>'connected','tables'=>$tables]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>$e->getMessage(),'file'=>$e->getFile(),'line'=>$e->getLine()]);
}
