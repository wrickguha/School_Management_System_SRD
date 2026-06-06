<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class ConvertCamelToSnake
{
    /**
     * Handle an incoming request by converting camelCase keys to snake_case.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->isJson()) {
            $request->replace($this->convertArray($request->all()));
        } else {
            $request->merge($this->convertArray($request->all()));
        }

        return $next($request);
    }

    /**
     * Recursively convert array keys from camelCase to snake_case.
     */
    private function convertArray(array $array): array
    {
        $result = [];
        foreach ($array as $key => $value) {
            $snakeKey = Str::snake($key);
            if (is_array($value)) {
                $result[$snakeKey] = $this->convertArray($value);
            } else {
                $result[$snakeKey] = $value;
            }
        }
        return $result;
    }
}
