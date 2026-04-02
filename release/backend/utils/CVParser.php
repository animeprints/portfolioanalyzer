<?php

namespace App\Utils;

class CVParser
{
    public static function parseFile(string $filepath, string $originalName): array
    {
        $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));

        switch ($ext) {
            case 'pdf':
                return self::parsePDF($filepath);
            case 'docx':
                return self::parseDOCX($filepath);
            case 'txt':
                return self::parseTXT($filepath);
            default:
                throw new \Exception('Unsupported file type');
        }
    }

    private static function parsePDF(string $filepath): array
    {
        // Try using pdftotext command (typically available on Linux shared hosting)
        $output = [];
        $returnVar = 0;
        $command = escapeshellcmd("pdftotext '" . $filepath . "' -");
        exec($command, $output, $returnVar);

        if ($returnVar === 0 && !empty($output)) {
            return [
                'text' => implode("\n", $output),
                'fileType' => 'pdf'
            ];
        }

        // Fallback: simple text extraction from PDF (limited)
        return [
            'text' => self::simplePDFExtract($filepath),
            'fileType' => 'pdf'
        ];
    }

    private static function simplePDFExtract(string $filepath): string
    {
        // Very basic PDF text extraction
        $content = file_get_contents($filepath);
        $text = '';

        // Extract text between parentheses after BT/ET operators
        if (preg_match_all('/\((.*?)\)/', $content, $matches)) {
            foreach ($matches[1] as $match) {
                $text .= $match . ' ';
            }
        }

        return trim($text) ?: 'Could not extract text from PDF. Please upload a text-based PDF.';
    }

    private static function parseDOCX(string $filepath): array
    {
        $text = '';

        // DOCX is a ZIP file containing document.xml
        $zip = new ZipArchive();
        if ($zip->open($filepath) === true) {
            $xml = $zip->getFromName('word/document.xml');
            $zip->close();

            if ($xml !== false) {
                // Remove XML tags
                $text = strip_tags($xml);
                // Decode HTML entities
                $text = html_entity_decode($text, ENT_QUOTES | ENT_XML1, 'UTF-8');
                // Clean up excessive whitespace
                $text = preg_replace('/\s+/', ' ', $text);
            }
        }

        return [
            'text' => trim($text),
            'fileType' => 'docx'
        ];
    }

    private static function parseTXT(string $filepath): array
    {
        $text = file_get_contents($filepath);

        return [
            'text' => $text,
            'fileType' => 'txt'
        ];
    }

    // Extraction helpers (similar to the TypeScript version)
    public static function extractEmail(string $text): ?string
    {
        $pattern = '/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/';
        if (preg_match($pattern, $text, $matches)) {
            return $matches[0];
        }
        return null;
    }

    public static function extractPhone(string $text): ?string
    {
        $pattern = '/(\+?1?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4})/';
        if (preg_match($pattern, $text, $matches)) {
            return $matches[0];
        }
        return null;
    }

    public static function extractLinkedIn(string $text): ?string
    {
        $pattern = '/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i';
        if (preg_match($pattern, $text, $matches)) {
            return $matches[0];
        }
        return null;
    }

    public static function extractGitHub(string $text): ?string
    {
        $pattern = '/github\.com\/[a-zA-Z0-9_-]+/i';
        if (preg_match($pattern, $text, $matches)) {
            return $matches[0];
        }
        return null;
    }

    public static function extractWebsite(string $text): ?string
    {
        $pattern = '/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i';
        if (preg_match_all($pattern, $text, $matches)) {
            foreach ($matches[0] as $url) {
                if (!stripos($url, 'linkedin.com') && !stripos($url, 'github.com')) {
                    return $url;
                }
            }
        }
        return null;
    }

    public static function extractName(array $lines): ?string
    {
        $firstLines = array_slice($lines, 0, 5);

        foreach ($firstLines as $line) {
            $trimmed = trim($line);
            if ($trimmed &&
                !$trimmed ||
                strpos($trimmed, '@') !== false ||
                preg_match('/^\d+/', $trimmed) ||
                $trimmed.length < 2 || $trimmed.length >= 40
            ) {
                continue;
            }

            if (preg_match('/^(summary|experience|education|skills|projects|certifications|contact)$/i', $trimmed)) {
                continue;
            }

            return $trimmed;
        }

        return null;
    }
}
