<?php
// Standalone script to extract vendor.zip on the server.
// Does not load Laravel, to prevent crashes when vendor directory is missing.

header('Content-Type: application/json');

function getEnvValue($key) {
    $path = __DIR__ . '/../.env';
    if (!file_exists($path)) {
        return null;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if (empty($line) || strpos($line, '#') === 0) continue;
        if (strpos($line, '=') === false) continue;
        list($name, $value) = explode('=', $line, 2);
        if (trim($name) === $key) {
            return trim($value, " \t\n\r\0\x0B\"'");
        }
    }
    return null;
}

$expectedSecret = getEnvValue('DEPLOY_SECRET');

if (!$expectedSecret || strlen($expectedSecret) < 8) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['error' => 'Deploy utility is disabled. Set a DEPLOY_SECRET in .env (min 8 chars) to enable it.']);
    exit;
}

$secret = $_GET['secret'] ?? '';
if ($secret !== $expectedSecret) {
    header('HTTP/1.1 403 Forbidden');
    echo json_encode(['error' => 'Unauthorized. Invalid secret.']);
    exit;
}

$zipFile = __DIR__ . '/../vendor.zip';
$extractTo = __DIR__ . '/../';

if (!file_exists($zipFile)) {
    header('HTTP/1.1 404 Not Found');
    echo json_encode(['error' => 'vendor.zip not found on the server. Make sure it was uploaded to the backend root.']);
    exit;
}

if (!class_exists('ZipArchive')) {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'PHP ZipArchive extension is not enabled on this server. Please enable it in cPanel PHP Selector.']);
    exit;
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);

if ($res === TRUE) {
    // Extract to the root folder (../../ which contains vendor/)
    $zip->extractTo($extractTo);
    $zip->close();
    
    // Delete the zip file to clean up space
    unlink($zipFile);
    
    echo json_encode(['message' => 'vendor.zip extracted successfully and cleaned up.']);
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Failed to extract vendor.zip. Code: ' . $res]);
}
