<?php

namespace Larapruner;

class Renderer
{
    public function renderJson(array $results): string
    {
        return json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    public function renderHuman(array $results): string
    {
        $out = [];

        $classes = $results['unused_classes'] ?? [];
        $out[] = $this->header('UNUSED CLASSES');
        if (empty($classes)) {
            $out[] = "  -> None found";
        } else {
            foreach ($classes as $item) {
                $out[] = sprintf("  %-60s (%s)", $item['class'], $item['file']);
            }
        }

        $deps = $results['unused_composer_deps'] ?? [];
        $out[] = '';
        $out[] = $this->header('UNUSED COMPOSER DEPS');
        if (empty($deps)) {
            $out[] = "  -> None found";
        } else {
            foreach ($deps as $dep) {
                $out[] = "  $dep";
            }
        }

        // Tests
        if (isset($results['tests'])) {
            $t = $results['tests'];
            $out[] = '';
            $out[] = $this->header('TEST COVERAGE');
            if (!$t['tests_enabled']) {
                $out[] = '  -> ' . ($t['error'] ?? 'Tests not available');
            } else {
                $out[] = sprintf('  Test files found:  %d', $t['test_count']);
                $out[] = sprintf('  Untested classes:  %d', count($t['untested']));

                if (!empty($t['test_output'])) {
                    $icon = ($t['tests_exit_code'] ?? 1) === 0 ? 'OK' : 'FAIL';
                    $out[] = '';
                    $lines = explode("\n", trim($t['test_output']));
                    $summary = [];
                    foreach ($lines as $l) {
                        if (preg_match('/^(Tests:|PASS|FAIL|ERROR)/i', $l)
                            || preg_match('/^[✔✘✓✗]/u', $l)
                            || preg_match('/^\d+ test/', $l)
                            || str_contains($l, 'assertion')
                            || str_contains($l, 'php not found')) {
                            $summary[] = $l;
                        }
                    }
                    if (!empty($summary)) {
                        $out[] = "  [$icon]";
                        foreach ($summary as $s) {
                            $out[] = '  ' . $s;
                        }
                    } else {
                        $out[] = "  [$icon artisan test — exit: " . ($t['tests_exit_code'] ?? 'N/A') . ']';
                        foreach (array_slice($lines, 0, 3) as $l) {
                            $out[] = '  ' . $l;
                        }
                    }
                }

                if (!empty($t['untested'])) {
                    $out[] = '';
                    $out[] = '  [UNTESTED CLASSES]';
                    foreach ($t['untested'] as $u) {
                        $out[] = sprintf('    - %-55s (%s)', $u['class'], $u['file']);
                    }
                }
            }
        }

        // Security
        if (isset($results['security'])) {
            $issues = $results['security']['issues'] ?? [];
            $out[] = '';
            $out[] = $this->header('SECURITY AUDIT');
            if (empty($issues)) {
                $out[] = "  -> No issues found";
            } else {
                foreach ($issues as $issue) {
                    $sev  = strtoupper($issue['severity']);
                    $out[] = "  [$sev] [{$issue['check']}] {$issue['detail']}";
                    $out[] = "       File: {$issue['file']}";
                }
            }
        }

        // Refactor
        if (isset($results['refactor'])) {
            $smells = $results['refactor']['smells'] ?? [];
            $out[] = '';
            $out[] = $this->header('REFACTOR SMELLS');
            if (empty($smells)) {
                $out[] = "  -> No smells detected";
            } else {
                $grouped = [];
                foreach ($smells as $smell) {
                    $grouped[$smell['type']][] = $smell;
                }
                foreach ($grouped as $type => $items) {
                    $out[] = "  [" . strtoupper(str_replace('_', ' ', $type)) . "]";
                    foreach ($items as $item) {
                        $loc = $item['method'] ?? $item['class'];
                        $out[] = "    - $loc";
                        $out[] = "      " . $item['detail'];
                        $out[] = "      {$item['file']}";
                    }
                    $out[] = '';
                }
            }
        }

        if (isset($results['fixed_files'])) {
            $out[] = '';
            $out[] = $this->header('AUTO-FIXED FILES');
            if (empty($results['fixed_files'])) {
                $out[] = "  Nothing to fix";
            } else {
                foreach ($results['fixed_files'] as $f) {
                    $out[] = "  -> $f";
                }
            }
        }

        $s = $results['summary'] ?? [];
        $out[] = '';
        $out[] = $this->header('SUMMARY');
        $out[] = sprintf("  Unused classes:        %d", $s['unused_classes'] ?? 0);
        $out[] = sprintf("  Unused packages:       %d", $s['unused_packages'] ?? 0);
        if (isset($s['test_count'])) {
            $out[] = sprintf("  Test files:            %d", $s['test_count']);
            $out[] = sprintf("  Untested classes:      %d", $s['untested']);
        }
        if (isset($s['security_issues'])) {
            $out[] = sprintf("  Security issues:       %d", $s['security_issues']);
        }
        if (isset($s['refactor_smells'])) {
            $out[] = sprintf("  Refactor smells:       %d", $s['refactor_smells']);
        }
        $out[] = '';

        return implode("\n", $out);
    }

    private function header(string $title): string
    {
        $line = str_repeat('-', 60);
        return "\n[$title]\n$line";
    }
}
