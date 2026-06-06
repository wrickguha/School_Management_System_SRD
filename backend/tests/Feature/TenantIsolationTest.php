<?php

namespace Tests\Feature;

use App\Models\School;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class TenantIsolationTest extends TestCase
{
    use RefreshDatabase;

    public function test_school_admin_cannot_access_other_schools_students(): void
    {
        // 1. Create School A & School B
        $schoolA = School::create([
            'name' => 'School A',
            'subdomain' => 'schoola',
            'status' => 'active',
        ]);
        $schoolB = School::create([
            'name' => 'School B',
            'subdomain' => 'schoolb',
            'status' => 'active',
        ]);

        // 2. Create School A Admin
        $adminA = User::create([
            'school_id' => $schoolA->id,
            'name' => 'Admin A',
            'email' => 'admina@school.com',
            'password' => bcrypt('password'),
            'role' => 'school_admin',
            'status' => 'active',
        ]);

        // 3. Create Students in both schools
        $studentA = Student::create([
            'school_id' => $schoolA->id,
            'name' => 'Student A',
            'admission_no' => 'ADM-A-001',
            'grade' => 'Grade 10',
            'section' => 'A',
            'status' => 'Active',
        ]);

        $studentB = Student::create([
            'school_id' => $schoolB->id,
            'name' => 'Student B',
            'admission_no' => 'ADM-B-001',
            'grade' => 'Grade 10',
            'section' => 'A',
            'status' => 'Active',
        ]);

        // 4. Authenticate as School A Admin
        Sanctum::actingAs($adminA, ['school_admin']);

        // 5. Query all students - should only see School A's student
        $response = $this->getJson('/api/students');
        $response->assertStatus(200);

        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals('Student A', $data[0]['name']);

        // 6. Query School B's student directly - should return 404
        $responseB = $this->getJson('/api/students/' . $studentB->id);
        $responseB->assertStatus(404);
    }
}
