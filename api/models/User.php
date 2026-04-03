<?php

namespace App\Models;

use PDO;
use App\Config\Database;

class User
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function create(array $data): array
    {
        $id = $this->generateId();
        $email = strtolower(trim($data['email']));
        $passwordHash = password_hash($data['password'], PASSWORD_BCRYPT);
        $name = trim($data['name'] ?? '');
        $role = $data['role'] ?? 'candidate';

        // Check if email exists
        if ($this->findByEmail($email)) {
            throw new \Exception('Email already registered');
        }

        $sql = "INSERT INTO users (id, email, password_hash, name, role)
                VALUES (:id, :email, :password_hash, :name, :role)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':email' => $email,
            ':password_hash' => $passwordHash,
            ':name' => $name,
            ':role' => $role
        ]);

        // Create profile
        $this->createProfile($id);

        return $this->findById($id);
    }

    public function findByEmail(string $email): ?array
    {
        $sql = "SELECT * FROM users WHERE email = :email LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':email' => $email]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function findById(string $id): ?array
    {
        $sql = "SELECT id, email, name, role, avatar, email_verified_at, created_at
                FROM users WHERE id = :id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':id' => $id]);
        $user = $stmt->fetch();

        return $user ?: null;
    }

    public function verifyCredentials(string $email, string $password): ?array
    {
        $user = $this->findByEmail($email);
        if (!$user) {
            return null;
        }

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        // Return user without password hash
        unset($user['password_hash']);
        return $user;
    }

    public function updateProfile(string $userId, array $data): bool
    {
        $updates = [];
        $params = [':id' => $userId];

        if (isset($data['name'])) {
            $updates[] = 'name = :name';
            $params[':name'] = trim($data['name']);
        }
        if (isset($data['avatar'])) {
            $updates[] = 'avatar = :avatar';
            $params[':avatar'] = $data['avatar'];
        }
        if (isset($data['email_verified_at'])) {
            $updates[] = 'email_verified_at = NOW()';
        }

        if (empty($updates)) {
            return false;
        }

        $sql = "UPDATE users SET " . implode(', ', $updates) . " WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    private function createProfile(string $userId): void
    {
        $sql = "INSERT INTO profiles (id, user_id) VALUES (:id, :user_id)";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $this->generateId(),
            ':user_id' => $userId
        ]);
    }

    private function generateId(): string
    {
        return uniqid('', true) . bin2hex(random_bytes(8));
    }
}
