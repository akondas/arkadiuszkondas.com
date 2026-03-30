<?php

/**
 * Patches for vendor dependencies to work with current setup.
 * Run automatically via composer post-install-cmd / post-update-cmd.
 */

// Fix 1: ParsedownExtraPlugin v1.1.6 blockFencedCode drops <code> wrapper.
// Delegate to parent ParsedownExtra which renders correctly.
$file = __DIR__ . '/../vendor/tovic/parsedown-extra-plugin/ParsedownExtraPlugin.php';
if (file_exists($file)) {
    $code = file_get_contents($file);
    $search = 'protected function blockFencedCode($line) {
        if (preg_match';
    if (strpos($code, $search) !== false) {
        // Find the full method and replace with parent delegation
        $pattern = '/(    protected function blockFencedCode\(\$line\) \{)\n.*?(\n    \}\n\n    \/\/ ~\n    protected function unmarkedText)/s';
        $replacement = '$1' . "\n        return parent::blockFencedCode(\$line);\n    }\n\n    // ~\n    protected function unmarkedText";
        $code = preg_replace($pattern, $replacement, $code, 1);
        file_put_contents($file, $code);
        echo "Patched: ParsedownExtraPlugin blockFencedCode\n";
    }
}

// Fix 2: ParsedownExtra 0.7.1 crashes on empty markup (PHP 7.4 DOM issue).
$file = __DIR__ . '/../vendor/erusev/parsedown-extra/ParsedownExtra.php';
if (file_exists($file)) {
    $code = file_get_contents($file);
    $search = '$elementMarkup = mb_convert_encoding($elementMarkup, \'HTML-ENTITIES\', \'UTF-8\');

        # http://stackoverflow.com/q/4879946/200145
        $DOMDocument->loadHTML($elementMarkup);';
    if (strpos($code, $search) !== false && strpos($code, 'trim($elementMarkup)') === false) {
        $replacement = '$elementMarkup = mb_convert_encoding($elementMarkup, \'HTML-ENTITIES\', \'UTF-8\');

        if (trim($elementMarkup) === \'\') {
            return $elementMarkup;
        }

        # http://stackoverflow.com/q/4879946/200145
        $DOMDocument->loadHTML($elementMarkup);';
        $code = str_replace($search, $replacement, $code);
        file_put_contents($file, $code);
        echo "Patched: ParsedownExtra empty markup guard\n";
    }
}
