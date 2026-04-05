<?php
echo "<pre>";
echo "Checking .env file...\n";
if (file_exists(__DIR__ . '/.env')) {
    echo ".env file exists (credentials are loaded from environment)\n";
    // Don't display actual credentials for security
    echo "Environment variables configured:\n";
    echo "  - DB_HOST: " . ($_ENV['DB_HOST'] ?? 'not set') . "\n";
    echo "  - DB_NAME: " . ($_ENV['DB_NAME'] ? '***' : 'not set') . "\n";
    echo "  - DB_USER: " . ($_ENV['DB_USER'] ? '***' : 'not set') . "\n";
    echo "  - DB_PASS: " . ($_ENV['DB_PASS'] ? '***' : 'not set') . "\n";
} else {
    echo "⚠️  .env NOT found! Database connection will fail.\n";
    echo "Please create .env file with your database credentials.\n";
}
