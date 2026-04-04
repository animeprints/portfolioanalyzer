<?php

namespace App\Middleware;

use App\Config\JWTManager;

class AuthMiddleware
{
    private JWTManager $jwt;

    public function __construct()
    {
        $this->jwt = new JWTManager();
    }

    public function handle(): void
    {
        $headers = getallheaders();
        $authHeader = $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (!$authHeader || !preg_match('/Bearer\s+(.*)/i', $authHeader, $matches)) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized - No token provided']);
            exit;
        }

        $token = trim($matches[1]);

        try {
            $decoded = $this->jwt->decodeToken($token);
            $userId = $decoded->data->userId ?? null;

            if (!$userId) {
                throw new \Exception('Invalid token payload');
            }

            // Make user data available globally for this request
            $GLOBALS['auth_user_id'] = $userId;
            $GLOBALS['auth_user_role'] = $decoded->data->role ?? 'candidate';
        } catch (\Exception $e) {
            http_response_code(401);
            echo json_encode(['success' => false, 'error' => 'Unauthorized - ' . $e->getMessage()]);
            exit;
        }
    }

    public static function getUserId(): ?string
    {
        return $GLOBALS['auth_user_id'] ?? null;
    }

    public static function getUserRole(): ?string
    {
        return $GLOBALS['auth_user_role'] ?? null;
    }
}
