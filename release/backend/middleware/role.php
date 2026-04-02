<?php

namespace App\Middleware;

class RoleMiddleware
{
    private array $allowedRoles;

    public function __construct(array $allowedRoles)
    {
        $this->allowedRoles = $allowedRoles;
    }

    public function handle(): void
    {
        $userRole = $GLOBALS['auth_user_role'] ?? null;

        if (!$userRole || !in_array($userRole, $this->allowedRoles, true)) {
            http_response_code(403);
            echo json_encode([
                'success' => false,
                'error' => 'Forbidden - Insufficient permissions',
                'required_roles' => $this->allowedRoles,
                'user_role' => $userRole
            ]);
            exit;
        }
    }
}
