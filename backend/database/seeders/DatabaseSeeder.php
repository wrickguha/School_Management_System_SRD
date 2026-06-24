<?php

namespace Database\Seeders;

use App\Models\School;
use App\Models\User;
use App\Models\SchoolSetting;
use App\Models\Teacher;
use App\Models\TeacherClass;
use App\Models\Guardian;
use App\Models\Student;
use App\Models\StudentDocument;
use App\Models\Attendance;
use App\Models\Exam;
use App\Models\ExamResult;
use App\Models\FeeStructure;
use App\Models\FeeTransaction;
use App\Models\Announcement;
use App\Models\ActivityLog;
use App\Models\HomeworkTask;
use App\Models\TransportBus;
use App\Models\LibraryBook;
use App\Models\LibraryIssuance;
use App\Models\HostelRoom;
use App\Models\PayrollRecord;
use App\Models\DemoRequest;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Roles in Spatie Permission
        $roles = [
            'super_admin',
            'school_admin',
            'principal',
            'teacher',
            'faculty',
            'parent',
            'student',
            'accountant',
            'hr',
            'librarian'
        ];

        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName, 'guard_name' => 'web']);
        }

        // 2. Create Super Admin (Global, no school_id)
        $superAdminUser = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@subhraedu.com',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
        $superAdminUser->assignRole('super_admin');

        // 3. Create Demo School (Greenwood High)
        $school = School::create([
            'name' => 'Greenwood International School',
            'subdomain' => 'greenwood',
            'address' => '123 Orchard Lane, Sector 4, Greenwood City',
            'phone' => '+1-555-0199',
            'email' => 'info@greenwood.edu',
            'plan' => 'professional',
            'status' => 'active',
        ]);

        // Create settings for the school
        SchoolSetting::create([
            'school_id' => $school->id,
            'academic_year' => '2026-2027',
            'current_term' => 'Term-I',
            'notify_absent' => true,
            'notify_fees' => true,
            'rfid_status' => true,
        ]);

        // 4. Create Tenant-level users for all roles
        $usersData = [
            ['name' => 'Greenwood Admin', 'email' => 'admin@greenwood.edu', 'role' => 'school_admin'],
            ['name' => 'Dr. Sarah Jenkins', 'email' => 'principal@greenwood.edu', 'role' => 'principal'],
            ['name' => 'Emily Cooper', 'email' => 'teacher@greenwood.edu', 'role' => 'teacher'],
            ['name' => 'Marcus Aurelius', 'email' => 'faculty@greenwood.edu', 'role' => 'faculty'],
            ['name' => 'Robert Miller', 'email' => 'parent@greenwood.edu', 'role' => 'parent'],
            ['name' => 'Alice Miller', 'email' => 'student@greenwood.edu', 'role' => 'student'],
            ['name' => 'Finley Cash', 'email' => 'accountant@greenwood.edu', 'role' => 'accountant'],
            ['name' => 'Harriet Roberts', 'email' => 'hr@greenwood.edu', 'role' => 'hr'],
            ['name' => 'Libby Reed', 'email' => 'librarian@greenwood.edu', 'role' => 'librarian'],
        ];

        $users = [];
        foreach ($usersData as $data) {
            $user = User::create([
                'school_id' => $school->id,
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make('password'),
                'role' => $data['role'],
                'status' => 'active',
            ]);
            $user->assignRole($data['role']);
            $users[$data['role']] = $user;
        }

        // 5. Create Teachers & Class Allocations
        $teacherEmily = Teacher::create([
            'school_id' => $school->id,
            'user_id' => $users['teacher']->id,
            'employee_id' => 'EMP2026001',
            'name' => 'Emily Cooper',
            'email' => 'teacher@greenwood.edu',
            'phone' => '+1-555-0201',
            'department' => 'Science',
            'designation' => 'Senior Teacher',
            'salary_grade' => 'Grade A',
            'status' => 'Active',
            'attendance_rate' => 96.50,
        ]);

        $teacherMarcus = Teacher::create([
            'school_id' => $school->id,
            'user_id' => $users['faculty']->id,
            'employee_id' => 'EMP2026002',
            'name' => 'Marcus Aurelius',
            'email' => 'faculty@greenwood.edu',
            'phone' => '+1-555-0202',
            'department' => 'History',
            'designation' => 'Lecturer',
            'salary_grade' => 'Grade B',
            'status' => 'Active',
            'attendance_rate' => 94.20,
        ]);

        TeacherClass::create([
            'school_id' => $school->id,
            'teacher_id' => $teacherEmily->id,
            'grade' => 'Grade 10',
            'section' => 'A',
            'subject' => 'Science',
        ]);

        TeacherClass::create([
            'school_id' => $school->id,
            'teacher_id' => $teacherMarcus->id,
            'grade' => 'Grade 10',
            'section' => 'A',
            'subject' => 'History',
        ]);

        // 6. Create Parent & Students
        $parentGuardian = Guardian::create([
            'school_id' => $school->id,
            'user_id' => $users['parent']->id,
            'name' => 'Robert Miller',
            'phone' => '+1-555-0144',
            'email' => 'parent@greenwood.edu',
        ]);

        $studentAlice = Student::create([
            'school_id' => $school->id,
            'user_id' => $users['student']->id,
            'admission_no' => 'ADM2026001',
            'roll_no' => '101',
            'name' => 'Alice Miller',
            'grade' => 'Grade 10',
            'section' => 'A',
            'gender' => 'Female',
            'dob' => '2011-05-14',
            'blood_group' => 'O+',
            'address' => '456 Oakwood Avenue, Greenwood City',
            'status' => 'Active',
            'admission_date' => '2025-09-01',
            'total_fees' => 5000.00,
            'pending_fees' => 1500.00,
            'attendance_rate' => 92.50,
            'academic_performance' => 88.50,
            'fee_status' => 'Partial',
        ]);

        // Link parent & student
        $studentAlice->parents()->attach($parentGuardian->id, ['relation' => 'Father']);

        // Additional students for list diversity
        $students = [
            $studentAlice,
            Student::create([
                'school_id' => $school->id,
                'admission_no' => 'ADM2026002',
                'roll_no' => '102',
                'name' => 'Bob Johnson',
                'grade' => 'Grade 10',
                'section' => 'A',
                'gender' => 'Male',
                'dob' => '2011-07-22',
                'blood_group' => 'A+',
                'address' => '789 Pine Road, Greenwood City',
                'status' => 'Active',
                'admission_date' => '2025-09-01',
                'total_fees' => 5000.00,
                'pending_fees' => 5000.00,
                'attendance_rate' => 89.20,
                'academic_performance' => 74.00,
                'fee_status' => 'Pending',
            ]),
            Student::create([
                'school_id' => $school->id,
                'admission_no' => 'ADM2026003',
                'roll_no' => '103',
                'name' => 'Charlie Smith',
                'grade' => 'Grade 10',
                'section' => 'A',
                'gender' => 'Male',
                'dob' => '2011-03-05',
                'blood_group' => 'B-',
                'address' => '12 Maple Boulevard, Greenwood City',
                'status' => 'Active',
                'admission_date' => '2025-09-01',
                'total_fees' => 5000.00,
                'pending_fees' => 0.00,
                'attendance_rate' => 98.40,
                'academic_performance' => 95.30,
                'fee_status' => 'Paid',
            ]),
            Student::create([
                'school_id' => $school->id,
                'admission_no' => 'ADM2026004',
                'roll_no' => '104',
                'name' => 'Diana Prince',
                'grade' => 'Grade 10',
                'section' => 'A',
                'gender' => 'Female',
                'dob' => '2011-12-01',
                'blood_group' => 'AB+',
                'address' => '33 Amazonian Way, Themyscira Estate',
                'status' => 'Active',
                'admission_date' => '2025-09-01',
                'total_fees' => 5000.00,
                'pending_fees' => 1000.00,
                'attendance_rate' => 95.00,
                'academic_performance' => 84.10,
                'fee_status' => 'Partial',
            ]),
        ];

        // 7. Student Documents
        StudentDocument::create([
            'student_id' => $studentAlice->id,
            'name' => 'Birth Certificate',
            'type' => 'Certificate',
            'file_path' => 'documents/birth_cert_alice.pdf',
            'status' => 'Verified',
        ]);

        StudentDocument::create([
            'student_id' => $studentAlice->id,
            'name' => 'Previous School Transfer Certificate',
            'type' => 'Certificate',
            'file_path' => 'documents/transfer_cert_alice.pdf',
            'status' => 'Verified',
        ]);

        // 8. Attendance Records (10 days of history for each Grade 10-A student)
        $dates = [];
        for ($i = 9; $i >= 0; $i--) {
            $dates[] = date('Y-m-d', strtotime("-$i days"));
        }

        foreach ($dates as $date) {
            foreach ($students as $student) {
                // Determine randomized attendance
                $rand = rand(1, 100);
                if ($rand > 92) {
                    $status = 'Absent';
                } elseif ($rand > 82) {
                    $status = 'Late';
                } else {
                    $status = 'Present';
                }

                // Make Charlie always present
                if ($student->name === 'Charlie Smith') {
                    $status = 'Present';
                }

                Attendance::create([
                    'school_id' => $school->id,
                    'student_id' => $student->id,
                    'grade' => 'Grade 10',
                    'section' => 'A',
                    'date' => $date,
                    'status' => $status,
                    'recorded_by' => $users['teacher']->id,
                ]);
            }
        }

        // 9. Exams & Results
        $examScience = Exam::create([
            'school_id' => $school->id,
            'title' => 'Science Mid-Term Exam',
            'grade' => 'Grade 10',
            'subject' => 'Science',
            'date' => date('Y-m-d', strtotime('-5 days')),
            'time' => '10:00 AM - 01:00 PM',
            'max_marks' => 100,
            'status' => 'Completed',
        ]);

        $examHistory = Exam::create([
            'school_id' => $school->id,
            'title' => 'History Quiz',
            'grade' => 'Grade 10',
            'subject' => 'History',
            'date' => date('Y-m-d', strtotime('+3 days')),
            'time' => '11:30 AM - 12:30 PM',
            'max_marks' => 50,
            'status' => 'Scheduled',
        ]);

        $scienceMarks = [
            'Alice Miller' => 88.50,
            'Bob Johnson' => 74.00,
            'Charlie Smith' => 95.30,
            'Diana Prince' => 84.10,
        ];

        foreach ($students as $student) {
            ExamResult::create([
                'school_id' => $school->id,
                'exam_id' => $examScience->id,
                'student_id' => $student->id,
                'subject' => 'Science',
                'marks_obtained' => $scienceMarks[$student->name],
                'max_marks' => 100,
                'letter_grade' => $scienceMarks[$student->name] >= 90 ? 'A+' : ($scienceMarks[$student->name] >= 80 ? 'A' : ($scienceMarks[$student->name] >= 70 ? 'B' : 'C')),
                'remarks' => 'Good performance',
            ]);
        }

        // 10. Finance / Fees
        $feeTuition = FeeStructure::create([
            'school_id' => $school->id,
            'grade' => 'Grade 10',
            'name' => 'Annual Tuition Fee',
            'amount' => 4000.00,
            'frequency' => 'Annual',
        ]);

        $feeLab = FeeStructure::create([
            'school_id' => $school->id,
            'grade' => 'Grade 10',
            'name' => 'Science Lab Fee',
            'amount' => 1000.00,
            'frequency' => 'Annual',
        ]);

        // Transactions
        // Alice paid 3500
        FeeTransaction::create([
            'school_id' => $school->id,
            'receipt_no' => 'REC-2026-0001',
            'student_id' => $studentAlice->id,
            'student_name' => $studentAlice->name,
            'grade' => $studentAlice->grade,
            'amount' => 3500.00,
            'payment_mode' => 'UPI',
            'status' => 'Paid',
            'date' => date('Y-m-d', strtotime('-30 days')),
            'recorded_by' => $users['accountant']->id,
            'notes' => 'First installment',
        ]);

        // Charlie paid 5000 (Full)
        FeeTransaction::create([
            'school_id' => $school->id,
            'receipt_no' => 'REC-2026-0002',
            'student_id' => $students[2]->id,
            'student_name' => $students[2]->name,
            'grade' => $students[2]->grade,
            'amount' => 5000.00,
            'payment_mode' => 'Bank Transfer',
            'status' => 'Paid',
            'date' => date('Y-m-d', strtotime('-25 days')),
            'recorded_by' => $users['accountant']->id,
            'notes' => 'Full payment annual fees',
        ]);

        // Diana paid 4000
        FeeTransaction::create([
            'school_id' => $school->id,
            'receipt_no' => 'REC-2026-0003',
            'student_id' => $students[3]->id,
            'student_name' => $students[3]->name,
            'grade' => $students[3]->grade,
            'amount' => 4000.00,
            'payment_mode' => 'Card',
            'status' => 'Paid',
            'date' => date('Y-m-d', strtotime('-15 days')),
            'recorded_by' => $users['accountant']->id,
            'notes' => 'Paid tuition fee portion',
        ]);

        // 11. Announcements
        Announcement::create([
            'school_id' => $school->id,
            'title' => 'Academic Calendar 2026-2027 Released',
            'content' => 'The academic calendar for the current session is now available under documents. Regular classes resume from Monday.',
            'target_audience' => 'All',
            'is_sms' => false,
            'published_at' => now(),
            'created_by' => $users['school_admin']->id,
        ]);

        Announcement::create([
            'school_id' => $school->id,
            'title' => 'Parent-Teacher Meeting (PTM)',
            'content' => 'A mandatory PTM is scheduled for Saturday, 13th June, to discuss the mid-term outcomes.',
            'target_audience' => 'Parents',
            'is_sms' => true,
            'published_at' => now(),
            'created_by' => $users['principal']->id,
        ]);

        // 12. Activity Logs
        ActivityLog::create([
            'school_id' => $school->id,
            'user_id' => $users['school_admin']->id,
            'action' => 'Student Admitted',
            'description' => 'Admitted student Alice Miller to Grade 10-A',
            'model_type' => 'Student',
            'model_id' => $studentAlice->id,
        ]);

        ActivityLog::create([
            'school_id' => $school->id,
            'user_id' => $users['accountant']->id,
            'action' => 'Fee Payment Received',
            'description' => 'Received fee payment of $3,500.00 from Alice Miller',
            'model_type' => 'FeeTransaction',
            'model_id' => 1,
        ]);

        // 13. Homework Tasks
        HomeworkTask::create([
            'school_id' => $school->id,
            'teacher_id' => $teacherEmily->id,
            'title' => 'Photosynthesis Lab Report',
            'subject' => 'Science',
            'grade' => 'Grade 10',
            'section' => 'A',
            'instructions' => 'Complete the lab manual pages 34-38 and submit your detailed observations.',
            'deadline' => date('Y-m-d', strtotime('+3 days')),
            'status' => 'Active',
        ]);

        // 14. Transport Buses
        TransportBus::create([
            'school_id' => $school->id,
            'bus_number' => 'BUS-2026-A1',
            'route' => 'Route A - Greenwood North to School',
            'driver_name' => 'Michael Scott',
            'driver_phone' => '+1-555-0301',
            'driver_license' => 'DL-993848-A',
            'gps_active' => true,
            'status' => 'Active',
        ]);

        // 15. Hostel Rooms
        HostelRoom::create([
            'school_id' => $school->id,
            'room_no' => 'H-101',
            'block' => 'Girls Hostel Block A',
            'type' => '2-Bed Sharing',
            'capacity' => 2,
            'occupied' => 1,
            'rent_per_term' => 1200.00,
        ]);

        // 16. Library Books & Issuance
        $book = LibraryBook::create([
            'school_id' => $school->id,
            'accession_no' => 'LIB-009488',
            'isbn' => '978-0553380163',
            'title' => 'A Brief History of Time',
            'author' => 'Stephen Hawking',
            'rack' => 'Science Rack C',
            'total_copies' => 3,
            'available_copies' => 2,
        ]);

        LibraryIssuance::create([
            'school_id' => $school->id,
            'book_id' => $book->id,
            'student_id' => $studentAlice->id,
            'issued_at' => date('Y-m-d', strtotime('-5 days')),
            'due_date' => date('Y-m-d', strtotime('+5 days')),
        ]);

        // 17. Payroll Record
        PayrollRecord::create([
            'school_id' => $school->id,
            'teacher_id' => $teacherEmily->id,
            'month' => 'May 2026',
            'base_salary' => 4500.00,
            'deductions' => 200.00,
            'net_salary' => 4300.00,
            'bank_account' => 'BOA-1293847-92',
            'status' => 'Disbursed',
            'paid_at' => date('Y-m-d H:i:s', strtotime('-5 days')),
        ]);

        // 18. Demo Requests
        DemoRequest::create([
            'school_name' => 'Springfield High',
            'contact_name' => 'Principal Skinner',
            'email' => 'skinner@springfield.edu',
            'phone' => '+1-555-7462',
            'student_count' => '500-1000',
            'status' => 'contacted',
        ]);

        // 19. Testimonials
        Testimonial::create([
            'name' => 'Dr. Arthur Sterling',
            'role' => 'Board President, Sterling Academies',
            'text' => 'SubhraEdu transformed our entire district. Managing 5 campus sites, 12,000 students, and unified billing used to take a team of 40. Now we handle everything seamlessly from a single dashboard.',
            'rating' => 5
        ]);

        Testimonial::create([
            'name' => 'Mrs. Rebecca Mercer',
            'role' => 'Principal, Greenfield Prep School',
            'text' => 'The Parent Portal is incredible. Late fees dropped by 45% because parents can checkout outstanding balances in 3 clicks. The teachers love the automated gradecard publisher.',
            'rating' => 5
        ]);

        Testimonial::create([
            'name' => 'Mr. David Cho',
            'role' => 'Chief Administrator, Horizon Global School',
            'text' => 'Its rare to find a platform with both high-level financial tracking and detailed academic tools. SubhraEdu looks premium, runs lightning-fast, and their API structure is highly scalable.',
            'rating' => 5
        ]);
    }
}
