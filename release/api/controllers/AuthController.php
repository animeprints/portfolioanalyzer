<?php

namespace App\Controllers;
use App\Utils\Response;

use App\Models\User;

class AuthController
{
    private User $userModel;

    public function __construct()
    {
        $this->userModel = new User();
    }

    public function register(): void
    {
        // Get input
        $input = $this->getJsonInput();

        // Validation
        if (empty($input['email']) || empty($input['password']) || empty($input['name'])) {
            Response::error('Email, password, and name are required', 400);
            return;
        }

        if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format', 400);
            return;
        }

        if (strlen($input['password']) < 8) {
            Response::error('Password must be at least 8 characters', 400);
            return;
        }

        try {
            $user = $this->userModel->create([
                'email' => $input['email'],
                'password' => $input['password'],
                'name' => $input['name'],
                'role' => $input['role'] ?? 'candidate'
            ]);

            // Remove sensitive data
            unset($user['password_hash']);

            Response::json([
                'success' => true,
                'message' => 'Registration successful',
                'data' => [
                    'user' => [
                        'id' => $user['id'],
                        'email' => $user['email'],
                        'name' => $user['name'],
                        'role' => $user['role']
                    ]
                ]
            ], 201);
        } catch (\Exception $e) {
            error_log('Registration error: ' . $e->getMessage() . "\n" . $e->getTraceAsString());
            Response::error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login(): void
    {
        $input = $this->getJsonInput();

        if (empty($input['email']) || empty($input['password'])) {
            Response::error('Email and password are required', 400);
            return;
        }

        $user = $this->userModel->verifyCredentials($input['email'], $input['password']);

        if (!$user) {
            Response::error('Invalid credentials', 401);
            return;
        }

        // Generate JWT tokens
        $jwt = new \App\Config\JWTManager();
        $accessToken = $jwt->generateAccessToken($user);
        $refreshToken = $jwt->generateRefreshToken($user);

        Response::json([
            'success' => true,
            'message' => 'Login successful',
            'data' => [
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name'],
                    'role' => $user['role']
                ],
                'tokens' => [
                    'access_token' => $accessToken,
                    'refresh_token' => $refreshToken,
                    'expires_in' => $_ENV['JWT_EXPIRES_IN'] ?? 900
                ]
            ]
        ]);
    }

    public function refresh(): void
    {
        $input = $this->getJsonInput();

        if (empty($input['refresh_token'])) {
            Response::error('Refresh token required', 400);
            return;
        }

        try {
            $jwt = new \App\Config\JWTManager();
            $decoded = $jwt->decodeToken($input['refresh_token']);

            if (!isset($decoded->data->userId) || $decoded->data->type !== 'refresh') {
                throw new \Exception('Invalid refresh token');
            }

            $user = $this->userModel->findById($decoded->data->userId);
            if (!$user) {
                throw new \Exception('User not found');
            }

            $accessToken = $jwt->generateAccessToken($user);

            Response::json([
                'success' => true,
                'data' => [
                    'access_token' => $accessToken,
                    'expires_in' => $_ENV['JWT_EXPIRES_IN'] ?? 900
                ]
            ]);
        } catch (\Exception $e) {
            Response::error('Invalid refresh token', 401);
        }
    }

    public function me(): void
    {
        $userId = $GLOBALS['auth_user_id'] ?? null;

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $user = $this->userModel->findById($userId);
        if (!$user) {
            Response::error('User not found', 404);
            return;
        }

        Response::json([
            'success' => true,
            'data' => [
                'user' => $user
            ]
        ]);
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
