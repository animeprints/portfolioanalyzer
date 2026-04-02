<?php
// Minimal test - no dependencies
echo "PHP is working\n";
echo "Version: " . PHP_VERSION . "\n";

// Test if .env loads
try {
    require_once __DIR__ . '/vendor/autoload.php';
    echo "Autoload loaded\n";

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();
    echo ".env loaded\n";
    echo "DB_NAME: " . ($_ENV['DB_NAME'] ?? 'not set') . "\n";
} catch (Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
