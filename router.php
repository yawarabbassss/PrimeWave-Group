<?php
// Local dev server router for extensionless clean URLs
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$file = __DIR__ . $uri;

if ($uri !== '/' && file_exists($file) && !is_dir($file)) {
    return false; // Serve static file as-is
}

if ($uri !== '/' && file_exists($file . '.html')) {
    header('Content-Type: text/html; charset=UTF-8');
    include $file . '.html';
    return true;
}

if ($uri === '/' && file_exists(__DIR__ . '/index.html')) {
    header('Content-Type: text/html; charset=UTF-8');
    include __DIR__ . '/index.html';
    return true;
}

return false;
