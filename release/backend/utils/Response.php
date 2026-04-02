<?php

namespace App\Utils;

class Response
{
    public static function json($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_PRETTY_PRINT);
    }

    public static function error(string $message, int $status = 400): void
    {
        self::json([
            'success' => false,
            'error' => $message
        ], $status);
    }

    public static function success($data, string $message = ''): void
    {
        self::json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ]);
    }
}
