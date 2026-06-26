# Integration & Testing Guide

## Quick Start: Integrating New Components

### Step 1: Update Frontend Routes

Edit `frontend/src/routes/index.tsx` or your main routing file to include:

```tsx
import AttendanceModuleNew from '../pages/dashboard/AttendanceModuleNew';
import UserManagement from '../pages/dashboard/UserManagement';
import AuditReports from '../pages/dashboard/AuditReports';

// Add these routes to your routing configuration:
{
  path: '/dashboard/attendance',
  element: <AttendanceModuleNew />
},
{
  path: '/settings/users',
  element: <UserManagement />
},
{
  path: '/reports/audit',
  element: <AuditReports />
}
```

### Step 2: Update Navigation/Sidebar

Add menu items for:
- Attendance Management → `/dashboard/attendance`
- User Management → `/settings/users` (visible to school_admin, principal only)
- Audit Reports → `/reports/audit` (visible to school_admin, principal, accountant, hr)

### Step 3: Backend Setup

```bash
# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear

# (Optional) Seed demo data if you have seeders
php artisan db:seed
```

### Step 4: Test Authentication

1. **Test Birthday Password Login:**
   - Create a non-admin user with date_of_birth: 2000-03-15
   - Login with email and password: 20000315
   - Should see "Password is your date of birth in YYYYMMDD format" message

2. **Test Admin Profile Image Upload:**
   - Login as Super Admin or Admin
   - Go to profile/settings
   - Upload a profile image (JPEG, PNG, GIF, max 2MB)
   - Verify image saves and displays

### Step 5: Test User Management (School Admin only)

1. Login as School Admin
2. Navigate to `/settings/users`
3. Click "Add User"
4. Fill in:
   - Name: Test Teacher
   - Email: teacher@school.edu
   - Role: Teacher
   - Date of Birth: 1990-05-20
5. Submit - should show success message
6. New user password is: 19900520
7. Verify user appears in list

### Step 6: Test Attendance Module

1. Login as Teacher
2. Navigate to `/dashboard/attendance`
3. Fill in:
   - Date: Today
   - Grade: 10
   - Section: A
   - Type: Class Attendance
4. Should load students for Grade 10-A from backend
5. Mark attendance for each student
6. Click "Publish Register" to submit
7. Switch to "History" tab and verify records appear
8. Test filters (date range, status)

### Step 7: Test Audit Reports

1. Login as Principal
2. Navigate to `/reports/audit`
3. Verify statistics showing action counts
4. Test filters (date range, action type)
5. Click "Export CSV" to download audit log

### Step 8: Test Settings

1. Login as School Admin
2. Navigate to Settings
3. Verify real school data displays (not dummy "St. Xavier Academy")
4. Click "Edit Settings"
5. Modify any field
6. Click "Save" - should show success message
7. Refresh page - changes should persist

---

## Debugging Tips

### If components don't load:
```tsx
// Check console for error messages
// Verify localStorage has auth token:
console.log(localStorage.getItem('token'))

// Check if API endpoints are returning data:
fetch('/api/admin/users', {
  headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
}).then(r => r.json()).then(console.log)
```

### If file upload fails:
- Check file size (max 2MB)
- Verify MIME type is image/jpeg, image/png, image/gif
- Check `storage/app/public/` directory exists and is writable
- Run: `php artisan storage:link` to create symlink

### If attendance data not loading:
- Verify teacher has classes assigned
- Check database has students in `students` table
- Verify attendance_type parameter in request matches database
- Check SQL logs: `storage/logs/laravel.log`

### If audit logs not appearing:
- Check `audit_logs` table: `SELECT * FROM audit_logs LIMIT 10;`
- Verify `AuditLog::log()` calls in AuthService, Controllers
- Check role-based middleware is allowing current user access

### If role-based access denied:
- Verify user has correct role in `users` table
- Check `role_permissions` table in database
- Confirm middleware applied: `role:school_admin,principal`
- Test with postman including token header

---

## API Testing with Postman

### 1. Create User via API:
```
POST /api/admin/users
Header: Authorization: Bearer {token}
Body: {
  "name": "Test Teacher",
  "email": "teacher@school.edu",
  "role": "teacher",
  "date_of_birth": "1990-05-20"
}
```

### 2. Get Available Roles:
```
GET /api/admin/users/available-roles
Header: Authorization: Bearer {token}
```

### 3. Submit Attendance:
```
POST /api/attendance/bulk
Header: Authorization: Bearer {token}
Body: {
  "date": "2025-01-15",
  "grade": "10",
  "section": "A",
  "attendance_type": "class",
  "sheet": {
    "1": "Present",
    "2": "Absent",
    "3": "Late"
  }
}
```

### 4. Get Audit Logs:
```
GET /api/audit-logs?date_from=2025-01-01&date_to=2025-01-31&action=create
Header: Authorization: Bearer {token}
```

### 5. Export Audit CSV:
```
GET /api/audit-logs/export/csv?date_from=2025-01-01
Header: Authorization: Bearer {token}
```

---

## Database Verification

### Check Migrations Applied:
```sql
SELECT migration FROM migrations WHERE migration LIKE '%2026_06_26%';
-- Should show 3 rows:
-- 2026_06_26_000001_update_users_add_birthday_and_fields
-- 2026_06_26_000002_create_audit_logs_table
-- 2026_06_26_000003_update_attendances_add_class_teacher
```

### Verify New Fields:
```sql
-- Check users table
DESCRIBE users;
-- Should include: date_of_birth, profile_image_path

-- Check audit_logs table exists
SHOW TABLES LIKE 'audit_logs';

-- Check attendance updates
DESCRIBE attendances;
-- Should include: attendance_type, teacher_id, class_id, subject_id
```

### Check Audit Log Entries:
```sql
SELECT id, user_id, action, model_type, created_at 
FROM audit_logs 
ORDER BY created_at DESC 
LIMIT 10;
```

---

## Common Issues & Solutions

### Issue: "Unauthorized" on API calls
**Solution:** 
```tsx
// Ensure token is in localStorage
// Verify token not expired: JWT decode it
// Check user role matches middleware requirement
```

### Issue: "Class not found" for attendance
**Solution:**
```bash
# Ensure students exist with correct grade/section
php artisan tinker
> \App\Models\Student::where('grade', '10')->where('section', 'A')->count()
```

### Issue: File upload returns 413 (Payload too large)
**Solution:**
```bash
# Increase PHP upload limit in php.ini
upload_max_filesize = 10M
post_max_size = 10M

# Or in nginx
client_max_body_size 10M;
```

### Issue: Audit logs for some actions missing
**Solution:**
```php
// Verify AuditLog::log() called from AuthService
// Check model observers aren't conflicting
// Verify user_id captured correctly (might be null for system actions)
```

---

## Performance Optimization

### Frontend:
- AttendanceModuleNew uses React Query with caching
- Pagination: 50 items per page for audit logs
- Filters: Client-side filtering with debounce recommended

### Backend:
- Audit logs indexed on (school_id, created_at) for fast queries
- Attendance query supports pagination
- AuditLog::log() is synchronous - consider queue if high volume

### Database:
```sql
-- Verify indices created
SHOW INDEXES FROM audit_logs;
-- Should show indices on school_id, created_at, user_id, model_type

-- Monitor query performance
EXPLAIN SELECT * FROM audit_logs 
  WHERE school_id = 1 
  ORDER BY created_at DESC 
  LIMIT 50;
```

---

## Next Steps After Integration

1. **Complete Task 6:** Remove remaining dummy data from StudentModule, TeachersModule, ParentsModule, DashboardHome
2. **Complete Task 7:** Add filter UI components to all pages
3. **Complete Task 8:** Audit all forms and replace `<select>` with `<input type="text">`
4. **Complete Task 9:** Locate and fix notification button click handler

---

## Support & Reference

- Frontend Components Location: `frontend/src/pages/dashboard/`
- Backend Routes: `routes/api.php` (search for "/audit-logs", "/admin/users", "/attendance")
- Models: `app/Models/` (AuditLog.php, User.php, Attendance.php)
- Database Queries: Check `storage/logs/laravel.log` for SQL execution

---

**Ready to deploy!** Run through the Quick Start checklist above to get all features operational.
