<?php

namespace Tests\Feature;

use App\Models\DemoRequest;
use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class DemoRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_user_can_submit_demo_request(): void
    {
        $payload = [
            'school_name' => 'Springfield Elementary',
            'contact_name' => 'Seymour Skinner',
            'email' => 'skinner@springfield.edu',
            'phone' => '1234567890',
            'student_count' => '500-1500',
        ];

        $response = $this->postJson('/api/demo/request', $payload);

        $response->assertStatus(201);
        $this->assertDatabaseHas('demo_requests', [
            'school_name' => 'Springfield Elementary',
            'contact_name' => 'Seymour Skinner',
            'status' => 'new',
        ]);
    }

    public function test_super_admin_can_list_demo_requests(): void
    {
        DemoRequest::create([
            'school_name' => 'Springfield Elementary',
            'contact_name' => 'Seymour Skinner',
            'email' => 'skinner@springfield.edu',
            'phone' => '1234567890',
            'student_count' => '500-1500',
            'status' => 'new',
        ]);

        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@subhraedu.com',
            'password' => bcrypt('admin123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($superAdmin, ['super_admin']);

        $response = $this->getJson('/api/admin/demo-requests');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
    }

    public function test_non_super_admin_cannot_list_demo_requests(): void
    {
        $school = School::create([
            'name' => 'Greenwood',
            'subdomain' => 'greenwood',
            'status' => 'active',
        ]);

        $schoolAdmin = User::create([
            'school_id' => $school->id,
            'name' => 'School Admin',
            'email' => 'admin@greenwood.com',
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
        ]);

        Sanctum::actingAs($schoolAdmin, ['school_admin']);

        $response = $this->getJson('/api/admin/demo-requests');
        $response->assertStatus(403);
    }
}
