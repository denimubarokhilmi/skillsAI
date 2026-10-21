<?php

namespace Larapruner;

class ClassScanner
{
    private array $skipClasses = [
        'App\\Providers\\',
        'App\\Http\\Kernel',
        'App\\Console\\Kernel',
        'App\\Models\\User',
    ];

    public function scan(string $projectPath): array
    {
        $declared  = $this->findDeclaredClasses($projectPath);
        $referenced = $this->findReferencedClasses($projectPath);
        $configRegistered = $this->findConfigRegisteredClasses($projectPath);

        $unused = [];
        foreach ($declared as $class => $file) {
            if ($this->isSkipped($class)) continue;
            if (in_array($class, $configRegistered)) continue;
            if (!in_array($class, $referenced)) {
                $unused[] = ['class' => $class, 'file' => str_replace($projectPath . '/', '', $file)];
            }
        }

        return $unused;
    }

    private function findDeclaredClasses(string $path): array
    {
        $classes = [];
        $files = $this->globRecursive($path . '/app', '*.php');

        foreach ($files as $file) {
            $content   = file_get_contents($file);
            $namespace = '';
            if (preg_match('/^namespace\s+([^;]+);/m', $content, $m)) {
                $namespace = trim($m[1]);
            }
            if (preg_match('/^(?:abstract\s+|final\s+)?(?:class|interface|trait|enum)\s+(\w+)/m', $content, $m)) {
                $fqcn = $namespace ? $namespace . '\\' . $m[1] : $m[1];
                $classes[$fqcn] = $file;
            }
        }

        return $classes;
    }

    private function findReferencedClasses(string $path): array
    {
        $refs  = [];
        $dirs  = ['app', 'config', 'routes', 'database', 'resources'];

        $files = [];
        foreach ($dirs as $dir) {
            $fullDir = $path . '/' . $dir;
            if (!is_dir($fullDir)) continue;
            $files = array_merge($files, $this->globRecursive($fullDir, '*.php'));
            $files = array_merge($files, $this->globRecursive($fullDir, '*.blade.php'));
        }
        $files = array_unique($files);

        // Collect per-file: namespace + use map + short-name refs
        foreach ($files as $file) {
            $content = file_get_contents($file);

            // 1. Full-namespace `use` statements → direct FQCN references
            preg_match_all('/^use\s+([\w\\\\]+(?:\s+as\s+\w+)?);/m', $content, $m);
            foreach ($m[1] as $use) {
                $use = preg_replace('/\s+as\s+\w+$/', '', trim($use));
                $refs[] = $use;
            }

            // 2. Build alias map: ShortName → FQCN
            $aliasMap = [];
            preg_match_all('/^use\s+([\w\\\\]+)(?:\s+as\s+(\w+))?;/m', $content, $useM, PREG_SET_ORDER);
            foreach ($useM as $row) {
                $fqcn  = $row[1];
                $parts = explode('\\', $fqcn);
                $alias = isset($row[2]) && $row[2] !== '' ? $row[2] : end($parts);
                $aliasMap[$alias] = $fqcn;
            }

            // 3. Current file namespace
            $fileNs = '';
            if (preg_match('/^namespace\s+([\w\\\\]+);/m', $content, $nm)) {
                $fileNs = trim($nm[1]);
            }

            // 4. new ClassName / instanceof ClassName / ClassName:: / @param ClassName
            preg_match_all(
                '/(?:new|instanceof|@param|@var|@return|@throws)\s+([\w\\\\]+)|(?<![\\\\])\b([\w]+)::/',
                $content,
                $shortM,
                PREG_SET_ORDER
            );
            foreach ($shortM as $sm) {
                $shortName = $sm[1] !== '' ? $sm[1] : $sm[2];
                if (empty($shortName)) continue;

                if (str_contains($shortName, '\\')) {
                    // Already FQCN
                    $refs[] = $shortName;
                } elseif (isset($aliasMap[$shortName])) {
                    // Resolve via use alias
                    $refs[] = $aliasMap[$shortName];
                } elseif ($fileNs) {
                    // Same-namespace reference
                    $refs[] = $fileNs . '\\' . $shortName;
                }
            }

            // 5. Full FQCN inline references  App\Foo\Bar
            preg_match_all('/App\\\\[\w\\\\]+/', $content, $fqM);
            foreach ($fqM[0] as $ref) $refs[] = $ref;
        }

        return array_unique($refs);
    }

    private function findConfigRegisteredClasses(string $path): array
    {
        $classes = [];
        $configApp = $path . '/config/app.php';
        if (!file_exists($configApp)) return $classes;

        $content = file_get_contents($configApp);
        preg_match_all('/App\\\\[\w\\\\]+/', $content, $m);
        return array_unique($m[0]);
    }

    private function isSkipped(string $class): bool
    {
        foreach ($this->skipClasses as $skip) {
            if (str_starts_with($class, $skip) || $class === $skip) return true;
        }
        return false;
    }

    public function globRecursive(string $dir, string $pattern): array
    {
        if (!is_dir($dir)) return [];
        $results = [];
        $files = glob($dir . '/' . $pattern) ?: [];
        $results = array_merge($results, $files);
        $dirs = glob($dir . '/*', GLOB_ONLYDIR) ?: [];
        foreach ($dirs as $subdir) {
            $results = array_merge($results, $this->globRecursive($subdir, $pattern));
        }
        return $results;
    }
}
