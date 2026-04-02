<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $instance = null;
    private string $host;
    private string $dbname;
    private string $username;
    private string $password;
    private string $charset;

    public function __construct()
    {
        // Require environment variables - no hardcoded fallbacks for security
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->dbname = $_ENV['DB_NAME'] ?? null;
        $this->username = $_ENV['DB_USER'] ?? null;
        $this->password = $_ENV['DB_PASS'] ?? null;
        $this->charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

        // Validate that credentials are set
        if (!$this->dbname || !$this->username || !$this->password) {
            error_log('ERROR: Database credentials not set in .env file');
            throw new \RuntimeException('Database credentials not configured. Please set DB_NAME, DB_USER, and DB_PASS in .env');
        }

        // Log which config is being used (without sensitive data)
        error_log("Database config - Host: {$this->host}, DB: {$this->dbname}, User: {$this->username}");
    }

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            $instance = new self();
            self::$instance = $instance->connect();
        }

        return self::$instance;
    }

    private function connect(): PDO
    {
        // Log environment variables for debugging (remove in production)
        error_log("DB Config - Host: {$this->host}, DB: {$this->dbname}, User: {$this->username}");

        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];

        try {
            return new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            error_log('Database connection failed: ' . $e->getMessage());
            throw new PDOException('Database connection error: ' . $e->getMessage());
        }
    }
}
