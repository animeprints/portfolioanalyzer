<?php

namespace App\Config;

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\SignatureInvalidException;
use Firebase\JWT\BeforeValidException;
use Firebase\JWT\ExpiredException;

class JWTManager
{
    private string $secret;
    private string $algorithm;

    public function __construct()
    {
        $this->secret = $_ENV['JWT_SECRET'] ?? 'default-secret-change-this';
        $this->algorithm = $_ENV['JWT_ALGORITHM'] ?? 'HS256';
    }

    public function generateToken(array $payload, int $expiry): string
    {
        $now = time();
        $token = [
            'iat' => $now,
            'exp' => $now + $expiry,
            'data' => $payload
        ];

        return JWT::encode($token, $this->secret, $this->algorithm);
    }

    public function decodeToken(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->secret, $this->algorithm));
        } catch (SignatureInvalidException $e) {
            throw new \Exception('Invalid token signature');
        } catch (BeforeValidException $e) {
            throw new \Exception('Token not yet valid');
        } catch (ExpiredException $e) {
            throw new \Exception('Token expired');
        } catch (\Exception $e) {
            throw new \Exception('Invalid token');
        }
    }

    public function generateAccessToken(array $userData): string
    {
        $expiry = (int)($_ENV['JWT_EXPIRES_IN'] ?? 900);
        return $this->generateToken([
            'userId' => $userData['id'],
            'email' => $userData['email'],
            'role' => $userData['role']
        ], $expiry);
    }

    public function generateRefreshToken(array $userData): string
    {
        $expiry = (int)($_ENV['JWT_REFRESH_EXPIRES_IN'] ?? 604800);
        return $this->generateToken([
            'userId' => $userData['id'],
            'type' => 'refresh'
        ], $expiry);
    }
}
