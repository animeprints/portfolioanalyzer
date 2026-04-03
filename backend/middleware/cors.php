<?php

namespace App\Middleware;

class CorsMiddleware
{
    public function handle(): void
    {
        // Hardcoded allowed origins for production - works even if .env fails to load
        $defaultOrigins = [
            'http://localhost:5173',
            'https://portfolioanalyzer-three.vercel.app',
            'https://portfolioanalyzer.cardzey.com',
            'https://dizitrends.cardzey.com',
        ];

        // Try to get from .env first, fallback to hardcoded
        $envOrigins = $_ENV['ALLOWED_ORIGINS'] ?? '';
        $allowedOrigins = $envOrigins
            ? array_map('trim', explode(',', $envOrigins))
            : $defaultOrigins;

        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

        // Debug logging (uncomment if needed)
        // error_log("CORS: Origin=$origin, Allowed=" . implode(',', $allowedOrigins));

        // Allow configured origins OR any vercel.app subdomain (for Vercel preview deployments)
        if (in_array($origin, $allowedOrigins) || str_ends_with($origin, '.vercel.app') || str_ends_with($origin, '.cardzey.com')) {
            header("Access-Control-Allow-Origin: $origin");
            header('Access-Control-Allow-Credentials: true');
        }

        header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
        header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
        header('Access-Control-Max-Age: 86400'); // Cache preflight for 24 hours

        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit;
        }
    }
}
