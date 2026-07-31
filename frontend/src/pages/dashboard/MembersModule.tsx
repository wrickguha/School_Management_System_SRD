import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Search, Camera, UploadCloud, Users, ShieldCheck, ToggleLeft, ToggleRight, Key,
  User, Briefcase, GraduationCap, Phone, Building2, FileText, CheckCircle, ChevronLeft, ChevronRight,
  RefreshCw, Check, Sparkles, CreditCard, Mail, Copy, Award, DollarSign, IdCard, MapPin, FileCheck
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import apiClient from '../../services/apiClient';

// ── Types ──────────────────────────────────────────────────────────────────────
type MemberRole =
  | 'principal'
  | 'vice_principal'
  | 'teacher'
  | 'faculty'
  | 'accountant'
  | 'office_staff'
  | 'receptionist'
  | 'librarian'
  | 'lab_assistant'
  | 'transport_manager'
  | 'driver'
  | 'security_guard'
  | 'cleaner'
  | 'hostel_warden'
  | 'nurse'
  | 'counselor'
  | 'other';

interface PortalMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: MemberRole;
  department?: string;
  designation?: string;
  date_of_birth?: string;
  employee_id?: string;
  status: 'active' | 'inactive';
  created_at?: string;
  photo?: string;
  basic_salary?: number;
  joining_date?: string;
}

interface ComprehensiveMemberForm {
  // 1. Basic Info
  employeeId: string;
  firstName: string;
  middleName: string;
  lastName: string;
  name: string; // Auto-computed
  dob: string;
  gender: string;
  bloodGroup: string;
  maritalStatus: string;
  nationality: string;
  religion: string;
  photoUrl: string;

  // 2. Employment Details
  role: MemberRole;
  department: string;
  designation: string;
  joiningDate: string;
  employmentStatus: 'Permanent' | 'Contract' | 'Part-time';
  reportingManager: string;
  workLocation: string;
  status: 'active' | 'inactive';

  // 3. Contact Info
  phone: string;
  altPhone: string;
  email: string;
  emergencyPhone: string;

  // 4. Address Details
  presentAddress1: string;
  presentAddress2: string;
  presentCity: string;
  presentDistrict: string;
  presentState: string;
  presentCountry: string;
  presentPin: string;

  permanentAddress1: string;
  permanentAddress2: string;
  permanentCity: string;
  permanentDistrict: string;
  permanentState: string;
  permanentCountry: string;
  permanentPin: string;
  sameAsPresentAddress: boolean;

  // 5. Educational Qualifications
  highestQualification: string;
  universityBoard: string;
  yearOfPassing: string;
  specialization: string;
  certifications: string;

  // 6. Professional Info
  yearsOfExperience: string;
  previousOrganization: string;
  skills: string;
  subjectsTaught: string;
  classesAssigned: string;

  // 7. Identity Documents
  aadhaarNo: string;
  panNo: string;
  passportNo: string;
  drivingLicenseNo: string;

  // 8. Bank Details
  accountHolderName: string;
  bankName: string;
  branchName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;

  // 9. Salary Info
  basicSalary: number;
  allowances: number;
  deductions: number;
  salaryType: 'Monthly' | 'Hourly';
  paymentMethod: 'Bank Transfer' | 'Cheque' | 'Cash';

  // 10. Login Credentials
  username: string;
  officialEmail: string;
  password: string;

  // 12. Additional Info
  medicalConditions: string;
  emergencyContactPerson: string;
  notes: string;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ROLE_OPTIONS: { value: MemberRole; label: string; color: string }[] = [
  { value: 'principal',         label: 'Principal',         color: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' },
  { value: 'vice_principal',    label: 'Vice Principal',    color: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300' },
  { value: 'teacher',           label: 'Teacher',           color: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' },
  { value: 'faculty',           label: 'Faculty',           color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
  { value: 'accountant',        label: 'Accountant',        color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' },
  { value: 'office_staff',      label: 'Office Staff',      color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
  { value: 'receptionist',      label: 'Receptionist',      color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300' },
  { value: 'librarian',         label: 'Librarian',         color: 'bg-teal-100 text-teal-700 dark:bg-teal-950/40 dark:text-teal-300' },
  { value: 'lab_assistant',     label: 'Lab Assistant',     color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300' },
  { value: 'transport_manager', label: 'Transport Manager', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300' },
  { value: 'driver',            label: 'Driver',            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-300' },
  { value: 'security_guard',    label: 'Security Guard',    color: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200' },
  { value: 'cleaner',           label: 'Cleaner',           color: 'bg-stone-100 text-stone-700 dark:bg-stone-900 dark:text-stone-300' },
  { value: 'hostel_warden',     label: 'Hostel Warden',     color: 'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300' },
  { value: 'nurse',             label: 'Nurse',             color: 'bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300' },
  { value: 'counselor',         label: 'Counselor',         color: 'bg-sky-100 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300' },
  { value: 'other',             label: 'Other',             color: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' },
];

const DEPARTMENTS = ['Science', 'Mathematics', 'English', 'Social Studies', 'Computer Science', 'Commerce', 'Arts', 'Physical Education', 'Administration', 'Transport', 'Facilities', 'Healthcare'];

const STAFF_WIZARD_STEPS = [
  { id: 1, title: 'Personal Details', short: 'Personal', icon: User },
  { id: 2, title: 'Employment Details', short: 'Employment', icon: Briefcase },
  { id: 3, title: 'Education & Experience', short: 'Edu & Exp', icon: GraduationCap },
  { id: 4, title: 'Contact & Address', short: 'Contact', icon: Phone },
  { id: 5, title: 'Bank & Salary', short: 'Bank & Pay', icon: Building2 },
  { id: 6, title: 'Documents Upload', short: 'Documents', icon: FileText },
  { id: 7, title: 'Login & Permissions', short: 'Login & ACL', icon: Key },
  { id: 8, title: 'Review & Submit', short: 'Review', icon: ShieldCheck },
];

function getRoleStyle(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role)?.color ?? 'bg-slate-100 text-slate-700';
}
function getRoleLabel(role: string) {
  return ROLE_OPTIONS.find(r => r.value === role)?.label ?? role;
}
function generateEmpId(): string {
  return `EMP${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
}
function formatDob(dob: string): string {
  return dob.replace(/-/g, '') || 'staff123';
}

// ── API ───────────────────────────────────────────────────────────────────────
const membersApi = {
  getAll: async (): Promise<PortalMember[]> => {
    try {
      const res = await apiClient.get('/admin/users');
      return res.data.data ?? res.data;
    } catch {
      return [];
    }
  },
  create: async (payload: Omit<PortalMember, 'id' | 'status' | 'created_at'>) => {
    const res = await apiClient.post('/admin/users', payload);
    return res.data.data ?? res.data;
  },
  toggleStatus: async (id: number, status: 'active' | 'inactive') => {
    const res = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return res.data;
  },
};

interface StaffDocState {
  name: string;
  file: File | null;
  preview: string;
}

const initialDocState = (): StaffDocState => ({ name: '', file: null, preview: '' });

export default function MembersModule() {
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Wizard Step State (1 to 8)
  const [currentStep, setCurrentStep] = useState(1);

  // Registration Success Confirmation
  interface SuccessStaffData {
    name: string;
    employeeId: string;
    role: string;
    department: string;
    email: string;
    password: string;
  }
  const [successStaffData, setSuccessStaffData] = useState<SuccessStaffData | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  // Initial Form State
  const [form, setForm] = useState<ComprehensiveMemberForm>({
    employeeId: generateEmpId(),
    firstName: '',
    middleName: '',
    lastName: '',
    name: '',
    dob: '1992-05-15',
    gender: 'Male',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    nationality: 'Indian',
    religion: 'Hinduism',
    photoUrl: '',

    role: 'teacher',
    department: 'Science',
    designation: 'Senior PGT Educator',
    joiningDate: new Date().toISOString().split('T')[0],
    employmentStatus: 'Permanent',
    reportingManager: 'Principal Dr. Sunita Rao',
    workLocation: 'Main Campus',
    status: 'active',

    phone: '+91 9876543210',
    altPhone: '',
    email: 'staff.member@school.edu.in',
    emergencyPhone: '+91 9876500000',

    presentAddress1: 'Flat 402, Green Valley Apartments',
    presentAddress2: 'Park Street Extension',
    presentCity: 'Kolkata',
    presentDistrict: 'Kolkata',
    presentState: 'West Bengal',
    presentCountry: 'India',
    presentPin: '700016',

    permanentAddress1: 'Flat 402, Green Valley Apartments',
    permanentAddress2: 'Park Street Extension',
    permanentCity: 'Kolkata',
    permanentDistrict: 'Kolkata',
    permanentState: 'West Bengal',
    permanentCountry: 'India',
    permanentPin: '700016',
    sameAsPresentAddress: true,

    highestQualification: 'M.Sc. Physics (Gold Medalist)',
    universityBoard: 'Calcutta University',
    yearOfPassing: '2015',
    specialization: 'Quantum Optics & Physics',
    certifications: 'B.Ed, CTET Qualified',

    yearsOfExperience: '8 Years',
    previousOrganization: 'St. Xavier High School',
    skills: 'Lab Experimentation, Curriculum Design, Physics Pedagogy',
    subjectsTaught: 'Physics, Applied Science',
    classesAssigned: 'Grade 9 - A, Grade 10 - B',

    aadhaarNo: '4589 1234 5678',
    panNo: 'ABCDE1234F',
    passportNo: '',
    drivingLicenseNo: '',

    accountHolderName: '',
    bankName: 'HDFC Bank',
    branchName: 'Park Street Branch',
    accountNumber: '50100234567890',
    ifscCode: 'HDFC0000123',
    upiId: 'staff@hdfcbank',

    basicSalary: 45000,
    allowances: 8000,
    deductions: 3000,
    salaryType: 'Monthly',
    paymentMethod: 'Bank Transfer',

    username: '',
    officialEmail: '',
    password: '',

    medicalConditions: 'None',
    emergencyContactPerson: 'Spouse / Parent',
    notes: 'Approved by Managing Committee',
  });

  // Document Uploads
  const [docsState, setDocsState] = useState<{
    passportPhoto: StaffDocState;
    resume: StaffDocState;
    aadhaarDoc: StaffDocState;
    panDoc: StaffDocState;
    eduCerts: StaffDocState;
    expCerts: StaffDocState;
    joiningLetter: StaffDocState;
    appointmentLetter: StaffDocState;
    policeVerification: StaffDocState;
  }>({
    passportPhoto: initialDocState(),
    resume: initialDocState(),
    aadhaarDoc: initialDocState(),
    panDoc: initialDocState(),
    eduCerts: initialDocState(),
    expCerts: initialDocState(),
    joiningLetter: initialDocState(),
    appointmentLetter: initialDocState(),
    policeVerification: initialDocState(),
  });

  // Auto Compute Full Name
  useEffect(() => {
    const fn = form.firstName.trim();
    const mn = form.middleName.trim();
    const ln = form.lastName.trim();
    const computed = [fn, mn, ln].filter(Boolean).join(' ');
    setForm(prev => ({
      ...prev,
      name: computed,
      accountHolderName: prev.accountHolderName || computed,
    }));
  }, [form.firstName, form.middleName, form.lastName]);

  // Sync Address if sameAsPresentAddress
  useEffect(() => {
    if (form.sameAsPresentAddress) {
      setForm(prev => ({
        ...prev,
        permanentAddress1: prev.presentAddress1,
        permanentAddress2: prev.presentAddress2,
        permanentCity: prev.presentCity,
        permanentDistrict: prev.presentDistrict,
        permanentState: prev.presentState,
        permanentCountry: prev.presentCountry,
        permanentPin: prev.presentPin,
      }));
    }
  }, [
    form.sameAsPresentAddress,
    form.presentAddress1,
    form.presentAddress2,
    form.presentCity,
    form.presentDistrict,
    form.presentState,
    form.presentCountry,
    form.presentPin,
  ]);

  const handleDocumentUpload = (key: keyof typeof docsState, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDocsState(prev => ({
        ...prev,
        [key]: {
          name: file.name,
          file,
          preview: ev.target?.result as string,
        }
      }));
      if (key === 'passportPhoto') {
        setForm(prev => ({ ...prev, photoUrl: ev.target?.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleOpenModal = () => {
    const empId = generateEmpId();
    setCurrentStep(1);
    setForm(prev => ({
      ...prev,
      employeeId: empId,
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      email: `${empId.toLowerCase()}@school.edu.in`,
      officialEmail: `${empId.toLowerCase()}@school.edu.in`,
      username: empId,
    }));
    setDocsState({
      passportPhoto: initialDocState(),
      resume: initialDocState(),
      aadhaarDoc: initialDocState(),
      panDoc: initialDocState(),
      eduCerts: initialDocState(),
      expCerts: initialDocState(),
      joiningLetter: initialDocState(),
      appointmentLetter: initialDocState(),
      policeVerification: initialDocState(),
    });
    setIsModalOpen(true);
  };

  const { data: members = [], isLoading } = useQuery({
    queryKey: ['portal-members'],
    queryFn: membersApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['portal-members'] });
      setIsModalOpen(false);
      const generatedPass = formatDob(form.dob);
      setSuccessStaffData({
        name: variables.name,
        employeeId: variables.employee_id || form.employeeId,
        role: getRoleLabel(variables.role),
        department: variables.department || form.department,
        email: variables.email,
        password: generatedPass,
      });
    },
    onError: (err: any) => {
      console.error(err);
      alert('Failed to register staff member: ' + (err.response?.data?.message || err.message));
    }
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'active' | 'inactive' }) =>
      membersApi.toggleStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['portal-members'] }),
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 8) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    const payload = {
      name: form.name || `${form.firstName} ${form.lastName}`.trim(),
      email: form.officialEmail || form.email,
      phone: form.phone,
      role: form.role,
      department: form.department,
      designation: form.designation,
      date_of_birth: form.dob,
      employee_id: form.employeeId,
      photo: form.photoUrl || docsState.passportPhoto.preview || undefined,
      basic_salary: Number(form.basicSalary),
      joining_date: form.joiningDate,
    };

    createMutation.mutate(payload);
  };

  const handleCopyCredentials = () => {
    if (!successStaffData) return;
    const text = `🎉 SubhraEdu Staff Portal Registration Details\n\n` +
      `Staff Name: ${successStaffData.name}\n` +
      `Employee ID: ${successStaffData.employeeId}\n` +
      `Role & Department: ${successStaffData.role} (${successStaffData.department})\n` +
      `Official Email: ${successStaffData.email}\n` +
      `Default Password: ${successStaffData.password}\n\n` +
      `Staff Login Portal: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const filtered = members.filter(m => {
    if (searchTerm && !m.name.toLowerCase().includes(searchTerm.toLowerCase()) && !m.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (roleFilter && m.role !== roleFilter) return false;
    if (statusFilter && m.status !== statusFilter) return false;
    return true;
  });

  const totalActive   = members.filter(m => m.status === 'active').length;
  const totalInactive = members.filter(m => m.status === 'inactive').length;

  const netSalary = Number(form.basicSalary || 0) + Number(form.allowances || 0) - Number(form.deductions || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white">Manage Members & Staff</h1>
          <p className="text-sm text-slate-500 mt-0.5">Register, provision, and manage institutional staff portal accounts</p>
        </div>
        <Button variant="primary" size="sm" onClick={handleOpenModal} leftIcon={<Plus className="h-4 w-4" />}>
          Add Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Members', value: members.length, icon: Users, color: 'text-school-blue' },
          { label: 'Active',        value: totalActive,    icon: ShieldCheck, color: 'text-school-green' },
          { label: 'Inactive',      value: totalInactive,  icon: ShieldCheck, color: 'text-slate-400' },
        ].map(s => (
          <Card key={s.label} className="p-4 flex items-center gap-3">
            <s.icon className={`h-8 w-8 ${s.color}`} />
            <div>
              <p className="text-xl font-extrabold text-slate-800 dark:text-white">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search staff by name, email, or employee ID..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>
          <input
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            list="role-filter-list"
            placeholder="Filter by role..."
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white w-full sm:w-48"
          />
          <datalist id="role-filter-list">
            <option value="" />
            {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </datalist>
          <input
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            list="status-filter-list"
            placeholder="Filter by status..."
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white w-full sm:w-40"
          />
          <datalist id="status-filter-list">
            <option value="" />
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </datalist>
        </div>
      </Card>

      {/* Member List */}
      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading staff members...</div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center">
            <Users className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No members found</p>
            <p className="text-xs text-slate-400 mt-1">Add staff portal members using the button above</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map(member => (
              <div key={member.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 flex items-center justify-center">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-base font-extrabold text-slate-500">{member.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 dark:text-white truncate">{member.name}</p>
                  <p className="text-xs text-slate-500 truncate">{member.email}</p>
                  {member.department && (
                    <p className="text-[10px] text-slate-400 font-semibold">{member.department} • {member.designation || 'Staff'}</p>
                  )}
                </div>

                {/* Role badge */}
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${getRoleStyle(member.role)}`}>
                  {getRoleLabel(member.role)}
                </span>

                {/* Employee ID */}
                {member.employee_id && (
                  <span className="text-[11px] font-mono font-bold text-slate-400 shrink-0 hidden md:inline">{member.employee_id}</span>
                )}

                {/* Status toggle */}
                <button
                  onClick={() => toggleMutation.mutate({ id: member.id, status: member.status === 'active' ? 'inactive' : 'active' })}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors shrink-0 ${
                    member.status === 'active'
                      ? 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 dark:bg-green-950/30 dark:border-green-800 dark:text-green-400'
                      : 'border-slate-300 text-slate-500 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-700'
                  }`}
                >
                  {member.status === 'active'
                    ? <><ToggleRight className="h-4 w-4" /> Active</>
                    : <><ToggleLeft className="h-4 w-4" /> Inactive</>
                  }
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* ── 8-STEP MULTI-STEP STAFF REGISTRATION WIZARD MODAL ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Institutional Staff & Member Registration"
        size="xl"
      >
        <div className="space-y-5">
          {/* Step Indicator Header Bar */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2 text-school-blue">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                Step {currentStep} of 8: <span className="text-slate-900 dark:text-white font-black">{STAFF_WIZARD_STEPS[currentStep - 1].title}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {Math.round((currentStep / 8) * 100)}% Completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-school-blue via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 8) * 100}%` }}
              />
            </div>

            {/* Step Icons Bar */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1 pb-0.5 scrollbar-thin">
              {STAFF_WIZARD_STEPS.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 min-w-[62px] py-1 px-1.5 rounded-xl transition-all ${
                      isCurrent
                        ? 'bg-school-blue text-white shadow-md scale-105'
                        : isCompleted
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="relative">
                      <StepIcon className="h-4 w-4" />
                      {isCompleted && (
                        <Check className="h-2.5 w-2.5 absolute -top-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5" />
                      )}
                    </div>
                    <span className="text-[9px] font-black tracking-tight truncate max-w-[55px]">{step.short}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleRegisterSubmit} className="space-y-6">

            {/* STEP 1: PERSONAL DETAILS */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <User className="h-4 w-4 text-school-blue" />
                    <span>1. Basic Personal Information & Identity</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 01 / 08</span>
                </div>

                {/* Auto Employee ID Header */}
                <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Auto-Generated Employee ID</span>
                    <span className="text-base font-extrabold text-school-blue font-mono">{form.employeeId}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, employeeId: generateEmpId() }))}
                    className="text-xs font-bold text-school-blue hover:underline flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                </div>

                {/* Name Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">First Name *</label>
                    <input
                      type="text"
                      required
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      placeholder="e.g. Sunita"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Middle Name (Optional)</label>
                    <input
                      type="text"
                      value={form.middleName}
                      onChange={(e) => setForm({ ...form, middleName: e.target.value })}
                      placeholder="e.g. Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      placeholder="e.g. Rao"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                </div>

                {/* Computed Full Name */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span className="text-slate-500">Auto-Generated Full Name:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{form.name || 'Enter First & Last Name above'}</span>
                </div>

                {/* Demographics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={form.dob}
                      onChange={(e) => setForm({ ...form, dob: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Gender *</label>
                    <select
                      value={form.gender}
                      onChange={(e) => setForm({ ...form, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Blood Group</label>
                    <select
                      value={form.bloodGroup}
                      onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Marital Status</label>
                    <select
                      value={form.maritalStatus}
                      onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nationality</label>
                    <input
                      type="text"
                      value={form.nationality}
                      onChange={(e) => setForm({ ...form, nationality: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Religion (Optional)</label>
                    <input
                      type="text"
                      value={form.religion}
                      onChange={(e) => setForm({ ...form, religion: e.target.value })}
                      placeholder="Hinduism"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Photo Dropzone Quick Pick */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                      {docsState.passportPhoto.preview ? (
                        <img src={docsState.passportPhoto.preview} alt="Staff Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Staff Passport Size Photo</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">JPEG, PNG, WebP · Max 3MB</span>
                    </div>
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5">
                    <UploadCloud className="h-4 w-4" />
                    {docsState.passportPhoto.name ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDocumentUpload('passportPhoto', e)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: EMPLOYMENT DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-school-blue" />
                    <span>2. Institutional Employment & Designation</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 02 / 08</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Employee Role / Type *</label>
                    <select
                      value={form.role}
                      onChange={(e) => setForm({ ...form, role: e.target.value as MemberRole })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-extrabold text-school-blue cursor-pointer"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Department *</label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Designation / Job Title *</label>
                    <input
                      type="text"
                      required
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      placeholder="e.g. Senior PGT Educator"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Joining Date *</label>
                    <input
                      type="date"
                      required
                      value={form.joiningDate}
                      onChange={(e) => setForm({ ...form, joiningDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Employment Type</label>
                    <select
                      value={form.employmentStatus}
                      onChange={(e) => setForm({ ...form, employmentStatus: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="Permanent">Permanent Staff</option>
                      <option value="Contract">Contractual</option>
                      <option value="Part-time">Part-time</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Employee Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as any })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    >
                      <option value="active">Active Service</option>
                      <option value="inactive">Inactive / On Leave</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Reporting Manager</label>
                    <input
                      type="text"
                      value={form.reportingManager}
                      onChange={(e) => setForm({ ...form, reportingManager: e.target.value })}
                      placeholder="e.g. Principal Dr. Sunita Rao"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Work Location / Branch</label>
                    <input
                      type="text"
                      value={form.workLocation}
                      onChange={(e) => setForm({ ...form, workLocation: e.target.value })}
                      placeholder="Main Campus"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: EDUCATION & EXPERIENCE */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-school-blue" />
                    <span>3. Qualifications, Experience & Pedagogy</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 03 / 08</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Highest Qualification *</label>
                    <input
                      type="text"
                      required
                      value={form.highestQualification}
                      onChange={(e) => setForm({ ...form, highestQualification: e.target.value })}
                      placeholder="e.g. M.Sc. Physics"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">University / Board</label>
                    <input
                      type="text"
                      value={form.universityBoard}
                      onChange={(e) => setForm({ ...form, universityBoard: e.target.value })}
                      placeholder="Calcutta University"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Passing Year</label>
                    <input
                      type="text"
                      value={form.yearOfPassing}
                      onChange={(e) => setForm({ ...form, yearOfPassing: e.target.value })}
                      placeholder="2015"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Specialization / Major</label>
                    <input
                      type="text"
                      value={form.specialization}
                      onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                      placeholder="Quantum Optics & Applied Electromagnetics"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Certifications (Optional)</label>
                    <input
                      type="text"
                      value={form.certifications}
                      onChange={(e) => setForm({ ...form, certifications: e.target.value })}
                      placeholder="B.Ed, CTET, NET Qualified"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Total Work Experience</label>
                    <input
                      type="text"
                      value={form.yearsOfExperience}
                      onChange={(e) => setForm({ ...form, yearsOfExperience: e.target.value })}
                      placeholder="8 Years"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Previous Organization</label>
                    <input
                      type="text"
                      value={form.previousOrganization}
                      onChange={(e) => setForm({ ...form, previousOrganization: e.target.value })}
                      placeholder="St. Xavier High School, Kolkata"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Teacher / Faculty Specific Inputs */}
                {['teacher', 'faculty', 'principal', 'vice_principal'].includes(form.role) && (
                  <div className="p-4 bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-2xl space-y-3">
                    <h4 className="text-xs font-extrabold text-school-blue uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="h-4 w-4" /> Academic Pedagogy & Class Assignments
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Subjects Taught</label>
                        <input
                          type="text"
                          value={form.subjectsTaught}
                          onChange={(e) => setForm({ ...form, subjectsTaught: e.target.value })}
                          placeholder="Physics, Applied Mathematics"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Classes Assigned</label>
                        <input
                          type="text"
                          value={form.classesAssigned}
                          onChange={(e) => setForm({ ...form, classesAssigned: e.target.value })}
                          placeholder="Grade 9 - A, Grade 10 - B"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: CONTACT & ADDRESS */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Phone className="h-4 w-4 text-school-blue" />
                    <span>4. Contact Information & Residential Address</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 04 / 08</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Primary Mobile *</label>
                    <input
                      type="text"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 9876543210"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Alternate Mobile</label>
                    <input
                      type="text"
                      value={form.altPhone}
                      onChange={(e) => setForm({ ...form, altPhone: e.target.value })}
                      placeholder="+91 9876500000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Emergency Contact Phone *</label>
                    <input
                      type="text"
                      required
                      value={form.emergencyPhone}
                      onChange={(e) => setForm({ ...form, emergencyPhone: e.target.value })}
                      placeholder="+91 9876511111"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Present Address */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-school-blue" /> Present Residential Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Address Line 1"
                      value={form.presentAddress1}
                      onChange={(e) => setForm({ ...form, presentAddress1: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2"
                      value={form.presentAddress2}
                      onChange={(e) => setForm({ ...form, presentAddress2: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="City"
                      value={form.presentCity}
                      onChange={(e) => setForm({ ...form, presentCity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="District"
                      value={form.presentDistrict}
                      onChange={(e) => setForm({ ...form, presentDistrict: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="State"
                      value={form.presentState}
                      onChange={(e) => setForm({ ...form, presentState: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code"
                      value={form.presentPin}
                      onChange={(e) => setForm({ ...form, presentPin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Permanent Address Toggle */}
                <div className="flex items-center gap-2 px-1">
                  <input
                    type="checkbox"
                    id="sameAddressStaff"
                    checked={form.sameAsPresentAddress}
                    onChange={(e) => setForm({ ...form, sameAsPresentAddress: e.target.checked })}
                    className="h-4 w-4 text-school-blue rounded border-slate-300 focus:ring-school-blue cursor-pointer"
                  />
                  <label htmlFor="sameAddressStaff" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                    Permanent Address is same as Present Address
                  </label>
                </div>

                {!form.sameAsPresentAddress && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                    <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Permanent Address
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Address Line 1"
                        value={form.permanentAddress1}
                        onChange={(e) => setForm({ ...form, permanentAddress1: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="Address Line 2"
                        value={form.permanentAddress2}
                        onChange={(e) => setForm({ ...form, permanentAddress2: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={form.permanentCity}
                        onChange={(e) => setForm({ ...form, permanentCity: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="District"
                        value={form.permanentDistrict}
                        onChange={(e) => setForm({ ...form, permanentDistrict: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={form.permanentState}
                        onChange={(e) => setForm({ ...form, permanentState: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                      <input
                        type="text"
                        placeholder="PIN Code"
                        value={form.permanentPin}
                        onChange={(e) => setForm({ ...form, permanentPin: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 5: BANK & SALARY */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-school-blue" />
                    <span>5. Statutory IDs, Bank Account & Payroll</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 05 / 08</span>
                </div>

                {/* Identity Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Aadhaar Number *</label>
                    <input
                      type="text"
                      required
                      value={form.aadhaarNo}
                      onChange={(e) => setForm({ ...form, aadhaarNo: e.target.value })}
                      placeholder="4589 1234 5678"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">PAN Number *</label>
                    <input
                      type="text"
                      required
                      value={form.panNo}
                      onChange={(e) => setForm({ ...form, panNo: e.target.value.toUpperCase() })}
                      placeholder="ABCDE1234F"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono uppercase"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Passport No (Optional)</label>
                    <input
                      type="text"
                      value={form.passportNo}
                      onChange={(e) => setForm({ ...form, passportNo: e.target.value })}
                      placeholder="Z1234567"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Driving License (Drivers)</label>
                    <input
                      type="text"
                      value={form.drivingLicenseNo}
                      onChange={(e) => setForm({ ...form, drivingLicenseNo: e.target.value })}
                      placeholder="WB-01202012345"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Bank Account */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-school-blue" /> Direct Salary Bank Transfer Details
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Account Holder Name</label>
                      <input
                        type="text"
                        value={form.accountHolderName}
                        onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Bank Name</label>
                      <input
                        type="text"
                        value={form.bankName}
                        onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Branch Name</label>
                      <input
                        type="text"
                        value={form.branchName}
                        onChange={(e) => setForm({ ...form, branchName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Account Number</label>
                      <input
                        type="text"
                        value={form.accountNumber}
                        onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-mono font-bold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">IFSC Code</label>
                      <input
                        type="text"
                        value={form.ifscCode}
                        onChange={(e) => setForm({ ...form, ifscCode: e.target.value.toUpperCase() })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-mono uppercase"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">UPI ID (Optional)</label>
                      <input
                        type="text"
                        value={form.upiId}
                        onChange={(e) => setForm({ ...form, upiId: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Salary Calculation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Basic Salary (₹) *</label>
                    <input
                      type="number"
                      required
                      value={form.basicSalary}
                      onChange={(e) => setForm({ ...form, basicSalary: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono font-extrabold text-emerald-600"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Allowances (₹)</label>
                    <input
                      type="number"
                      value={form.allowances}
                      onChange={(e) => setForm({ ...form, allowances: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Deductions (PF / Tax ₹)</label>
                    <input
                      type="number"
                      value={form.deductions}
                      onChange={(e) => setForm({ ...form, deductions: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono text-rose-500"
                    />
                  </div>
                </div>

                {/* Net Salary Banner */}
                <div className="p-3.5 bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 block">Calculated Net Monthly Salary</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">₹{netSalary.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300 block">{form.salaryType} Pay</span>
                    <span className="text-[10px] text-slate-400">{form.paymentMethod}</span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: DOCUMENTS UPLOAD */}
            {currentStep === 6 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-school-blue" />
                    <span>6. Staff Verification Document Repository</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 06 / 08</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { key: 'passportPhoto', label: 'Passport Photo', icon: Camera },
                    { key: 'resume', label: 'Resume / CV', icon: FileText },
                    { key: 'aadhaarDoc', label: 'Aadhaar Card', icon: IdCard },
                    { key: 'panDoc', label: 'PAN Card', icon: IdCard },
                    { key: 'eduCerts', label: 'Educational Certificates', icon: GraduationCap },
                    { key: 'expCerts', label: 'Experience Certificates', icon: Award },
                    { key: 'joiningLetter', label: 'Joining / Offer Letter', icon: FileCheck },
                    { key: 'appointmentLetter', label: 'Appointment Letter', icon: FileCheck },
                    { key: 'policeVerification', label: 'Police Verification', icon: ShieldCheck },
                  ].map((doc) => {
                    const DocIcon = doc.icon;
                    const item = docsState[doc.key as keyof typeof docsState];
                    return (
                      <div key={doc.key} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                            <DocIcon className="h-3.5 w-3.5 text-school-blue" /> {doc.label}
                          </span>
                          {item.name ? (
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded">Attached</span>
                          ) : (
                            <span className="text-[9px] font-bold text-slate-400">Optional</span>
                          )}
                        </div>
                        <label className="cursor-pointer block text-center py-2 px-3 bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-school-blue transition-colors truncate">
                          {item.name ? item.name : 'Choose File'}
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleDocumentUpload(doc.key as keyof typeof docsState, e)}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 7: LOGIN & PERMISSIONS */}
            {currentStep === 7 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Key className="h-4 w-4 text-school-blue" />
                    <span>7. Portal Provisioning & Access Rights</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 07 / 08</span>
                </div>

                {/* Provisioned Card */}
                <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl text-white space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="h-4 w-4" /> Automated Institutional Account Provisioning
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Ready to Provision
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Institutional Username:</span>
                      <span className="font-extrabold text-white text-sm">{form.employeeId}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Official Email Address:</span>
                      <input
                        type="email"
                        value={form.officialEmail || `${form.employeeId.toLowerCase()}@school.edu.in`}
                        onChange={(e) => setForm({ ...form, officialEmail: e.target.value })}
                        className="bg-white/10 px-3 py-1 rounded-lg text-white w-full border border-white/20 focus:outline-none"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Default Portal Password (DOB):</span>
                      <span className="font-extrabold text-amber-300 bg-amber-400/20 px-2.5 py-1 rounded-lg border border-amber-400/30 inline-block mt-1">
                        {formatDob(form.dob)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">Role Permissions Scope:</span>
                      <span className="font-extrabold text-slate-200 uppercase">{getRoleLabel(form.role)} Portal Scope</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: REVIEW & SUBMIT */}
            {currentStep === 8 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>8. Final Review & Confirm Registration</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 08 / 08</span>
                </div>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                        <User className="h-3.5 w-3.5 text-school-blue" /> Personal Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(1)} className="text-[10px] font-bold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400 font-semibold">Name:</span> <strong className="text-slate-800 dark:text-white">{form.name}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Emp ID:</span> <span className="font-mono font-bold text-school-blue">{form.employeeId}</span></p>
                    <p><span className="text-slate-400 font-semibold">DOB & Gender:</span> {form.dob} • {form.gender}</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 text-school-blue" /> Employment Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(2)} className="text-[10px] font-bold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400 font-semibold">Role:</span> <strong className="text-slate-800 dark:text-white">{getRoleLabel(form.role)}</strong></p>
                    <p><span className="text-slate-400 font-semibold">Department:</span> {form.department}</p>
                    <p><span className="text-slate-400 font-semibold">Designation:</span> {form.designation}</p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5 text-school-blue" /> Contact Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(4)} className="text-[10px] font-bold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400 font-semibold">Mobile:</span> <span className="font-mono">{form.phone}</span></p>
                    <p><span className="text-slate-400 font-semibold">Official Email:</span> <span className="font-mono">{form.officialEmail || form.email}</span></p>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 text-school-blue" /> Pay & Bank Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(5)} className="text-[10px] font-bold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400 font-semibold">Basic Pay:</span> ₹{form.basicSalary.toLocaleString()}</p>
                    <p><span className="text-slate-400 font-semibold">Net Pay:</span> <span className="font-bold text-emerald-600 font-mono">₹{netSalary.toLocaleString()}</span></p>
                    <p><span className="text-slate-400 font-semibold">Bank:</span> {form.bankName} ({form.accountNumber})</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-extrabold text-slate-600 dark:text-slate-300 disabled:opacity-30 flex items-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Previous Step
              </button>

              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>

                {currentStep < 8 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setCurrentStep(prev => Math.min(8, prev + 1))}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Next Step ({currentStep + 1}/8)
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={createMutation.isPending}
                    leftIcon={<ShieldCheck className="h-4 w-4 text-emerald-400" />}
                  >
                    {createMutation.isPending ? 'Registering Staff...' : 'Submit Staff Registration'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* ── BEAUTIFUL SUCCESS CONFIRMATION MODAL ── */}
      <Modal
        isOpen={Boolean(successStaffData)}
        onClose={() => setSuccessStaffData(null)}
        title="Staff Member Registered"
        size="md"
      >
        {successStaffData && (
          <div className="text-center space-y-6 py-2">
            {/* Celebration Icon */}
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>

            {/* Title */}
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Staff Member Registered Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Institutional member account provisioned and added to directory.
              </p>
            </div>

            {/* Staff Details Card */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-school-blue" />
                  {successStaffData.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/40 text-school-blue border border-blue-200 dark:border-blue-900 font-mono">
                  {successStaffData.employeeId}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Role & Department</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {successStaffData.role} ({successStaffData.department})
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Portal Access</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Institutional Staff</span>
                </div>
              </div>

              {/* Login Credentials Subcard */}
              <div className="p-3.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-xl text-white space-y-2 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Key className="h-3.5 w-3.5" /> Staff Login Credentials
                  </span>
                  <span className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-slate-300">Auto-Generated</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans text-[11px]">Official Email:</span>
                    <span className="font-extrabold text-white">{successStaffData.email}</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400 font-sans text-[11px]">Default Password:</span>
                    <span className="font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30">
                      {successStaffData.password}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCopyCredentials}
                leftIcon={copiedState ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-school-blue" />}
              >
                {copiedState ? 'Credentials Copied!' : 'Copy Credentials'}
              </Button>
              <Button
                type="button"
                variant="primary"
                onClick={() => setSuccessStaffData(null)}
                leftIcon={<CheckCircle className="h-4 w-4" />}
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
