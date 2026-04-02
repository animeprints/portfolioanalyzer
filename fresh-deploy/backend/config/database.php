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
        // Try environment variables first, fallback to hardcoded production values
        $this->host = $_ENV['DB_HOST'] ?? 'localhost';
        $this->dbname = $_ENV['DB_NAME'] ?? 'u518052050_cv';
        $this->username = $_ENV['DB_USER'] ?? 'u518052050_cv';
        $this->password = $_ENV['DB_PASS'] ?? 'Rajeev@Anu2010';
        $this->charset = $_ENV['DB_CHARSET'] ?? 'utf8mb4';

        // Log which config is being used
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
