<?php
require_once __DIR__ . '/backend/vendor/autoload.php';
require_once __DIR__ . '/backend/utils/Response.php';
class_alias('App\Utils\Response', 'Response');

echo "1. Loading AuthController...\n";
require_once __DIR__ . '/backend/controllers/AuthController.php';
echo "2. AuthController loaded\n";

echo "3. Instantiating...\n";
$controller = new App\Controllers\AuthController();
echo "4. Controller instantiated\n";
