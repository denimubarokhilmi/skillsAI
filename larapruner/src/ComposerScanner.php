<?php

namespace Larapruner;

class ComposerScanner
{
    private array $skipPackages = [
        'laravel/framework',
        'laravel/tinker',
        'php',
    ];

    public function scan(string $projectPath): array
    {
        $composerJson = $projectPath . '/composer.json';
        $composerLock = $projectPath . '/composer.lock';

        if (!file_exists($composerJson)) {
            throw new \RuntimeException("No composer.json found in: $projectPath");
        }

        $json     = json_decode(file_get_contents($composerJson), true);
        $required = array_keys($json['require'] ?? []);

        // Build namespace -> package map from composer.lock
        $nsMap = $this->buildNamespaceMap($composerLock);

        // Collect all code references
        $codeRefs = $this->collectCodeReferences($projectPath);

        $unused = [];
        foreach ($required as $package) {
            if ($this->isSkipped($package)) continue;

            $namespaces = $nsMap[$package] ?? [];
            if (empty($namespaces)) {
                // Can't determine namespace — skip (assume used)
                continue;
            }

            $isUsed = false;
            foreach ($namespaces as $ns) {
                $ns = rtrim($ns, '\\');
                foreach ($codeRefs as $ref) {
                    if (str_starts_with($ref, $ns)) {
                        $isUsed = true;
                        break 2;
                    }
                }
            }

            if (!$isUsed) {
                $unused[] = $package;
            }
        }

        return $unused;
    }

    private function buildNamespaceMap(string $lockPath): array
    {
        if (!file_exists($lockPath)) return [];

        $lock = json_decode(file_get_contents($lockPath), true);
        $map  = [];

        foreach ($lock['packages'] ?? [] as $pkg) {
            $name = $pkg['name'];
            $namespaces = [];

            foreach ($pkg['autoload']['psr-4'] ?? [] as $ns => $path) {
                $namespaces[] = $ns;
            }
            foreach (array_keys($pkg['autoload']['classmap'] ?? []) as $ns) {
                $namespaces[] = $ns;
            }

            if (!empty($namespaces)) {
                $map[$name] = $namespaces;
            }
        }

        return $map;
    }

    private function collectCodeReferences(string $path): array
    {
        $refs  = [];
        $scanner = new ClassScanner();
        $dirs = ['app', 'config', 'routes', 'database', 'resources'];

        foreach ($dirs as $dir) {
            $fullDir = $path . '/' . $dir;
            if (!is_dir($fullDir)) continue;

            $phpFiles   = $scanner->globRecursive($fullDir, '*.php');
            $bladeFiles = $scanner->globRecursive($fullDir, '*.blade.php');

            foreach (array_merge($phpFiles, $bladeFiles) as $file) {
                $content = file_get_contents($file);
                preg_match_all('/^use\s+([^;{]+);/m', $content, $m);
                foreach ($m[1] as $use) $refs[] = trim($use);

                preg_match_all('/(?:new|instanceof)\s+([\w\\\\]+)/', $content, $m2);
                foreach ($m2[1] as $ref) $refs[] = $ref;

                preg_match_all('/([\w\\\\]+)::/', $content, $m3);
                foreach ($m3[1] as $ref) $refs[] = $ref;
            }
        }

        return array_unique($refs);
    }

    private function isSkipped(string $package): bool
    {
        if (str_starts_with($package, 'ext-')) return true;
        return in_array($package, $this->skipPackages);
    }
}
