<?php

namespace Larapruner;

class TestScanner
{
    public function scan(string $projectPath): array
    {
        $testDir = $projectPath . '/tests';
        if (!is_dir($testDir)) {
            return [
                'test_count'     => 0,
                'untested'       => [],
                'test_output'    => '',
                'tests_enabled'  => false,
                'error'          => 'No tests/ directory found',
            ];
        }

        $classScanner = new ClassScanner();
        $testFiles = $classScanner->globRecursive($testDir, '*Test.php');
        $testCount = count($testFiles);

        if ($testCount === 0) {
            return [
                'test_count'      => 0,
                'test_files'      => [],
                'tested_classes'  => [],
                'untested'        => [],
                'test_output'     => '',
                'tests_enabled'   => true,
                'error'           => null,
            ];
        }

        $testedClasses = [];
        foreach ($testFiles as $file) {
            $content = file_get_contents($file);

            // Resolve namespace-convention mapping:
            // Tests\Unit\Services\PaymentServiceTest -> App\Services\PaymentService
            $ns = '';
            if (preg_match('/^namespace\s+([^;]+);/m', $content, $m)) {
                $ns = trim($m[1]);
                $ns = preg_replace('/^Tests\\\\(Unit|Feature)\\\\/', '', $ns);
            }
            if (preg_match('/^(?:abstract\s+|final\s+)?class\s+(\w+)/m', $content, $cm)) {
                $className = preg_replace('/Test$/', '', trim($cm[1]));
                if ($className !== '') {
                    $fqcnFromConvention = 'App' . ($ns !== '' ? '\\' . $ns : '') . '\\' . $className;
                    $testedClasses[] = $fqcnFromConvention;
                }
            }

            // Explicit @covers annotation always takes precedence/adds too
            if (preg_match('/@covers\s+([\w\\\\]+)/', $content, $cm)) {
                $testedClasses[] = trim($cm[1]);
            }
        }
        $testedClasses = array_unique($testedClasses);

        $allAppFiles = $classScanner->globRecursive($projectPath . '/app', '*.php');
        $untested = [];
        foreach ($allAppFiles as $file) {
            $content = file_get_contents($file);
            $fqcn = $this->extractFqcn($content);
            if (empty($fqcn)) continue;

            if (str_contains($fqcn, '\\Providers\\')) continue;
            if (str_contains($fqcn, '\\Console\\Kernel')) continue;
            if (str_contains($fqcn, '\\Http\\Kernel')) continue;
            if (str_contains($fqcn, '\\Exceptions\\')) continue;

            $tested = false;
            foreach ($testedClasses as $tc) {
                if ($fqcn === $tc || str_starts_with($fqcn, $tc)) {
                    $tested = true;
                    break;
                }
            }
            if (!$tested) {
                $untested[] = [
                    'class' => $fqcn,
                    'file'  => str_replace($projectPath . '/', '', $file),
                ];
            }
        }

        // Run php artisan test using PHP_BINARY directly
        $testOutput = '';
        $exitCode = null;
        if (file_exists($projectPath . '/artisan')) {
            $phpBin = defined('PHP_BINARY') ? PHP_BINARY : 'php';
            // Fix PATH: prepend PHP dir so child process finds php binary
            $phpDir = dirname($phpBin);
            putenv('PATH=' . $phpDir . PATH_SEPARATOR . getenv('PATH'));
            $cmd = sprintf('cd %s && %s artisan test --compact --colors=never 2>&1', escapeshellarg($projectPath), escapeshellarg($phpBin));
            exec($cmd, $rawOutput, $exitCode);
            $output = implode("\n", $rawOutput);
            // Parse JSON output from --compact flag
            $trimmed = trim($output);
            if (str_starts_with($trimmed, '{')) {
                $parsed = json_decode($trimmed, true);
                if ($parsed && isset($parsed['result'])) {
                    $testOutput = sprintf(
                        'Tests: %d total, %d passed, %d failed, %d assertions (%d ms)',
                        $parsed['tests'] ?? 0,
                        $parsed['passed'] ?? 0,
                        $parsed['failed'] ?? 0,
                        $parsed['assertions'] ?? 0,
                        $parsed['duration_ms'] ?? 0
                    );
                } else {
                    $testOutput = $output;
                }
            } else {
                $testOutput = $output;
            }
        }

        return [
            'test_count'      => $testCount,
            'test_files'      => array_map(fn($f) => str_replace($projectPath . '/', '', $f), $testFiles),
            'tested_classes'  => $testedClasses,
            'untested'        => $untested,
            'test_output'     => $testOutput,
            'tests_exit_code' => $exitCode,
            'tests_enabled'   => true,
            'error'           => null,
        ];
    }

    private function extractFqcn(string $content): string
    {
        $ns = '';
        if (preg_match('/^namespace\s+([^;]+);/m', $content, $m)) {
            $ns = trim($m[1]);
        }
        if (preg_match('/^(?:abstract\s+|final\s+)?(?:class|interface|trait|enum)\s+(\w+)/m', $content, $m)) {
            $class = trim($m[1]);
            return $ns ? $ns . '\\' . $class : $class;
        }
        return '';
    }
}
