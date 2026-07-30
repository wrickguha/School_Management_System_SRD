<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', '*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => array_values(array_unique(array_filter(array_merge(
        [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:5174',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:8000',
            'https://subhraedu.com',
            'https://www.subhraedu.com',
            'http://subhraedu.com',
            'http://www.subhraedu.com',
            '*',
        ],
        explode(',', env('ALLOWED_ORIGINS', '')),
        explode(',', env('FRONTEND_URL', ''))
    )))),

    'allowed_origins_patterns' => [
        '#^https?://(.*\\.)?subhraedu\\.com$#i',
        '#^https?://localhost(:[0-9]+)?$#i',
        '#^https?://127\\.0\\.0\\.1(:[0-9]+)?$#i',
        '#^https?://192\\.168\\.[0-9]+\\.[0-9]+(:[0-9]+)?$#i',
        '.*',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['*'],

    'max_age' => 86400,

    'supports_credentials' => true,

];
