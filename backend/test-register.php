<?php
ini_set('display_errors', '1');
error_reporting(E_ALL);

echo "<pre>Starting test...\n";

// Test 1: Autoloader
echo "1. Testing autoloader...\n";
require_once __DIR__ . '/vendor/autoload.php';
echo "   Autoloader loaded\n";

// Test 2: Response class
echo "2. Testing Response class...\n";
require_once __DIR__ . '/utils/Response.php';
class_alias('App\Utils\Response', 'Response');
echo "   Response class loaded\n";

// Test 3: Database connection
echo "3. Testing database...\n";
$pdo = \App\Config\Database::getConnection();
echo "   DB connected: " . $pdo->query("SELECT DATABASE()")->fetchColumn() . "\n";

// Test 4: Create user
echo "4. Testing user creation...\n";
$user = new \App\Models\User();
echo "   User model instantiated\n";

// Test 5: Try to insert
try {
    $result = $user->create([
        'email' => 'test@example.com',
        'password' => 'Test123456!',
        'name' => 'Test',
        'role' => 'candidate'
    ]);
    echo "   User created: " . $result['id'] . "\n";
} catch (Exception $e) {
    echo "   ERROR: " . $e->getMessage() . "\n";
    echo "   File: " . $e->getFile() . " Line: " . $e->getLine() . "\n";
}

echo "\nDone.\n";
