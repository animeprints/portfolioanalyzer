<?php

namespace App\Utils;

class AnalysisEngine
{
    private const SKILL_DATABASE = [
        'technical' => [
            'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'swift',
            'react', 'vue', 'angular', 'node.js', 'express', 'django', 'flask', 'spring', 'laravel',
            'html', 'css', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'webpack', 'vite',
            'git', 'github', 'gitlab', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform',
            'mongodb', 'postgresql', 'mysql', 'redis', 'elasticsearch', 'neo4j', 'sqlite',
            'rest', 'graphql', 'grpc', 'soap', 'api', 'microservices', 'serverless',
            'machine learning', 'deep learning', 'tensorflow', 'pytorch', 'scikit-learn', 'nlp',
            'data analysis', 'data science', 'big data', 'hadoop', 'spark', 'kafka',
            'ios', 'android', 'flutter', 'react native', 'xamarin', 'kotlin', 'objective-c',
            'linux', 'unix', 'bash', 'powershell', 'ci/cd', 'jenkins', 'circleci', 'travis',
            'agile', 'scrum', 'kanban', 'jira', 'confluence', 'notion',
            'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'ui/ux',
            'testing', 'jest', 'mocha', 'chai', 'pytest', 'selenium', 'cypress', 'postman',
            'websocket', 'socket.io', 'webrtc', 'oauth', 'jwt', 'saml', 'sso'
        ],
        'soft' => [
            'communication', 'teamwork', 'leadership', 'problem-solving', 'critical thinking',
            'time management', 'adaptability', 'creativity', 'collaboration', 'conflict resolution',
            'emotional intelligence', 'negotiation', 'presentation', 'public speaking',
            'mentoring', 'coaching', 'decision making', 'strategic thinking',
            'self-motivation', 'work ethic', 'attention to detail', 'organization', 'planning'
        ],
        'business' => [
            'project management', 'product management', 'business analysis', 'requirement gathering',
            'stakeholder management', 'budgeting', 'forecasting', 'strategy', 'marketing',
            'seo', 'sem', 'content marketing', 'social media', 'analytics', 'google analytics',
            'sales', 'customer success', 'account management', 'contract negotiation',
            'operations', 'logistics', 'supply chain', 'procurement', 'quality assurance',
            'risk management', 'compliance', 'audit', 'change management'
        ],
        'languages' => [
            'english', 'spanish', 'french', 'german', 'chinese', 'japanese', 'korean',
            'arabic', 'russian', 'portuguese', 'italian', 'hindi', 'bengali', 'dutch'
        ],
        'tools' => [
            'vs code', 'visual studio', 'intellij', 'pycharm', 'eclipse', 'netbeans',
            'jira', 'confluence', 'notion', 'asana', 'trello', 'monday', 'slack', 'teams',
            'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator', 'after effects',
            'excel', 'powerpoint', 'word', 'google sheets', 'looker studio', 'tableau', 'power bi',
            'terminal', 'command line', 'postman', 'insomnia'
        ]
    ];

    private const ACTION_VERBS = [
        'achieved', 'improved', 'increased', 'decreased', 'reduced', 'optimized',
        'developed', 'implemented', 'created', 'designed', 'led', 'managed',
        'launched', 'delivered', 'completed', 'saved', 'generated', 'expanded'
    ];

    private const DEGREE_KEYWORDS = [
        'bachelor', 'master', 'phd', 'doctorate', 'b.s.', 'm.s.', 'b.a.', 'm.a.',
        'bs', 'ms', 'ba', 'ma', 'associate', 'diploma', 'certificate'
    ];

    public function analyze(string $text, array $parsedData = null): array
    {
        $lowerText = mb_strtolower($text);
        $lines = preg_split('/\r\n|\r|\n/', $text);
        $lines = array_filter($lines, fn($line) => trim($line) !== '');

        // Extract personal info
        $personalInfo = [
            'name' => $this->extractName($lines),
            'email' => CVParser::extractEmail($text),
            'phone' => CVParser::extractPhone($text),
            'linkedin' => CVParser::extractLinkedIn($text),
            'github' => CVParser::extractGitHub($text),
            'website' => CVParser::extractWebsite($text)
        ];

        // Extract skills
        $skills = $this->extractSkills($lowerText);

        // Analyze experience
        $experience = $this->analyzeExperience($text);

        // Extract education
        $education = $this->extractEducation($text);

        // Calculate scores
        $scores = $this->calculateScores($text, $lowerText, $skills, $experience);

        // Generate feedback
        $feedback = $this->generateFeedback($text, $lowerText, $skills, $experience, $scores);

        // Extract summary
        $summary = $this->extractSummary($text);

        return [
            'personalInfo' => array_filter($personalInfo, fn($v) => $v !== null),
            'summary' => $summary,
            'skills' => $skills,
            'experience' => $experience,
            'education' => $education,
            'scores' => $scores,
            'feedback' => $feedback
        ];
    }

    private function extractName(array $lines): ?string
    {
        $firstLines = array_slice($lines, 0, 5);

        foreach ($firstLines as $line) {
            $trimmed = trim($line);
            if (!$trimmed ||
                mb_strlen($trimmed) < 2 ||
                mb_strlen($trimmed) >= 40 ||
                str_contains($trimmed, '@') ||
                preg_match('/^\d+/', $trimmed)
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

    private function extractSummary(string $text): ?string
    {
        $patterns = [
            '/summary[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i',
            '/profile[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i',
            '/objective[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i',
            '/about[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n)/i'
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                return trim(mb_substr($matches[1], 0, 500));
            }
        }

        // Fallback: first few sentences
        $sentences = preg_split('/[.!?]+/', $text);
        $sentences = array_filter($sentences, fn($s) => mb_strlen(trim($s)) > 20);
        $firstTwo = array_slice($sentences, 0, 2);
        return trim(implode('. ', $firstTwo) . '.');
    }

    private function extractSkills(string $lowerText): array
    {
        $foundSkills = [];

        foreach (self::SKILL_DATABASE as $category => $skillList) {
            foreach ($skillList as $skill) {
                if (mb_strpos($lowerText, $skill) !== false) {
                    $frequency = substr_count($lowerText, $skill);
                    $relevance = $this->calculateSkillRelevance($skill, $lowerText);
                    $score = min(100, 50 + $frequency * 10 + $relevance * 30);

                    $foundSkills[] = [
                        'name' => $skill,
                        'category' => $category,
                        'score' => $score,
                        'relevance' => $relevance
                    ];
                }
            }
        }

        // Remove duplicates by name
        $unique = [];
        $seen = [];
        foreach ($foundSkills as $skill) {
            if (!in_array($skill['name'], $seen)) {
                $seen[] = $skill['name'];
                $unique[] = $skill;
            }
        }

        // Sort by relevance
        usort($unique, function($a, $b) {
            return $b['relevance'] <=> $a['relevance'];
        });

        return array_slice($unique, 0, 30);
    }

    private function calculateSkillRelevance(string $skill, string $text): float
    {
        $contextBoost = preg_match('/project|experience|work|achievement|developed|built|created|managed/i', $text) ? 1.2 : 1;
        $frequency = substr_count($text, $skill);
        return min(1.0, $frequency * 0.1) * $contextBoost;
    }

    private function analyzeExperience(array|string $text): array
    {
        if (is_array($text)) {
            $text = implode("\n", $text);
        }

        $years = 0;
        $lowerText = mb_strtolower($text);

        // Pattern 1: "X+ years of experience"
        if (preg_match('/(\d+)\+?\s+years?\s+experience/i', $lowerText, $matches)) {
            $years = (int)$matches[1];
        }
        // Pattern 2: date ranges like "2020 - Present" or "2020 - 2023"
        elseif (preg_match_all('/(20\d{2})\s*[-–]\s*(?:present|current|20\d{2})/i', $text, $matches)) {
            $years = min(count($matches[1]) * 2, 20);
        }

        if ($years === 0) $years = 1;

        // Determine level
        $level = 'junior';
        if ($years >= 10) $level = 'lead';
        elseif ($years >= 7) $level = 'senior';
        elseif ($years >= 3) $level = 'mid';

        $positions = $this->extractPositions($text);

        return [
            'years' => $years,
            'level' => $level,
            'positions' => $positions
        ];
    }

    private function extractPositions(string $text): array
    {
        $positions = [];
        $lines = preg_split('/\r\n|\r|\n/', $text);
        $lines = array_filter($lines, fn($line) => trim($line) !== '');

        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);
            $lineLength = mb_strlen($line);

            if (!$line ||
                $lineLength > 60 ||
                $lineLength < 5 ||
                preg_match('/^(summary|education|skills|projects|certifications|contact)$/i', $line) ||
                preg_match('/^[a-zA-Z\s]+ University|College|Institute/i', $line) ||
                str_contains($line, '@') ||
                preg_match('/^\d+/', $line)
            ) {
                continue;
            }

            $lowerLine = mb_strtolower($line);
            $isJobTitle = preg_match('/^(senior|junior|lead|principal|staff|chief|director|manager)\s+[A-Z]/i', $line) ||
                         preg_match('/(Engineer|Developer|Designer|Analyst|Consultant|Architect|Specialist)$/i', $line) ||
                         preg_match('/^[A-Z][a-z]+ [A-Z][a-z]+$/', $line);

            if ($isJobTitle) {
                $positions[] = [
                    'title' => $line,
                    'company' => isset($lines[$i+1]) ? trim($lines[$i+1]) : 'Unknown',
                    'duration' => '',
                    'description' => []
                ];
            }
        }

        return array_slice($positions, 0, 5);
    }

    private function extractEducation(string $text): array
    {
        $education = [];
        $educationSection = $this->findSection($text, 'education');

        if ($educationSection) {
            $lines = preg_split('/\r\n|\r|\n/', $educationSection);
            foreach ($lines as $line) {
                $trimmed = trim($line);
                if ($trimmed && mb_strlen($trimmed) > 10 && mb_strlen($trimmed) < 100) {
                    foreach (self::DEGREE_KEYWORDS as $degree) {
                        if (mb_stripos($trimmed, $degree) !== false) {
                            $education[] = [
                                'degree' => $trimmed,
                                'institution' => '',
                                'year' => ''
                            ];
                            break;
                        }
                    }
                }
            }
        }

        return array_slice($education, 0, 3);
    }

    private function findSection(string $text, string $sectionName): ?string
    {
        $pattern = '/' . preg_quote($sectionName, '/') . '[:\s]*\n([\s\S]*?)(?=\n\n|\n[A-Z][a-z]+[:\s]*\n|$)/i';
        if (preg_match($pattern, $text, $matches)) {
            return trim($matches[1]);
        }
        return null;
    }

    private function calculateScores(string $text, string $lowerText, array $skills, array $experience): array
    {
        $ats = $this->calculateATSScore($lowerText, $skills);
        $readability = $this->calculateReadabilityScore($text);
        $impact = $this->calculateImpactScore($text);
        $completeness = $this->calculateCompletenessScore($text, $skills, $experience);

        $overall = round(
            $ats * 0.35 +
            $readability * 0.2 +
            $impact * 0.25 +
            $completeness * 0.2
        );

        return [
            'overall' => $overall,
            'ats' => $ats,
            'readability' => $readability,
            'impact' => $impact,
            'completeness' => $completeness
        ];
    }

    private function calculateATSScore(string $text, array $skills): int
    {
        $score = 50;

        // Skills presence
        if (count($skills) >= 10) $score += 20;
        elseif (count($skills) >= 5) $score += 10;

        // Contact info
        if (str_contains($text, '@') && preg_match('/\+?\d/', $text)) $score += 10;

        // Section headers
        $sections = ['experience', 'education', 'skills'];
        foreach ($sections as $section) {
            if (str_contains($text, $section)) $score += 5;
        }

        // Penalty for very long lines
        $lines = preg_split('/\r\n|\r|\n/', $text);
        $longLines = array_filter($lines, fn($line) => mb_strlen(trim($line)) > 120);
        if (count($longLines) > 10) $score -= 10;

        return max(0, min(100, $score));
    }

    private function calculateReadabilityScore(string $text): int
    {
        $sentences = preg_split('/[.!?]+/', $text);
        $sentences = array_filter($sentences, fn($s) => trim($s) !== '');
        $words = preg_split('/\s+/', $text);
        $words = array_filter($words, fn($w) => $w !== '');

        if (count($sentences) == 0) return 70;

        $avgSentenceLength = count($words) / count($sentences);

        if ($avgSentenceLength >= 10 && $avgSentenceLength <= 25) return 85;
        if ($avgSentenceLength < 10 || $avgSentenceLength > 30) return 60;

        return 70;
    }

    private function calculateImpactScore(string $text): int
    {
        $score = 50;
        $lowerText = mb_strtolower($text);

        foreach (self::ACTION_VERBS as $verb) {
            if (str_contains($lowerText, $verb)) $score += 2;
        }

        // Quantifiable achievements
        $metrics = [];
        if (preg_match_all('/(\d+%|\$\d+|\d+\s*(?:million|billion|k|percent|%|year|month|week|day))/i', $text, $matches)) {
            $metrics = $matches[0];
        }
        if (count($metrics) > 0) $score += min(count($metrics) * 3, 20);

        return min(100, $score);
    }

    private function calculateCompletenessScore(string $text, array $skills, array $experience): int
    {
        $score = 0;
        $lowerText = mb_strtolower($text);

        // Essential sections
        $required = ['experience', 'education', 'contact', 'skills'];
        foreach ($required as $section) {
            if (str_contains($lowerText, $section)) $score += 15;
        }

        // Skills diversity
        if (count($skills) >= 15) $score += 20;
        elseif (count($skills) >= 8) $score += 10;

        // Experience depth
        if (count($experience['positions']) >= 3) $score += 15;
        elseif (count($experience['positions']) >= 1) $score += 5;

        return min(100, $score);
    }

    private function generateFeedback(string $text, string $lowerText, array $skills, array $experience, array $scores): array
    {
        $strengths = [];
        $improvements = [];
        $keywords = [];
        $missingSkills = [];

        // Strengths
        if ($scores['overall'] >= 80) {
            $strengths[] = 'Excellent CV structure and content';
        }
        if (count($skills) >= 15) {
            $strengths[] = "Strong skill set with " . count($skills) . " identified skills";
        }
        if ($scores['impact'] >= 75) {
            $strengths[] = 'Good use of action verbs and quantifiable achievements';
        }
        if ($experience['years'] >= 5) {
            $strengths[] = "Substantial experience ({$experience['years']} years)";
        }
        if (str_contains($text, '@') && preg_match('/\+?\d/', $text)) {
            $strengths[] = 'Complete contact information';
        }

        // Improvements
        if ($scores['ats'] < 70) {
            $improvements[] = 'Optimize for ATS: use standard section headers, avoid complex formatting';
        }
        if (count($skills) < 10) {
            $improvements[] = 'Add more relevant technical and soft skills';
        }
        if ($scores['readability'] < 70) {
            $improvements[] = 'Improve readability: use shorter sentences, bullet points';
        }
        if (!preg_match('/\d+%|\$\d+|\d+\s*(?:million|billion|k|percent|%)/i', $text)) {
            $improvements[] = 'Include quantifiable achievements with metrics and percentages';
        }
        if (stripos($lowerText, 'reference available') !== false || stripos($lowerText, 'references upon request') !== false) {
            $improvements[] = 'Remove "References available" - use that space for valuable content';
        }

        // Missing high-value skills (suggested)
        $skillNames = array_column($skills, 'name');
        $allSkills = array_merge(self::SKILL_DATABASE['technical'], self::SKILL_DATABASE['soft'], self::SKILL_DATABASE['business']);
        $missing = array_diff($allSkills, $skillNames);
        if (count($missing) > 0 && $experience['level'] !== 'junior') {
            $missingSkills = array_slice($missing, 0, 5);
        }

        // Keywords (most frequent words)
        $words = preg_split('/\s+/', mb_strtolower($text));
        $wordFreq = [];
        $stopWords = ['the', 'and', 'or', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'as', 'is', 'was', 'are', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];

        foreach ($words as $word) {
            $clean = preg_replace('/[^a-z0-9]/', '', $word);
            if ($clean && mb_strlen($clean) > 3 && !in_array($clean, $stopWords)) {
                $wordFreq[$clean] = ($wordFreq[$clean] ?? 0) + 1;
            }
        }

        arsort($wordFreq);
        $keywords = array_slice(array_keys($wordFreq), 0, 10);

        return [
            'strengths' => array_slice($strengths, 0, 5),
            'improvements' => array_slice($improvements, 0, 5),
            'keywords' => $keywords,
            'missingSkills' => array_slice($missingSkills, 0, 5)
        ];
    }

    private function generateId(): string
    {
        return uniqid('', true) . bin2hex(random_bytes(8));
    }
}
