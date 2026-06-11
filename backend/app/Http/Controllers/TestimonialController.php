<?php

namespace App\Http\Controllers;

use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Testimonial::all());
    }
}
