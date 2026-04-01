<?php

namespace App\Controllers;

use App\Models\Profile;

class ProfileController
{
    private Profile $profileModel;

    public function __construct()
    {
        $this->profileModel = new Profile();
    }

    public function get(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $profile = $this->profileModel->findByUserId($userId);

        if (!$profile) {
            Response::error('Profile not found', 404);
            return;
        }

        // Decode preferences JSON
        if (isset($profile['preferences']) && is_string($profile['preferences'])) {
            $profile['preferences'] = json_decode($profile['preferences'], true);
        }

        Response::success([
            'profile' => $profile
        ]);
    }

    public function update(): void
    {
        $userId = \App\Middleware\AuthMiddleware::getUserId();

        if (!$userId) {
            Response::error('Unauthorized', 401);
            return;
        }

        $input = $this->getJsonInput();

        $success = $this->profileModel->update($userId, $input);

        if ($success) {
            $profile = $this->profileModel->findByUserId($userId);
            if (isset($profile['preferences']) && is_string($profile['preferences'])) {
                $profile['preferences'] = json_decode($profile['preferences'], true);
            }

            Response::success([
                'profile' => $profile
            ], 'Profile updated successfully');
        } else {
            Response::error('Failed to update profile', 500);
        }
    }

    private function getJsonInput(): array
    {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);

        return is_array($data) ? $data : [];
    }
}
