<?php

namespace Larapruner;

class SecurityAuditor
{
    public function audit(string $projectPath): array
    {
        $issues = [];
        $issues = array_merge($issues, $this->checkEnv($projectPath));
        $issues = array_merge($issues, $this->checkConfigDebug($projectPath));
        $issues = array_merge($issues, $this->checkComposerLock($projectPath));
        return $issues;
    }

    private function checkEnv(string $path): array
    {
        $issues = [];
        $envFile = $path . '/.env';

        if (!file_exists($envFile)) {
            $issues[] = [
                'check'    => 'ENV_FILE',
                'file'     => '.env',
                'severity' => 'medium',
                'detail'   => '.env file not found — using .env.example defaults?',
            ];
            return $issues;
        }

        $content = file_get_contents($envFile);
        $lines   = explode("\n", $content);
        $env     = [];

        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || str_starts_with($line, '#')) continue;
            if (str_contains($line, '=')) {
                [$key, $val] = explode('=', $line, 2);
                $env[trim($key)] = trim($val);
            }
        }

        // APP_DEBUG
        if (isset($env['APP_DEBUG']) && strtolower($env['APP_DEBUG']) === 'true') {
            $issues[] = [
                'check'    => 'APP_DEBUG',
                'file'     => '.env',
                'severity' => 'high',
                'detail'   => 'APP_DEBUG=true — must be false in production',
            ];
        }

        // APP_KEY
        $key = $env['APP_KEY'] ?? '';
        if (empty($key)) {
            $issues[] = [
                'check'    => 'APP_KEY',
                'file'     => '.env',
                'severity' => 'critical',
                'detail'   => 'APP_KEY is empty — run: php artisan key:generate',
            ];
        } elseif (!str_starts_with($key, 'base64:') && strlen($key) < 32) {
            $issues[] = [
                'check'    => 'APP_KEY',
                'file'     => '.env',
                'severity' => 'critical',
                'detail'   => 'APP_KEY appears weak (not base64 and under 32 chars)',
            ];
        }

        // DB_PASSWORD
        $dbPass = $env['DB_PASSWORD'] ?? null;
        if ($dbPass !== null && trim($dbPass) === '') {
            $issues[] = [
                'check'    => 'DB_PASSWORD',
                'file'     => '.env',
                'severity' => 'high',
                'detail'   => 'DB_PASSWORD is empty',
            ];
        }

        // APP_ENV
        $appEnv = strtolower($env['APP_ENV'] ?? '');
        if ($appEnv === 'local' || $appEnv === 'development') {
            $issues[] = [
                'check'    => 'APP_ENV',
                'file'     => '.env',
                'severity' => 'medium',
                'detail'   => "APP_ENV=$appEnv — ensure this is intentional for production",
            ];
        }

        return $issues;
    }

    private function checkConfigDebug(string $path): array
    {
        $issues  = [];
        $configApp = $path . '/config/app.php';
        if (!file_exists($configApp)) return $issues;

        $content = file_get_contents($configApp);
        // Look for hardcoded true (not env-driven)
        if (preg_match("/'debug'\s*=>\s*true/", $content)) {
            $issues[] = [
                'check'    => 'CONFIG_DEBUG',
                'file'     => 'config/app.php',
                'severity' => 'medium',
                'detail'   => "'debug' hardcoded to true in config/app.php",
            ];
        }

        return $issues;
    }

    private function checkComposerLock(string $path): array
    {
        $issues = [];
        $lockFile = $path . '/composer.lock';
        if (!file_exists($lockFile)) return $issues;

        $lock = json_decode(file_get_contents($lockFile), true);

        // Known outdated version thresholds
        $checks = [
            'phpunit/phpunit'     => ['current_stable' => '11.0', 'risky_below' => '9.0'],
            'guzzlehttp/guzzle'   => ['current_stable' => '7.0', 'risky_below' => '7.0'],
            'monolog/monolog'     => ['current_stable' => '3.0', 'risky_below' => '2.0'],
            'symfony/http-kernel' => ['current_stable' => '7.0', 'risky_below' => '6.0'],
        ];

        foreach ($lock['packages'] ?? [] as $pkg) {
            $name    = $pkg['name'];
            $version = ltrim($pkg['version'] ?? '', 'v');

            if (!isset($checks[$name])) continue;

            $threshold = $checks[$name]['risky_below'];
            if (version_compare($version, $threshold, '<')) {
                $issues[] = [
                    'check'    => 'OUTDATED_PACKAGE',
                    'file'     => 'composer.lock',
                    'severity' => 'medium',
                    'detail'   => "$name v$version is outdated (below $threshold) — run: composer audit",
                ];
            }
        }

        return $issues;
    }
}
