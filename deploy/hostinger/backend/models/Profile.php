<?php

namespace App\Models;

use PDO;
use App\Config\Database;

class Profile
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function findByUserId(string $userId): ?array
    {
        $sql = "SELECT * FROM profiles WHERE user_id = :user_id LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);
        $profile = $stmt->fetch();

        return $profile ?: null;
    }

    public function update(string $userId, array $data): bool
    {
        $updates = [];
        $params = [':user_id' => $userId];

        $allowed = ['language', 'theme', 'linkedin_url', 'github_url', 'website_url', 'notifications', 'preferences'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $data)) {
                $value = $data[$field];
                if (is_array($value) || is_object($value)) {
                    $value = json_encode($value);
                }
                $updates[] = "$field = :$field";
                $params[":$field"] = $value;
            }
        }

        if (empty($updates)) {
            return false;
        }

        $sql = "UPDATE profiles SET " . implode(', ', $updates) . " WHERE user_id = :user_id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute($params);
    }

    public function create(array $data): array
    {
        $id = $this->generateId();
        $sql = "INSERT INTO profiles (id, user_id, language, theme, linkedin_url, github_url, website_url, notifications, preferences)
                VALUES (:id, :user_id, :language, :theme, :linkedin_url, :github_url, :website_url, :notifications, :preferences)";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':id' => $id,
            ':user_id' => $data['user_id'],
            ':language' => $data['language'] ?? 'en',
            ':theme' => $data['theme'] ?? 'dark',
            ':linkedin_url' => $data['linkedin_url'] ?? null,
            ':github_url' => $data['github_url'] ?? null,
            ':website_url' => $data['website_url'] ?? null,
            ':notifications' => $data['notifications'] ?? 1,
            ':preferences' => json_encode($data['preferences'] ?? [])
        ]);

        return $this->findByUserId($data['user_id']);
    }

    private function generateId(): string
    {
        return uniqid('', true) . bin2hex(random_bytes(8));
    }
}
