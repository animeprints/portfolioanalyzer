<?php
echo "<pre>";
echo "Checking .env file...\n";
if (file_exists(__DIR__ . '/.env')) {
    echo ".env exists\n";
    $contents = file_get_contents(__DIR__ . '/.env');
    echo "Contents:\n$contents\n";
} else {
    echo ".env NOT found!\n";
}

echo "\nEnvironment variables:\n";
print_r([
    'DB_NAME' => $_ENV['DB_NAME'] ?? 'not set',
    'DB_USER' => $_ENV['DB_USER'] ?? 'not set',
    'DB_PASS' => $_ENV['DB_PASS'] ? '***' : 'not set',
]);

echo "\nTrying connection with fallback values...\n";
try {
    $pdo = new PDO('mysql:host=localhost;dbname=u518052050_cv;charset=utf8mb4', 'u518052050_cv', 'Rajeev@Anu2010');
    echo "SUCCESS with hardcoded credentials\n";
} catch (Exception $e) {
    echo "FAILED: " . $e->getMessage() . "\n";
}
