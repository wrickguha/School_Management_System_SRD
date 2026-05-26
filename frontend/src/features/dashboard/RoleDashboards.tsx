import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { SPLINE_SCENES } from '../../config/splineUrls';
import { SplineDashboardHeader } from '../..//components/spline/SplineDashboardHeader';
import { SplineEmptyState } from '../../components/spline/SplineEmptyState';
import { StatWidget } from '../../components/ui/StatWidget';
import { MiniChart } from '../../components/ui/MiniChart';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { DataTable, Column } from '../../components/ui/DataTable';
import { studentService } from '../../services/studentService';
import { academicService } from '../../services/academicService';
import { financeService } from '../../services/financeService';
import { logisticsService } from '../../services/logisticsService';
import { adminService } from '../../services/adminService';
import * as Icons from 'lucide-react';

// ==========================================
// 1. SUPER ADMIN DASHBOARD
// ==========================================
export const SuperAdminDashboard: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>System Control Tower</h2>
      <p style={{ color: 'var(--text-tertiary)' }}>Global school governance networks.</p>
      
      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', width: '100%' }}>
        <StatWidget title="Total Schools" value="8" icon={<Icons.School size={20} />} description="Active nodes in network" />
        <StatWidget title="Total Users" value="1,850" icon={<Icons.Users size={20} />} description="Registered accounts" change="12%" isPositive />
        <StatWidget title="System Health" value="99.9%" icon={<Icons.Activity size={20} />} description="All servers functional" />
        <StatWidget title="Monthly API Hits" value="2.4M" icon={<Icons.Cpu size={20} />} description="Laravel API traffic" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <Card>
          <Card.Header>
            <h3>Multi-School Network Logs</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <div>
                  <strong>Hogwarts School of Witchcraft</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Scotland Node</div>
                </div>
                <Badge color="success">Online</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                <div>
                  <strong>Beauxbatons Academy of Magic</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>France Node</div>
                </div>
                <Badge color="success">Online</Badge>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Durmstrang Institute</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Scandinavia Node</div>
                </div>
                <Badge color="warning">Syncing</Badge>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Header>
            <h3>System Status</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>CPU Usage</span>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '4px' }}>
                  <div style={{ width: '42%', height: '100%', background: 'var(--accent-primary)', borderRadius: '3px' }} />
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Memory Storage</span>
                <div style={{ height: '6px', background: 'var(--border-color)', borderRadius: '3px', marginTop: '4px' }}>
                  <div style={{ width: '68%', height: '100%', background: 'var(--accent-secondary)', borderRadius: '3px' }} />
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 2. SCHOOL ADMIN DASHBOARD
// ==========================================
export const SchoolAdminDashboard: React.FC = () => {
  const [admissions, setAdmissions] = useState<any[]>([]);

  useEffect(() => {
    studentService.getAdmissions().then(setAdmissions);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* 3D Dashboard Header */}
      <SplineDashboardHeader 
        sceneUrl={SPLINE_SCENES.adminDashboard}
        title="School Operations Dashboard"
        subtitle="Hogwarts School Admin Center"
        stats={[
          { label: 'Pending Admissions', value: 3 },
          { label: 'Approved Leaves', value: 1 }
        ]}
        fallbackType="campus"
      />

      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatWidget title="Total Enrolled" value="450" icon={<Icons.GraduationCap size={20} />} description="Active Student SIS" />
        <StatWidget title="New Applicants" value="12" icon={<Icons.UserPlus size={20} />} description="This enrollment cycle" />
        <StatWidget title="Active Staff" value="54" icon={<Icons.Users size={20} />} description="Faculty & support" />
        <StatWidget title="Leave Actions" value="1" icon={<Icons.CalendarRange size={20} />} description="Pending approvals" />
      </div>

      <Card>
        <Card.Header>
          <h3>Admissions Funnel Monitor</h3>
        </Card.Header>
        <Card.Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {admissions.map((adm) => (
              <div key={adm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <strong>{adm.firstName} {adm.lastName}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Class Request: Grade {adm.classId.replace('cls-','')} • Date: {adm.requestDate}</div>
                </div>
                <Badge color={adm.status === 'approved' ? 'success' : adm.status === 'pending' ? 'warning' : 'danger'}>
                  {adm.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// ==========================================
// 3. PRINCIPAL DASHBOARD
// ==========================================
export const PrincipalDashboard: React.FC = () => {
  const [financeSummary, setFinanceSummary] = useState({ totalInvoiced: 0, totalCollected: 0, totalPending: 0, recoveryRate: 0 });

  useEffect(() => {
    financeService.getOutstandingFeesSummary().then(setFinanceSummary);
  }, []);

  const attendanceTrend = [
    { label: 'Mon', value: 92 },
    { label: 'Tue', value: 95 },
    { label: 'Wed', value: 96 },
    { label: 'Thu', value: 94 },
    { label: 'Fri', value: 89 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Immersive 3D principal welcome header */}
      <SplineDashboardHeader 
        sceneUrl={SPLINE_SCENES.principalDashboard}
        title="Welcome, Headmaster Snape"
        subtitle="Hogwarts Academic & Administrative Command System"
        stats={[
          { label: 'Fee Collection', value: `${financeSummary.recoveryRate}%`, change: 'Rate', isPositive: true },
          { label: 'Attendance Average', value: '93%', change: 'Weekly', isPositive: true }
        ]}
        fallbackType="academic"
      />

      {/* Stats row */}
      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatWidget title="Total Tuition Collected" value={`$${financeSummary.totalCollected}`} icon={<Icons.Coins size={20} />} description="Gross collections" isPositive />
        <StatWidget title="Outstanding Fees" value={`$${financeSummary.totalPending}`} icon={<Icons.Wallet size={20} />} description="Uncollected dues" isPositive={false} />
        <StatWidget title="Curfew Incidents" value="2" icon={<Icons.ShieldAlert size={20} />} description="Flagged by caretaker" change="-5%" isPositive />
        <StatWidget title="Staff Workload" value="92%" icon={<Icons.CalendarCheck size={20} />} description="Timetable allocation rate" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {/* Attendance trend chart card */}
        <Card>
          <Card.Header>
            <div>
              <h3>Daily School Attendance Rate</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Average student attendance across all grades</p>
            </div>
          </Card.Header>
          <Card.Body>
            <MiniChart data={attendanceTrend} type="line" height={160} color="var(--accent-primary)" />
          </Card.Body>
        </Card>

        {/* Compliance and notifications */}
        <Card>
          <Card.Header>
            <h3>Administrative Compliance Check</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icons.CheckCircle size={20} color="var(--success)" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-primary)' }}>Grade submissions draft</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>85% of teachers updated their gradebooks</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icons.AlertCircle size={20} color="var(--warning)" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-primary)' }}>Notice approval pending</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>1 new notice on noticeboard requires sign-off</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Icons.CheckCircle size={20} color="var(--success)" />
                <div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 650, color: 'var(--text-primary)' }}>Transport safety log</span>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>All magical vehicles passed maintenance check</p>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 4. TEACHER DASHBOARD
// ==========================================
export const TeacherDashboard: React.FC = () => {
  const [timetable, setTimetable] = useState<any[]>([]);

  useEffect(() => {
    academicService.getTimetable().then(slots => {
      // Filter for teacher Snape (usr-3) or teacher Lupin (usr-4)
      setTimetable(slots.slice(0, 3));
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* 3D Header for Teacher */}
      <SplineDashboardHeader 
        sceneUrl={SPLINE_SCENES.teacherDashboard}
        title="Instructor Room: Prof. Lupin"
        subtitle="Defence Against the Dark Arts Faculty"
        stats={[
          { label: 'Classes Today', value: timetable.length },
          { label: 'Assigned Homework', value: 2 }
        ]}
        fallbackType="academic"
      />

      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatWidget title="Classes Today" value={timetable.length} icon={<Icons.Calendar size={20} />} description="Academic calendar slots" />
        <StatWidget title="Attendance Status" value="Logged" icon={<Icons.UserCheck size={20} />} description="Attendance for Grade 10 submitted" />
        <StatWidget title="Pending Homeworks" value="2" icon={<Icons.ClipboardList size={20} />} description="Review submissions needed" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {/* Today's classes */}
        <Card>
          <Card.Header>
            <h3>Today's Teaching Schedule</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {timetable.map((slot) => (
                <div key={slot.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{slot.subjectName}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Location: {slot.roomNo} • {slot.startTime} - {slot.endTime}
                    </span>
                  </div>
                  <Badge color="primary">{slot.classId.toUpperCase().replace('CLS-', 'Class ')}</Badge>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Shortcuts */}
        <Card>
          <Card.Header>
            <h3>Quick Actions</h3>
          </Card.Header>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="btn btn-primary w-full" style={{ justifyContent: 'flex-start' }}>
              <Icons.UserCheck size={16} /> Mark Attendance Ledger
            </button>
            <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
              <Icons.FilePlus2 size={16} /> Assign New Homework
            </button>
            <button className="btn btn-secondary w-full" style={{ justifyContent: 'flex-start' }}>
              <Icons.PenTool size={16} /> Upload Term Exam Marks
            </button>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 5. STUDENT DASHBOARD
// ==========================================
export const StudentDashboard: React.FC = () => {
  const [homework, setHomework] = useState<any[]>([]);

  useEffect(() => {
    academicService.getHomework().then(setHomework);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      {/* Spline Student Header */}
      <SplineDashboardHeader 
        sceneUrl={SPLINE_SCENES.studentDashboard}
        title="Hello, Harry Potter!"
        subtitle="Class: Gryffindor House • Year 5 (Grade 10)"
        stats={[
          { label: 'GPA Equivalent', value: 'E', change: 'Exceeds Expectations', isPositive: true },
          { label: 'Attendance', value: '95%' }
        ]}
        fallbackType="academic"
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {/* Homework list */}
        <Card>
          <Card.Header>
            <h3>Pending Homework Assignments</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {homework.map((hw) => (
                <div key={hw.id} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{hw.title}</h4>
                    <Badge color="danger">Due: {hw.dueDate}</Badge>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {hw.description}
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    Subject: {hw.subjectName}
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Schedule & motivational */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Card>
            <Card.Header>
              <h3>Upcoming Class Today</h3>
            </Card.Header>
            <Card.Body>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ padding: '8px', background: 'rgba(var(--accent-primary-rgb), 0.1)', color: 'var(--accent-primary)', borderRadius: 'var(--radius-sm)' }}>
                  <Icons.Flame size={24} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Potions Class</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>14:00 - 15:00 • Dungeon 5</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Motivational widget using spline details */}
          <div style={{ flex: 1 }}>
            <Card variant="glass" style={{ height: '100%', background: 'linear-gradient(135deg, rgba(var(--accent-primary-rgb), 0.15) 0%, rgba(var(--accent-secondary-rgb), 0.1) 100%)' }}>
              <Card.Body style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', gap: '12px' }}>
                <Icons.Sparkles size={36} color="var(--accent-secondary)" style={{ alignSelf: 'center', animation: 'float-fallback 3s infinite' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>O.W.L. Exams Approaching</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Review Defence spells and compound ingredient lists before next week's practicals.</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. PARENT/GUARDIAN DASHBOARD
// ==========================================
export const ParentDashboard: React.FC = () => {
  const gradeSummary = [
    { label: 'Potions', value: 82 },
    { label: 'Herbology', value: 91 },
    { label: 'Charms', value: 85 },
    { label: 'Transfig.', value: 78 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>Parent Portal: James Potter</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Monitoring progress and tuition for <strong>Harry Potter</strong>.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {/* Child grades */}
        <Card>
          <Card.Header>
            <h3>Child Academics Progress Trends</h3>
          </Card.Header>
          <Card.Body>
            <MiniChart data={gradeSummary} type="bar" height={160} color="var(--accent-secondary)" />
          </Card.Body>
        </Card>

        {/* Invoicing info */}
        <Card>
          <Card.Header>
            <h3>Fees Invoice Status</h3>
          </Card.Header>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.15rem' }}>$1,500.00</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Term Tuition Fee</p>
              </div>
              <Badge color="success">Paid</Badge>
            </div>
            <hr style={{ border: 'none', borderBottom: '1px solid var(--border-color)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '1.15rem' }}>$120.00</strong>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Express Transport Route Fee</p>
              </div>
              <Badge color="success">Paid</Badge>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 7. ACCOUNTANT DASHBOARD
// ==========================================
export const AccountantDashboard: React.FC = () => {
  const [receipts, setReceipts] = useState<any[]>([]);
  const [summary, setSummary] = useState({ totalInvoiced: 0, totalCollected: 0, totalPending: 0, recoveryRate: 0 });

  useEffect(() => {
    financeService.getFeeReceipts().then(setReceipts);
    financeService.getOutstandingFeesSummary().then(setSummary);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>Finance Ledger Center</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Accounting ledgers, payment compliance, and concessions.</p>

      {/* Numerical stats only (2D design, fast ledger work) */}
      <div className="grid-dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <StatWidget title="Total Invoiced Dues" value={`$${summary.totalInvoiced}`} icon={<Icons.Coins size={20} />} description="Term billings total" />
        <StatWidget title="Total Cash Collected" value={`$${summary.totalCollected}`} icon={<Icons.Coins size={20} />} description="Recovered revenues" change={`${summary.recoveryRate}%`} isPositive />
        <StatWidget title="Pending Receivables" value={`$${summary.totalPending}`} icon={<Icons.Coins size={20} />} description="Outstanding collection" isPositive={false} />
      </div>

      <Card>
        <Card.Header>
          <h3>Recent Fee Transaction Receipts</h3>
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="sms-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Invoice No</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Amount Paid</th>
                  <th>Payment Mode</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((rec) => (
                  <tr key={rec.id}>
                    <td>{rec.invoiceNo}</td>
                    <td>{rec.studentName}</td>
                    <td>{rec.className}</td>
                    <td>${rec.amountPaid}</td>
                    <td>{rec.paymentMethod.toUpperCase()}</td>
                    <td>{rec.paymentDate}</td>
                    <td><Badge color={rec.status === 'paid' ? 'success' : 'warning'}>{rec.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

// ==========================================
// 8. LIBRARIAN DASHBOARD
// ==========================================
export const LibrarianDashboard: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    logisticsService.getBookIssueLogs().then(setLogs);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>Hogwarts Library Catalog</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Book leases, restricted section logs, and overdue returns.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        
        {/* Book logs */}
        <Card>
          <Card.Header>
            <h3>Active Book Rental Leases</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {logs.map((log) => (
                <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{log.bookTitle}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Borrower: {log.borrowerName} • Due: {log.dueDate}</div>
                  </div>
                  <Badge color={log.status === 'overdue' ? 'danger' : 'primary'}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* 3D empty state or library illustration placeholder */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Card variant="glass" style={{ height: '100%' }}>
            <Card.Body style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 'var(--space-xl)' }}>
              <Icons.Book size={40} color="var(--accent-primary)" style={{ marginBottom: '12px' }} />
              <h4>Book Inventory Summary</h4>
              <div style={{ marginTop: '12px', width: '100%', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span>Total Magical Texts</span>
                  <strong>18 titles</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                  <span>Out on Rent</span>
                  <strong>2</strong>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. TRANSPORT MANAGER DASHBOARD
// ==========================================
export const TransportManagerDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);

  useEffect(() => {
    logisticsService.getVehicles().then(setVehicles);
    logisticsService.getTransportRoutes().then(setRoutes);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>Magical Transport Fleet</h2>
      <p style={{ color: 'var(--text-secondary)' }}>School Express timetables, flying vehicle checklists, and routes.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        
        {/* Vehicles */}
        <Card>
          <Card.Header>
            <h3>Registered Carriage Fleet</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vehicles.map((vh) => (
                <div key={vh.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <strong>{vh.vehicleNo}</strong>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Operator: {vh.driverName} • Seats: {vh.capacity}</div>
                  </div>
                  <Badge color={vh.status === 'active' ? 'success' : 'warning'}>
                    {vh.status}
                  </Badge>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Routes */}
        <Card>
          <Card.Header>
            <h3>Active Transit Routes</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {routes.map((rt) => (
                <div key={rt.id} style={{ padding: '10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-tertiary)' }}>
                  <strong>{rt.routeName}</strong>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Stops: {rt.stops.join(' → ')}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700, display: 'block', marginTop: '6px' }}>
                    Cost: ${rt.monthlyFee}/month
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

// ==========================================
// 10. HR/RECEPTION DASHBOARD
// ==========================================
export const HRReceptionDashboard: React.FC = () => {
  const [leaves, setLeaves] = useState<any[]>([]);

  useEffect(() => {
    adminService.getLeaves().then(setLeaves);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <h2>HR Directory & Reception Logs</h2>
      <p style={{ color: 'var(--text-secondary)' }}>Leave trackers, visitor registers, and staff directory records.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        
        {/* Leave Requests */}
        <Card>
          <Card.Header>
            <h3>Faculty Leave Registry</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {leaves.map((lv) => (
                <div key={lv.id} style={{ padding: '10px', borderBottom: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <strong>{lv.userName} ({lv.userRole.replace('_', ' ')})</strong>
                    <Badge color={lv.status === 'approved' ? 'success' : lv.status === 'pending' ? 'warning' : 'danger'}>
                      {lv.status}
                    </Badge>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    Reason: "{lv.reason}"
                  </p>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                    Dates: {lv.startDate} to {lv.endDate} ({lv.leaveType} Leave)
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* Visitor log */}
        <Card>
          <Card.Header>
            <h3>Daily Gates Visitor Logs</h3>
          </Card.Header>
          <Card.Body>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Arthur Weasley</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Purpose: Meet student Harry Potter</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>10:15 AM</span>
              </div>
              <div style={{ padding: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong>Lucius Malfoy</strong>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Purpose: Meet headmaster for audit</div>
                </div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>11:30 AM</span>
              </div>
            </div>
          </Card.Body>
        </Card>

      </div>
    </div>
  );
};
