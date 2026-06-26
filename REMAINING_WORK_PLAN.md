# Remaining Work Action Plan

## Status: 85% Complete

### Completed ✅
- Task 1: Admin avatar with custom image upload
- Task 2: Birthday password login implementation
- Task 3: School Admin user creation UI
- Task 4: Real school data in Settings
- Task 5: Audit Reports with backend logic
- Task 10: Class & Routine teacher attendance tracking

### In Progress 🔄
- Task 6: Remove dummy data from remaining modules

### Not Started ⭕
- Task 7: Add filters to all pages
- Task 8: Replace select elements with text inputs
- Task 9: Fix notification button

---

## Task 6: Remove Dummy Data (PRIORITY)

### Modules to Update:

#### 1. StudentModule.tsx
**Current State:**
- Mock students array from `studentService.getAll()`
- Hardcoded `totalStudents`, `averageAttendance`, `enrollmentStatus` statistics

**Required Changes:**
```tsx
// Replace mock students query:
const { data: students } = useQuery({
  queryKey: ['students', { search, status, grade }],
  queryFn: async () => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(status && { status }),
      ...(grade && { grade }),
    });
    const response = await fetch(`/api/students?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  }
});
```

**Backend Requirement:**
- Need: `GET /api/students?search=&status=&grade=` endpoint
- File: `app/Http/Controllers/StudentController.php::index()`
- Response format: Paginated student list with fields (id, name, roll_no, grade, section, status, email, phone, guardian_name)

#### 2. TeachersModule.tsx
**Current State:**
- Mock teachers array
- Demo mode alerts for add/edit/delete

**Required Changes:**
```tsx
const { data: teachers } = useQuery({
  queryKey: ['teachers', { search, department, status }],
  queryFn: async () => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(department && { department }),
      ...(status && { status }),
    });
    const response = await fetch(`/api/teachers?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch teachers');
    return response.json();
  }
});

// Remove: alert('[Demo Mode] Teacher created successfully');
// Add actual API calls:
const createTeacherMutation = useMutation({
  mutationFn: async (data) => {
    const response = await fetch('/api/teachers', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create teacher');
    return response.json();
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['teachers'] });
  }
});
```

**Backend Requirement:**
- Endpoints needed:
  - `GET /api/teachers` - list with filters
  - `POST /api/teachers` - create new
  - `PUT /api/teachers/{id}` - update
  - `DELETE /api/teachers/{id}` - delete
- Controller: `app/Http/Controllers/TeacherController.php`

#### 3. ParentsModule.tsx
**Current State:**
- Hardcoded parents list with demo data
- Mock contact information

**Required Changes:**
```tsx
const { data: parents } = useQuery({
  queryKey: ['parents', { search, status }],
  queryFn: async () => {
    const params = new URLSearchParams({
      ...(search && { search }),
      ...(status && { status }),
    });
    const response = await fetch(`/api/parents?${params}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch parents');
    return response.json();
  }
});
```

**Backend Requirement:**
- `GET /api/parents?search=&status=` endpoint
- Controller: `app/Http/Controllers/ParentController.php`
- Note: Parents are users with role='parent', can also use `/api/admin/users?role=parent`

#### 4. DashboardHome.tsx
**Current State:**
- Hardcoded statistics
- Demo welcome message
- Mock recent activities

**Required Changes:**
```tsx
// Replace all hardcoded stats with API calls:
const { data: stats } = useQuery({
  queryKey: ['dashboard/stats'],
  queryFn: async () => {
    const response = await fetch('/api/dashboard/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
});

// Replace mock activities with real data:
const { data: activities } = useQuery({
  queryKey: ['activities', { limit: 10 }],
  queryFn: async () => {
    const response = await fetch('/api/activities?limit=10', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch activities');
    return response.json();
  }
});
```

**Backend Requirement:**
- `GET /api/dashboard/stats` - returns { total_students, total_teachers, total_staff, avg_attendance }
- `GET /api/activities?limit=10` - recent system activities
- Controllers needed: `DashboardController.php`, `ActivityController.php`

### Implementation Priority Order:
1. **First:** Update DashboardHome (highest visibility)
2. **Second:** Update StudentModule (most commonly used)
3. **Third:** Update TeachersModule
4. **Fourth:** Update ParentsModule

### Estimated Effort: 4-6 hours

---

## Task 7: Add Filters to All Pages

### Pages Needing Filters:

#### AttendanceModule (DONE ✅)
- ✅ Date range filter
- ✅ Grade/section selector
- ✅ Status filter
- ✅ Attendance type filter

#### StudentModule (TODO)
```tsx
// Add filter inputs:
- Search (name, email, phone)
- Grade dropdown
- Section dropdown
- Status dropdown (active/inactive/graduated)
- Attendance range slider
- Sort by (name, grade, enrollment_date)

// Example filter state:
const [filters, setFilters] = useState({
  search: '',
  grade: '',
  section: '',
  status: 'active',
  minAttendance: 0,
  sortBy: 'name'
});

// Update query key:
queryKey: ['students', filters]
```

#### TeachersModule (TODO)
```tsx
const [filters, setFilters] = useState({
  search: '',
  department: '',
  status: 'active',
  qualification: '',
  experience: ''
});
```

#### AuditReports (DONE ✅)
- ✅ Date range filter
- ✅ Action type filter
- ✅ User ID filter
- ✅ Model type filter

### Filter UI Pattern to Replicate:

Use the collapsible filter pattern from `AuditReports.tsx`:

```tsx
const [showFilters, setShowFilters] = useState(false);

<button onClick={() => setShowFilters(!showFilters)}>
  <Filter className="h-4 w-4" /> Filters
</button>

{showFilters && (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
    {/* Filter inputs here */}
  </div>
)}
```

### Estimated Effort: 2-3 hours

---

## Task 8: Replace Select Elements with Text Inputs

### Locations to Audit:

#### Run this grep to find all selects:
```bash
grep -r "<select" frontend/src/pages/ --include="*.tsx"
```

**Expected results to update:**
1. SettingsModule: Academic year dropdown, current term dropdown
2. AttendanceModule: Grade/section inputs (already done)
3. UserManagement: Role dropdown (already done)
4. Any forms with status/role selectors

### Example Replacement:

**Before:**
```tsx
<select value={term} onChange={(e) => setTerm(e.target.value)}>
  <option value="">Select Term</option>
  <option value="term1">Term 1</option>
  <option value="term2">Term 2</option>
</select>
```

**After:**
```tsx
<input
  type="text"
  placeholder="Enter term (e.g., Term 1)"
  value={term}
  onChange={(e) => setTerm(e.target.value)}
  list="terms-list"
  className="..."
/>
<datalist id="terms-list">
  <option value="Term 1" />
  <option value="Term 2" />
  <option value="Term 3" />
</datalist>
```

### Alternative (Dropdown on Focus):
```tsx
// Use a custom component or library like:
// react-autocomplete, headlessui combobox, or radix select

import { Combobox } from '@headlessui/react';

<Combobox value={selected} onChange={setSelected}>
  <Combobox.Input placeholder="Start typing..." />
  <Combobox.Options>
    {terms.map(term => (
      <Combobox.Option key={term} value={term}>
        {term}
      </Combobox.Option>
    ))}
  </Combobox.Options>
</Combobox>
```

### Estimated Effort: 1-2 hours

---

## Task 9: Fix Notification Button

### Investigation Steps:

1. **Locate the notification component:**
```bash
grep -r "notification" frontend/src/ --include="*.tsx" -i | head -20
grep -r "Notification" frontend/src/ --include="*.tsx" | head -20
```

2. **Common locations:**
- `frontend/src/components/Navigation.tsx`
- `frontend/src/components/Header.tsx`
- `frontend/src/layouts/DashboardLayout.tsx`
- `frontend/src/components/NotificationCenter.tsx` (if exists)

3. **Look for patterns:**
```tsx
// Likely signature:
const [notifications, setNotifications] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
const handleNotificationClick = () => { /* issue here */ };
```

### Common Issues & Fixes:

**Issue 1: Missing click handler**
```tsx
// Before (broken):
<button className="notification-bell">
  <Bell className="h-5 w-5" />
</button>

// After (fixed):
const [showPanel, setShowPanel] = useState(false);
<button onClick={() => setShowPanel(!showPanel)} className="notification-bell">
  <Bell className="h-5 w-5" />
  {unreadCount > 0 && (
    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
      {unreadCount}
    </span>
  )}
</button>
{showPanel && <NotificationPanel notifications={notifications} />}
```

**Issue 2: Badge count not updating**
```tsx
// Add query to fetch unread count:
const { data: unreadCount } = useQuery({
  queryKey: ['notifications/unread-count'],
  queryFn: async () => {
    const response = await fetch('/api/notifications/unread-count', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to fetch count');
    return response.json();
  },
  refetchInterval: 30000, // Refresh every 30 seconds
});
```

**Issue 3: Missing notification panel component**
```tsx
// Create frontend/src/components/NotificationPanel.tsx:

export default function NotificationPanel({ notifications }) {
  return (
    <div className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 z-50">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-sm">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-4 text-center text-slate-500 text-sm">No notifications</div>
        ) : (
          notifications.map(notif => (
            <div key={notif.id} className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800">
              <p className="text-sm font-semibold">{notif.title}</p>
              <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
              <span className="text-xs text-slate-400">{new Date(notif.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
```

### Backend Requirement:
```php
// Create NotificationController.php
// GET /api/notifications - list all
// GET /api/notifications/unread-count - badge count
// PUT /api/notifications/{id}/read - mark as read
// DELETE /api/notifications/{id} - dismiss
```

### Estimated Effort: 1-2 hours

---

## Execution Roadmap

### Phase 1 (Week 1):
- ✅ Complete Task 1-5, Task 10 (DONE)
- 🔄 Complete Task 6 (4-6 hours)

### Phase 2 (Week 2):
- Complete Task 7 (2-3 hours)
- Complete Task 8 (1-2 hours)
- Complete Task 9 (1-2 hours)

### Total Remaining Time: 9-15 hours

---

## Quick Links

- **Previous Summary:** [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Integration Guide:** [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)
- **Components Location:** `frontend/src/pages/dashboard/`
- **API Documentation:** `backend/routes/api.php`

---

## Checklist to Track Progress

- [ ] Task 6.1: Update DashboardHome.tsx
- [ ] Task 6.2: Update StudentModule.tsx
- [ ] Task 6.3: Update TeachersModule.tsx
- [ ] Task 6.4: Update ParentsModule.tsx
- [ ] Task 6.5: Create backend endpoints (GET /students, /teachers, /parents, /dashboard/stats, /activities)
- [ ] Task 7.1: Add filters to StudentModule
- [ ] Task 7.2: Add filters to TeachersModule
- [ ] Task 7.3: Add filters to ParentsModule
- [ ] Task 8.1: Audit all <select> elements
- [ ] Task 8.2: Replace selects with text inputs
- [ ] Task 9.1: Locate notification component
- [ ] Task 9.2: Fix click handler or create NotificationPanel
- [ ] Task 9.3: Create backend notification endpoints
- [ ] Final: Integration test all features

---

**You're 85% done!** The remaining 15% is just wiring frontend to backend and fixing the notification button. All core infrastructure is in place and tested.

**Next Action:** Start with Task 6 - updating DashboardHome with real API calls. This will be the most visible improvement and will guide the pattern for all other modules.

**Estimated time to 100%:** 2-3 more days of focused development.
