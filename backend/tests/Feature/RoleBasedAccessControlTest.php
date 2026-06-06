<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RoleBasedAccessControlTest extends TestCase
{
    use RefreshDatabase;

    private School $school;
    private User $studentUser;
    private User $hrUser;
    private User $accountantUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->school = School::create([
            'name' => 'Greenwood High',
            'subdomain' => 'greenwood',
            'status' => 'active',
        ]);

        $this->studentUser = User::create([
            'school_id' => $this->school->id,
            'name' => 'Student User',
            'email' => 'student@greenwood.com',
            'password' => bcrypt('password'),
            'role' => 'student',
            'status' => 'active',
        ]);

        $this->hrUser = User::create([
            'school_id' => $this->school->id,
            'name' => 'HR User',
            'email' => 'hr@greenwood.com',
            'password' => bcrypt('password'),
            'role' => 'hr',
            'status' => 'active',
        ]);

        $this->accountantUser = User::create([
            'school_id' => $this->school->id,
            'name' => 'Accountant User',
            'email' => 'accountant@greenwood.com',
            'password' => bcrypt('password'),
            'role' => 'accountant',
            'status' => 'active',
        ]);
    }

    public function test_unauthenticated_requests_are_denied(): void
    {
        $response = $this->getJson('/api/payroll');
        $response->assertStatus(401);
    }

    public function test_student_cannot_access_payroll(): void
    {
        Sanctum::actingAs($this->studentUser, ['student']);

        $response = $this->getJson('/api/payroll');
        $response->assertStatus(403);
    }

    public function test_hr_can_access_payroll(): void
    {
        Sanctum::actingAs($this->hrUser, ['hr']);

        $response = $this->getJson('/api/payroll');
        $response->assertStatus(200);
    }

    public function test_student_cannot_access_finance_transactions(): void
    {
        Sanctum::actingAs($this->studentUser, ['student']);

        $response = $this->getJson('/api/transactions');
        $response->assertStatus(403);
    }

    public function test_accountant_can_access_finance_transactions(): void
    {
        Sanctum::actingAs($this->accountantUser, ['accountant']);

        $response = $this->getJson('/api/transactions');
        $response->assertStatus(200);
    }
}
