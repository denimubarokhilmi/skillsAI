<?php

namespace Larapruner;

class RefactorDetector
{
    private const LONG_METHOD_THRESHOLD  = 50;   // lines
    private const LARGE_CLASS_THRESHOLD  = 300;  // lines
    private const DUPLICATE_MIN_LINES    = 6;    // consecutive identical lines

    public function detect(string $projectPath): array
    {
        $scanner = new ClassScanner();
        $files   = $scanner->globRecursive($projectPath . '/app', '*.php');
        $smells  = [];

        $allMethodBodies = []; // for duplicate detection

        foreach ($files as $file) {
            $content  = file_get_contents($file);
            $relFile  = str_replace($projectPath . '/', '', $file);
            $lines    = explode("\n", $content);
            $totalLines = count($lines);

            $namespace = '';
            if (preg_match('/^namespace\s+([^;]+);/m', $content, $m)) {
                $namespace = trim($m[1]);
            }
            $className = '';
            if (preg_match('/(?:class|trait|interface|enum)\s+(\w+)/m', $content, $m)) {
                $className = $m[1];
            }
            $fqcn = $namespace && $className ? $namespace . '\\' . $className : $className;

            // --- Large class ---
            if ($totalLines > self::LARGE_CLASS_THRESHOLD) {
                $smells[] = [
                    'type'   => 'large_class',
                    'class'  => $fqcn,
                    'file'   => $relFile,
                    'detail' => "$totalLines lines (threshold: " . self::LARGE_CLASS_THRESHOLD . ")",
                ];
            }

            // --- Unused imports ---
            preg_match_all('/^use\s+([^;{]+);/m', $content, $useMatches, PREG_OFFSET_CAPTURE);
            foreach ($useMatches[1] as $useMatch) {
                $fqn   = trim($useMatch[0]);
                $parts = explode('\\', $fqn);
                $alias = end($parts);
                // Count references excluding the use line itself
                $contentWithoutUse = preg_replace('/^use\s+' . preg_quote($fqn, '/') . ';/m', '', $content);
                $count = substr_count($contentWithoutUse, $alias);
                if ($count === 0) {
                    $smells[] = [
                        'type'   => 'unused_import',
                        'class'  => $fqcn,
                        'file'   => $relFile,
                        'detail' => "use $fqn is never referenced",
                    ];
                }
            }

            // --- Switch statements (OO abuser) ---
            preg_match_all('/^\s*switch\s*\(/m', $content, $switchMatches);
            if (count($switchMatches[0]) > 0) {
                $smells[] = [
                    'type'   => 'switch_statements',
                    'class'  => $fqcn,
                    'file'   => $relFile,
                    'detail' => count($switchMatches[0]) . ' switch statement(s) — consider polymorphism',
                ];
            }

            // --- Over-commented / commented-out code ---
            $commentLines = 0;
            foreach ($lines as $line) {
                $t = trim($line);
                if (str_starts_with($t, '//') || str_starts_with($t, '#') || str_starts_with($t, '*')) {
                    $commentLines++;
                }
            }
            $commentRatio = $totalLines > 0 ? $commentLines / $totalLines : 0;
            if ($commentRatio > 0.3 && $commentLines > 20) {
                $smells[] = [
                    'type'   => 'comments',
                    'class'  => $fqcn,
                    'file'   => $relFile,
                    'detail' => "$commentLines comment lines (" . round($commentRatio * 100) . "% of file) — possible commented-out dead code",
                ];
            }

            // --- Long methods ---
            $this->extractMethods($content, $fqcn, $relFile, $smells, $allMethodBodies);
        }

        // --- Duplicate code detection ---
        $this->detectDuplicates($allMethodBodies, $smells);

        return $smells;
    }

    private function extractMethods(string $content, string $fqcn, string $relFile, array &$smells, array &$allMethodBodies): void
    {
        // Match method signatures
        preg_match_all(
            '/(?:public|protected|private|static|\s)+function\s+(\w+)\s*\([^)]*\)\s*(?::\s*[\w\|?\\\\]+\s*)?\{/m',
            $content,
            $matches,
            PREG_OFFSET_CAPTURE
        );

        $lines = explode("\n", $content);

        foreach ($matches[1] as $idx => $match) {
            $methodName = $match[0];
            $offset     = $matches[0][$idx][1];
            $startLine  = substr_count(substr($content, 0, $offset), "\n");

            // Count method body by tracking braces
            $body    = '';
            $depth   = 0;
            $started = false;
            $lineCount = 0;

            for ($i = $startLine; $i < count($lines); $i++) {
                $line = $lines[$i];
                foreach (str_split($line) as $char) {
                    if ($char === '{') { $depth++; $started = true; }
                    if ($char === '}') { $depth--; }
                }
                if ($started) {
                    $body .= $line . "\n";
                    $lineCount++;
                }
                if ($started && $depth === 0) break;
            }

            if ($lineCount > self::LONG_METHOD_THRESHOLD) {
                $smells[] = [
                    'type'   => 'long_method',
                    'class'  => $fqcn,
                    'method' => $methodName,
                    'file'   => $relFile,
                    'detail' => "$lineCount lines (threshold: " . self::LONG_METHOD_THRESHOLD . ")",
                ];
            }

            $allMethodBodies[] = [
                'key'  => "$fqcn::$methodName",
                'file' => $relFile,
                'body' => trim($body),
            ];
        }
    }

    private function detectDuplicates(array $methodBodies, array &$smells): void
    {
        $seen = [];
        foreach ($methodBodies as $method) {
            $hash = md5($method['body']);
            if (isset($seen[$hash]) && strlen($method['body']) > 100) {
                $smells[] = [
                    'type'   => 'duplicate_code',
                    'class'  => $method['key'],
                    'file'   => $method['file'],
                    'detail' => "Duplicate of {$seen[$hash]['key']} ({$seen[$hash]['file']})",
                ];
            } else {
                $seen[$hash] = $method;
            }
        }
    }

    public function autoFix(string $projectPath): array
    {
        $scanner = new ClassScanner();
        $files   = $scanner->globRecursive($projectPath . '/app', '*.php');
        $fixed   = [];

        foreach ($files as $file) {
            $original = file_get_contents($file);
            $modified = $original;

            // Remove unused `use` statements
            preg_match_all('/^(use\s+([^;{]+);)\n?/m', $modified, $useMatches, PREG_SET_ORDER);

            foreach ($useMatches as $useMatch) {
                $fullStatement = $useMatch[1];
                $fqn           = trim($useMatch[2]);
                $parts         = explode('\\', $fqn);
                $alias         = end($parts);

                $withoutUse = preg_replace('/^' . preg_quote($fullStatement, '/') . '\n?/m', '', $modified);
                if (substr_count($withoutUse, $alias) === 0) {
                    $modified = $withoutUse;
                }
            }

            if ($modified !== $original) {
                file_put_contents($file, $modified);
                $fixed[] = str_replace($projectPath . '/', '', $file);
            }
        }

        return $fixed;
    }
}
