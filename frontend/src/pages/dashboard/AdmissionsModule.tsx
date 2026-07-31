import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Plus, Eye, Trash2, HelpCircle, Camera, UploadCloud, Key,
  User, GraduationCap, Users, Home, HeartPulse, Bus, CreditCard,
  FileText, ShieldCheck, CheckCircle, ChevronLeft, ChevronRight,
  RefreshCw, Check, AlertCircle, MapPin, Bed, ShieldAlert, Sparkles,
  FileUp, CheckCircle2, UserCheck, Phone, Mail, FileCheck, Copy
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import type { Column } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { studentService, enquiryService } from '../../services/services';
import type { Student } from '../../services/mockDb';
import { useAuth } from '../../store/AuthContext';

function generateAdmissionNo(): string {
  const year = new Date().getFullYear();
  return `ADM${year}${Math.floor(1000 + Math.random() * 9000)}`;
}

function generateRollNo(): string {
  return `R-${Math.floor(100 + Math.random() * 900)}`;
}

interface Enquiry {
  id: number;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  student_name: string;
  applying_grade: string;
  status: 'New' | 'Contacted' | 'Admitted' | 'Closed';
  notes: string;
  created_at: string;
}

const WIZARD_STEPS = [
  { id: 1, title: 'Personal Details', icon: User, short: 'Personal' },
  { id: 2, title: 'Academic Details', icon: GraduationCap, short: 'Academic' },
  { id: 3, title: 'Parent/Guardian Details', icon: Users, short: 'Parents' },
  { id: 4, title: 'Address Details', icon: Home, short: 'Address' },
  { id: 5, title: 'Medical & Emergency', icon: HeartPulse, short: 'Medical' },
  { id: 6, title: 'Transport & Hostel', icon: Bus, short: 'Transport' },
  { id: 7, title: 'Fee Details', icon: CreditCard, short: 'Fees' },
  { id: 8, title: 'Document Upload', icon: FileText, short: 'Documents' },
  { id: 9, title: 'Review & Submit', icon: ShieldCheck, short: 'Review' },
];

export default function AdmissionsModule() {
  const queryClient = useQueryClient();
  const [activeSubTab, setActiveSubTab] = useState<'admissions' | 'enquiries'>('admissions');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Wizard current step state (1 to 9)
  const [currentStep, setCurrentStep] = useState(1);

  // Single photo ref
  const studentPhotoInputRef = useRef<HTMLInputElement>(null);

  // Document Uploads State (Step 8)
  const [documentsState, setDocumentsState] = useState<{
    [key: string]: { file: File | null; preview: string; name: string }
  }>({
    studentPhoto: { file: null, preview: '', name: '' },
    birthCert: { file: null, preview: '', name: '' },
    aadhaarCard: { file: null, preview: '', name: '' },
    transferCert: { file: null, preview: '', name: '' },
    marksheet: { file: null, preview: '', name: '' },
    addressProof: { file: null, preview: '', name: '' },
    parentID: { file: null, preview: '', name: '' },
    incomeCert: { file: null, preview: '', name: '' },
    casteCert: { file: null, preview: '', name: '' },
    medicalCert: { file: null, preview: '', name: '' },
  });

  // Comprehensive Multi-Step Form State
  const [registerForm, setRegisterForm] = useState({
    // Step 1: Personal Details
    admissionNo: '',
    rollNo: '',
    firstName: '',
    middleName: '',
    lastName: '',
    name: '', // Full Name (Auto-computed)
    dob: '',
    gender: 'Male',
    bloodGroup: 'O+',
    category: 'General',
    religion: 'Hinduism',
    nationality: 'Indian',
    aadhaarNo: '',

    // Step 2: Academic Details
    academicSession: '2026–2027',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionType: 'New',
    grade: 'Grade 10',
    section: 'A',
    house: 'Ruby',
    prevSchoolName: '',
    prevSchoolAddress: '',
    lastExamGrade: '',
    mediumOfInstruction: 'English',

    // Step 3: Parent / Guardian Details
    fatherName: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherOccupation: '',
    fatherIncome: '',
    fatherAadhaar: '',
    motherName: '',
    motherPhone: '',
    motherEmail: '',
    motherOccupation: '',
    motherIncome: '',
    motherAadhaar: '',
    isGuardianDifferent: false,
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianAddress: '',

    // Legacy fields mapped for compatibility
    parentName: '',
    parentPhone: '',
    parentEmail: '',

    // Step 4: Address Details
    presentAddressLine1: '',
    presentAddressLine2: '',
    presentCity: '',
    presentState: '',
    presentDistrict: '',
    presentCountry: 'India',
    presentPinCode: '',
    sameAsPresentAddress: true,
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentCity: '',
    permanentState: '',
    permanentDistrict: '',
    permanentCountry: 'India',
    permanentPinCode: '',
    address: '',

    // Step 5: Medical & Emergency Contact
    emergencyContactName: '',
    emergencyRelation: '',
    emergencyPhone: '',
    emergencyAltPhone: '',
    emergencyEmail: '',
    allergies: '',
    medicalConditions: '',
    hasDisability: 'No',
    doctorName: '',
    emergencyNotes: '',

    // Step 6: Transport & Hostel Details
    requiresTransport: 'No',
    pickupPoint: '',
    routeNumber: '',
    vehicleNumber: '',
    driverName: '',
    driverContact: '',
    requiresHostel: 'No',
    hostelName: '',
    roomNumber: '',
    bedNumber: '',

    // Step 7: Fee Details
    feeStructure: 'Standard',
    hasScholarship: 'No',
    scholarshipPercent: 0,
    discountAmount: 0,
    admissionFee: 2000,
    tuitionFee: 3000,
    transportFee: 0,
    hostelFee: 0,
    totalFees: 5000,
    paymentStatus: 'Pending',

    // Step 9: Credentials & Other Information
    username: '',
    studentEmail: '',
    parentPortalLogin: true,
    languagesKnown: 'English, Hindi',
    hobbies: '',
    specialTalent: '',
    notes: '',
    status: 'Active',
    rfidCardNo: '',
    libraryCardNo: ''
  });

  // Auto-compute Full Name when First, Middle, or Last name changes
  useEffect(() => {
    const parts = [registerForm.firstName, registerForm.middleName, registerForm.lastName].filter(Boolean);
    const fullName = parts.join(' ').trim();
    if (fullName) {
      setRegisterForm(prev => ({ ...prev, name: fullName }));
    }
  }, [registerForm.firstName, registerForm.middleName, registerForm.lastName]);

  // Auto-sync parent fields for compatibility
  useEffect(() => {
    const parentName = registerForm.fatherName || registerForm.motherName || registerForm.guardianName;
    const parentPhone = registerForm.fatherPhone || registerForm.motherPhone || registerForm.guardianPhone;
    const parentEmail = registerForm.fatherEmail || registerForm.motherEmail || registerForm.guardianEmail;
    setRegisterForm(prev => ({
      ...prev,
      parentName: parentName || prev.parentName,
      parentPhone: parentPhone || prev.parentPhone,
      parentEmail: parentEmail || prev.parentEmail
    }));
  }, [registerForm.fatherName, registerForm.fatherPhone, registerForm.fatherEmail, registerForm.motherName, registerForm.motherPhone, registerForm.motherEmail, registerForm.guardianName, registerForm.guardianPhone, registerForm.guardianEmail]);

  // Auto-sync address string
  useEffect(() => {
    const addr = [registerForm.presentAddressLine1, registerForm.presentCity, registerForm.presentState, registerForm.presentPinCode].filter(Boolean).join(', ');
    if (addr) {
      setRegisterForm(prev => ({ ...prev, address: addr }));
    }
  }, [registerForm.presentAddressLine1, registerForm.presentCity, registerForm.presentState, registerForm.presentPinCode]);

  // Auto-calculate Fee totals
  useEffect(() => {
    let transportCost = registerForm.requiresTransport === 'Yes' ? 1200 : 0;
    let hostelCost = registerForm.requiresHostel === 'Yes' ? 4500 : 0;
    let base = (Number(registerForm.admissionFee) || 0) + (Number(registerForm.tuitionFee) || 0) + transportCost + hostelCost;
    
    let discount = Number(registerForm.discountAmount) || 0;
    if (registerForm.hasScholarship === 'Yes' && registerForm.scholarshipPercent > 0) {
      discount += (base * (Number(registerForm.scholarshipPercent) / 100));
    }
    
    const finalTotal = Math.max(0, Math.round(base - discount));
    setRegisterForm(prev => ({
      ...prev,
      transportFee: transportCost,
      hostelFee: hostelCost,
      totalFees: finalTotal
    }));
  }, [registerForm.admissionFee, registerForm.tuitionFee, registerForm.requiresTransport, registerForm.requiresHostel, registerForm.hasScholarship, registerForm.scholarshipPercent, registerForm.discountAmount]);

  // Auto-copy present address to permanent address if checkbox checked
  useEffect(() => {
    if (registerForm.sameAsPresentAddress) {
      setRegisterForm(prev => ({
        ...prev,
        permanentAddressLine1: prev.presentAddressLine1,
        permanentAddressLine2: prev.presentAddressLine2,
        permanentCity: prev.presentCity,
        permanentState: prev.presentState,
        permanentDistrict: prev.presentDistrict,
        permanentCountry: prev.presentCountry,
        permanentPinCode: prev.presentPinCode
      }));
    }
  }, [registerForm.sameAsPresentAddress, registerForm.presentAddressLine1, registerForm.presentAddressLine2, registerForm.presentCity, registerForm.presentState, registerForm.presentDistrict, registerForm.presentCountry, registerForm.presentPinCode]);

  const handleOpenRegister = () => {
    const admNo = generateAdmissionNo();
    const rollNo = generateRollNo();
    setCurrentStep(1);
    setDocumentsState({
      studentPhoto: { file: null, preview: '', name: '' },
      birthCert: { file: null, preview: '', name: '' },
      aadhaarCard: { file: null, preview: '', name: '' },
      transferCert: { file: null, preview: '', name: '' },
      marksheet: { file: null, preview: '', name: '' },
      addressProof: { file: null, preview: '', name: '' },
      parentID: { file: null, preview: '', name: '' },
      incomeCert: { file: null, preview: '', name: '' },
      casteCert: { file: null, preview: '', name: '' },
      medicalCert: { file: null, preview: '', name: '' },
    });
    setRegisterForm({
      admissionNo: admNo,
      rollNo: rollNo,
      firstName: '',
      middleName: '',
      lastName: '',
      name: '',
      dob: '',
      gender: 'Male',
      bloodGroup: 'O+',
      category: 'General',
      religion: '',
      nationality: 'Indian',
      aadhaarNo: '',

      academicSession: '2026–2027',
      admissionDate: new Date().toISOString().split('T')[0],
      admissionType: 'New',
      grade: 'Grade 10',
      section: 'A',
      house: 'Ruby',
      prevSchoolName: '',
      prevSchoolAddress: '',
      lastExamGrade: '',
      mediumOfInstruction: 'English',

      fatherName: '',
      fatherPhone: '',
      fatherEmail: '',
      fatherOccupation: '',
      fatherIncome: '',
      fatherAadhaar: '',
      motherName: '',
      motherPhone: '',
      motherEmail: '',
      motherOccupation: '',
      motherIncome: '',
      motherAadhaar: '',
      isGuardianDifferent: false,
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      guardianEmail: '',
      guardianAddress: '',

      parentName: '',
      parentPhone: '',
      parentEmail: '',

      presentAddressLine1: '',
      presentAddressLine2: '',
      presentCity: '',
      presentState: '',
      presentDistrict: '',
      presentCountry: 'India',
      presentPinCode: '',
      sameAsPresentAddress: true,
      permanentAddressLine1: '',
      permanentAddressLine2: '',
      permanentCity: '',
      permanentState: '',
      permanentDistrict: '',
      permanentCountry: 'India',
      permanentPinCode: '',
      address: '',

      emergencyContactName: '',
      emergencyRelation: '',
      emergencyPhone: '',
      emergencyAltPhone: '',
      emergencyEmail: '',
      allergies: '',
      medicalConditions: '',
      hasDisability: 'No',
      doctorName: '',
      emergencyNotes: '',

      requiresTransport: 'No',
      pickupPoint: '',
      routeNumber: '',
      vehicleNumber: '',
      driverName: '',
      driverContact: '',
      requiresHostel: 'No',
      hostelName: '',
      roomNumber: '',
      bedNumber: '',

      feeStructure: 'Standard',
      hasScholarship: 'No',
      scholarshipPercent: 0,
      discountAmount: 0,
      admissionFee: 2000,
      tuitionFee: 3000,
      transportFee: 0,
      hostelFee: 0,
      totalFees: 5000,
      paymentStatus: 'Pending',

      username: admNo.toLowerCase(),
      studentEmail: '',
      parentPortalLogin: true,
      languagesKnown: '',
      hobbies: '',
      specialTalent: '',
      notes: '',
      status: 'Active',
      rfidCardNo: '',
      libraryCardNo: ''
    });
    setIsRegisterOpen(true);
  };

  // Generic document upload handler
  const handleDocumentChange = (docKey: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDocumentsState(prev => ({
        ...prev,
        [docKey]: {
          file,
          preview: ev.target?.result as string,
          name: file.name
        }
      }));
    };
    reader.readAsDataURL(file);
  };

  // Enquiry Form State
  const [enquiryForm, setEnquiryForm] = useState({
    parent_name: '',
    parent_email: '',
    parent_phone: '',
    student_name: '',
    applying_grade: 'Grade 10',
    notes: ''
  });

  // Queries
  const { data: students, isLoading: loadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll
  });

  const { data: enquiries, isLoading: loadingEnquiries } = useQuery({
    queryKey: ['enquiries'],
    queryFn: enquiryService.getAll
  });

  interface SuccessRegistration {
    name: string;
    admissionNo: string;
    grade: string;
    section: string;
    email: string;
    password: string;
  }
  const [registrationSuccessData, setRegistrationSuccessData] = useState<SuccessRegistration | null>(null);
  const [copiedState, setCopiedState] = useState(false);

  const handleCopyCredentials = () => {
    if (!registrationSuccessData) return;
    const text = `🎉 SubhraEdu Student Registration Details\n\n` +
      `Student Name: ${registrationSuccessData.name}\n` +
      `Admission No: ${registrationSuccessData.admissionNo}\n` +
      `Class & Section: ${registrationSuccessData.grade} - Section ${registrationSuccessData.section}\n` +
      `Portal Email: ${registrationSuccessData.email}\n` +
      `Default Password: ${registrationSuccessData.password}\n\n` +
      `Access Portal: ${window.location.origin}/login`;
    navigator.clipboard.writeText(text);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  const { user } = useAuth();
  const schoolSubdomain = user?.school?.subdomain || user?.school_name?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'school';

  // Mutations
  const createStudentMutation = useMutation({
    mutationFn: studentService.create,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      setIsRegisterOpen(false);
      const admNo = (variables.admissionNo || variables.admission_no || '').toLowerCase().replace(/[\s-]/g, '');
      const loginEmail = variables.parentEmail || variables.parent_email || `${admNo}@${schoolSubdomain}.subhraedu.com`;
      const loginPassword = (variables.dob || '').replace(/-/g, '') || 'student123';
      
      setRegistrationSuccessData({
        name: variables.name,
        admissionNo: variables.admissionNo || variables.admission_no,
        grade: variables.grade,
        section: variables.section,
        email: loginEmail,
        password: loginPassword,
      });
    },
    onError: (err: any) => {
      console.error(err);
      alert('Failed to register student: ' + (err.response?.data?.message || err.message));
    }
  });

  const createEnquiryMutation = useMutation({
    mutationFn: enquiryService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
      setIsEnquiryOpen(false);
      setEnquiryForm({
        parent_name: '', parent_email: '', parent_phone: '', student_name: '', applying_grade: 'Grade 10', notes: ''
      });
    }
  });

  const updateEnquiryMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Enquiry> }) => enquiryService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });

  const deleteEnquiryMutation = useMutation({
    mutationFn: enquiryService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enquiries'] });
    }
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 9) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    // Submit final payload
    const payload = {
      ...registerForm,
      admission_no: registerForm.admissionNo,
      roll_no: registerForm.rollNo,
      parent_name: registerForm.parentName || registerForm.fatherName || 'Guardian',
      parent_phone: registerForm.parentPhone || registerForm.fatherPhone || '0000000000',
      parent_email: registerForm.parentEmail || registerForm.fatherEmail || `${registerForm.admissionNo.toLowerCase()}@student.school`,
      blood_group: registerForm.bloodGroup,
      total_fees: registerForm.totalFees,
    };

    createStudentMutation.mutate(payload);
  };

  const handleEnquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createEnquiryMutation.mutate(enquiryForm);
  };

  const handleDeleteEnquiry = (id: number) => {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      deleteEnquiryMutation.mutate(id);
    }
  };

  // Table Columns
  const studentColumns: Column<Student>[] = [
    {
      header: 'Admission No',
      accessor: 'admission_no',
      cell: (row) => (
        <span className="font-mono font-extrabold text-school-blue bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg text-xs">
          {row.admission_no}
        </span>
      )
    },
    {
      header: 'Student Name',
      accessor: 'name',
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-xs shrink-0">
            {row.name.charAt(0)}
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block text-sm">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold">{row.gender} • DOB: {row.dob}</span>
          </div>
        </div>
      )
    },
    { header: 'Grade', accessor: 'grade' },
    { header: 'Section', accessor: 'section' },
    {
      header: 'Parent Info',
      cell: (row) => (
        <div>
          <span className="font-semibold block text-xs">{row.parentName}</span>
          <span className="text-[10px] text-slate-400 font-mono block">{row.parentPhone}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
          row.status === 'Active' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30' : 'bg-slate-100 text-slate-500'
        }`}>
          {row.status}
        </span>
      )
    }
  ];

  const enquiryColumns: Column<Enquiry>[] = [
    { header: 'Student Name', accessor: 'student_name' },
    { header: 'Parent Name', accessor: 'parent_name' },
    { header: 'Grade Applied', accessor: 'applying_grade' },
    {
      header: 'Contact',
      cell: (row) => (
        <div>
          <span className="block text-xs font-semibold">{row.parent_phone}</span>
          <span className="text-[10px] text-slate-400 block">{row.parent_email}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => updateEnquiryMutation.mutate({ id: row.id, data: { status: e.target.value as any } })}
          className="text-xs font-bold px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950"
        >
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Admitted">Admitted</option>
          <option value="Closed">Closed</option>
        </select>
      )
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Admissions & Student Registration
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Manage comprehensive student portfolios, 9-step registration wizard, documents, and admission enquiries.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={handleOpenRegister} leftIcon={<Sparkles className="h-4 w-4" />}>
            Register Student Portfolio
          </Button>
        </div>
      </div>

      {/* Subtabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('admissions')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
            activeSubTab === 'admissions'
              ? 'bg-school-blue text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Active Students Ledger ({students?.length || 0})
        </button>
        <button
          onClick={() => setActiveSubTab('enquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-colors ${
            activeSubTab === 'enquiries'
              ? 'bg-school-blue text-white shadow-sm'
              : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Admission Enquiries ({enquiries?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeSubTab === 'admissions' ? (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <DataTable
            data={students || []}
            columns={studentColumns}
            isLoading={loadingStudents}
            searchable
            searchPlaceholder="Search student by name, admission no, or roll no..."
            actions={(row) => (
              <Button variant="ghost" size="sm" onClick={() => { setSelectedStudent(row); setIsProfileOpen(true); }}>
                <Eye className="h-4 w-4 text-slate-500" />
              </Button>
            )}
          />
        </Card>
      ) : (
        <Card className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <DataTable
            data={enquiries || []}
            columns={enquiryColumns}
            isLoading={loadingEnquiries}
            searchable
            searchPlaceholder="Search enquiries..."
            actions={(row) => (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2"
                  onClick={() => alert(`Enquiry Notes: ${row.notes || 'No notes added yet'}`)}
                >
                  <HelpCircle className="h-4 w-4 text-school-blue" />
                </Button>
                <Button variant="ghost" size="sm" className="px-2" onClick={() => handleDeleteEnquiry(row.id)}>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
          />
        </Card>
      )}

      {/* ============================================================== */}
      {/* ULTRA-PREMIUM 9-STEP MULTI-STEP STUDENT REGISTRATION WIZARD   */}
      {/* ============================================================== */}
      <Modal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} title="Register Student Portfolio" size="xl">
        <div className="space-y-6 text-left max-h-[80vh] overflow-y-auto pr-1">
          
          {/* Step Indicators Header Bar */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2 text-school-blue">
                <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
                Step {currentStep} of 9: <span className="text-slate-900 dark:text-white font-black">{WIZARD_STEPS[currentStep - 1].title}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono font-bold">
                {Math.round((currentStep / 9) * 100)}% Completed
              </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-school-blue via-indigo-600 to-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${(currentStep / 9) * 100}%` }}
              />
            </div>

            {/* Step Icons Row */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pt-1 pb-0.5 scrollbar-thin">
              {WIZARD_STEPS.map((step) => {
                const StepIcon = step.icon;
                const isCompleted = currentStep > step.id;
                const isCurrent = currentStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setCurrentStep(step.id)}
                    className={`flex flex-col items-center gap-1 min-w-[56px] py-1 px-1.5 rounded-xl transition-all ${
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
                    <span className="text-[9px] font-black tracking-tight truncate max-w-[50px]">{step.short}</span>
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
                    <span>1. Personal Information & Identity</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 01 / 09</span>
                </div>

                {/* Auto Admission No Header */}
                <div className="p-3.5 bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Admission Number (Auto)</span>
                    <span className="text-base font-extrabold text-school-blue font-mono">{registerForm.admissionNo}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRegisterForm(prev => ({ ...prev, admissionNo: generateAdmissionNo() }))}
                    className="text-xs font-bold text-school-blue hover:underline flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                  </button>
                </div>

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">First Name *</label>
                    <input
                      type="text"
                      required
                      value={registerForm.firstName}
                      onChange={(e) => setRegisterForm({ ...registerForm, firstName: e.target.value })}
                      placeholder="e.g. Aarav"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Middle Name (Optional)</label>
                    <input
                      type="text"
                      value={registerForm.middleName}
                      onChange={(e) => setRegisterForm({ ...registerForm, middleName: e.target.value })}
                      placeholder="e.g. Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={registerForm.lastName}
                      onChange={(e) => setRegisterForm({ ...registerForm, lastName: e.target.value })}
                      placeholder="e.g. Sharma"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Full Name Display */}
                <div className="p-3 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-xs font-semibold flex items-center justify-between">
                  <span className="text-slate-500">Auto-Generated Full Name:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">{registerForm.name || 'Enter First & Last Name above'}</span>
                </div>

                {/* DOB, Gender, Blood Group */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Date of Birth *</label>
                    <input
                      type="date"
                      required
                      value={registerForm.dob}
                      onChange={(e) => setRegisterForm({ ...registerForm, dob: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Gender *</label>
                    <select
                      value={registerForm.gender}
                      onChange={(e) => setRegisterForm({ ...registerForm, gender: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Blood Group</label>
                    <select
                      value={registerForm.bloodGroup}
                      onChange={(e) => setRegisterForm({ ...registerForm, bloodGroup: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
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
                </div>

                {/* Category, Religion, Nationality, Aadhaar */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Category</label>
                    <select
                      value={registerForm.category}
                      onChange={(e) => setRegisterForm({ ...registerForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC">SC</option>
                      <option value="ST">ST</option>
                      <option value="EWS">EWS</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Religion (Optional)</label>
                    <input
                      type="text"
                      value={registerForm.religion}
                      onChange={(e) => setRegisterForm({ ...registerForm, religion: e.target.value })}
                      placeholder="Hinduism"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Nationality</label>
                    <input
                      type="text"
                      value={registerForm.nationality}
                      onChange={(e) => setRegisterForm({ ...registerForm, nationality: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Aadhaar (Optional)</label>
                    <input
                      type="text"
                      value={registerForm.aadhaarNo}
                      onChange={(e) => setRegisterForm({ ...registerForm, aadhaarNo: e.target.value })}
                      placeholder="1234 5678 9012"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Photo Dropzone Quick Pick */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center overflow-hidden shrink-0">
                      {documentsState.studentPhoto.preview ? (
                        <img src={documentsState.studentPhoto.preview} alt="Student Preview" className="h-full w-full object-cover" />
                      ) : (
                        <Camera className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white block">Student Passport Photo</span>
                      <span className="text-[10px] text-slate-400 block font-semibold">JPEG, PNG, WebP · Max 5MB</span>
                    </div>
                  </div>
                  <label className="cursor-pointer px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-extrabold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors inline-flex items-center gap-1.5">
                    <UploadCloud className="h-4 w-4" />
                    {documentsState.studentPhoto.name ? 'Change Photo' : 'Upload Photo'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleDocumentChange('studentPhoto', e)}
                    />
                  </label>
                </div>
              </div>
            )}

            {/* STEP 2: ACADEMIC DETAILS */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-school-blue" />
                    <span>2. Academic & Grade Information</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 02 / 09</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Academic Session</label>
                    <select
                      value={registerForm.academicSession}
                      onChange={(e) => setRegisterForm({ ...registerForm, academicSession: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    >
                      <option value="2026–2027">2026–2027</option>
                      <option value="2025–2026">2025–2026</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Admission Date</label>
                    <input
                      type="date"
                      value={registerForm.admissionDate}
                      onChange={(e) => setRegisterForm({ ...registerForm, admissionDate: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Admission Type</label>
                    <select
                      value={registerForm.admissionType}
                      onChange={(e) => setRegisterForm({ ...registerForm, admissionType: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-extrabold text-school-blue"
                    >
                      <option value="New">New Admission</option>
                      <option value="Transfer">Transfer Student</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Class / Grade *</label>
                    <select
                      value={registerForm.grade}
                      onChange={(e) => setRegisterForm({ ...registerForm, grade: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold text-school-blue"
                    >
                      {Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`).map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Section *</label>
                    <select
                      value={registerForm.section}
                      onChange={(e) => setRegisterForm({ ...registerForm, section: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    >
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Roll Number</label>
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={registerForm.rollNo}
                        onChange={(e) => setRegisterForm({ ...registerForm, rollNo: e.target.value })}
                        placeholder="R-101"
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setRegisterForm(prev => ({ ...prev, rollNo: generateRollNo() }))}
                        className="px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-500 hover:text-slate-900 shrink-0"
                      >
                        Auto
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">House (Optional)</label>
                    <select
                      value={registerForm.house}
                      onChange={(e) => setRegisterForm({ ...registerForm, house: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="Ruby">Ruby House</option>
                      <option value="Sapphire">Sapphire House</option>
                      <option value="Emerald">Emerald House</option>
                      <option value="Topaz">Topaz House</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Medium of Instruction</label>
                  <select
                    value={registerForm.mediumOfInstruction}
                    onChange={(e) => setRegisterForm({ ...registerForm, mediumOfInstruction: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Regional">Regional Language</option>
                  </select>
                </div>

                {/* Transfer Student Previous Academic History (Shown ONLY for Transfer Admission) */}
                {registerForm.admissionType === 'Transfer' && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 pt-3">
                    <h4 className="text-xs font-extrabold text-school-blue uppercase tracking-wider flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" /> Transfer Student Previous Academic History
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Previous School Name</label>
                        <input
                          type="text"
                          value={registerForm.prevSchoolName}
                          onChange={(e) => setRegisterForm({ ...registerForm, prevSchoolName: e.target.value })}
                          placeholder="e.g. St. Xavier International Academy"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Last Exam Grade / Percentage</label>
                        <input
                          type="text"
                          value={registerForm.lastExamGrade}
                          onChange={(e) => setRegisterForm({ ...registerForm, lastExamGrade: e.target.value })}
                          placeholder="88.5% or A Grade"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white font-bold"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Previous School Address</label>
                      <input
                        type="text"
                        value={registerForm.prevSchoolAddress}
                        onChange={(e) => setRegisterForm({ ...registerForm, prevSchoolAddress: e.target.value })}
                        placeholder="City, State"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none dark:text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PARENT / GUARDIAN DETAILS */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Users className="h-4 w-4 text-school-blue" />
                    <span>3. Parent & Guardian Credentials</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 03 / 09</span>
                </div>

                {/* Father Details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-school-blue uppercase tracking-wider">Father's Particulars</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Father Full Name *"
                      value={registerForm.fatherName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherName: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number *"
                      value={registerForm.fatherPhone}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherPhone: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={registerForm.fatherEmail}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherEmail: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Occupation"
                      value={registerForm.fatherOccupation}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherOccupation: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Annual Income (₹)"
                      value={registerForm.fatherIncome}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherIncome: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Aadhaar No."
                      value={registerForm.fatherAadhaar}
                      onChange={(e) => setRegisterForm({ ...registerForm, fatherAadhaar: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Mother Details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-pink-600 dark:text-pink-400 uppercase tracking-wider">Mother's Particulars</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Mother Full Name"
                      value={registerForm.motherName}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherName: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={registerForm.motherPhone}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherPhone: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={registerForm.motherEmail}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherEmail: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Occupation"
                      value={registerForm.motherOccupation}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherOccupation: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Annual Income (₹)"
                      value={registerForm.motherIncome}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherIncome: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Aadhaar No."
                      value={registerForm.motherAadhaar}
                      onChange={(e) => setRegisterForm({ ...registerForm, motherAadhaar: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Guardian Toggle & Inputs */}
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-slate-700 dark:text-slate-300">
                    <input
                      type="checkbox"
                      checked={registerForm.isGuardianDifferent}
                      onChange={(e) => setRegisterForm({ ...registerForm, isGuardianDifferent: e.target.checked })}
                      className="rounded text-school-blue focus:ring-school-blue h-4 w-4"
                    />
                    <span>Guardian details are different from Parents</span>
                  </label>

                  {registerForm.isGuardianDifferent && (
                    <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-3">
                      <h4 className="text-xs font-extrabold text-amber-700 dark:text-amber-300 uppercase tracking-wider">Guardian Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Guardian Name"
                          value={registerForm.guardianName}
                          onChange={(e) => setRegisterForm({ ...registerForm, guardianName: e.target.value })}
                          className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Relationship (e.g. Uncle)"
                          value={registerForm.guardianRelation}
                          onChange={(e) => setRegisterForm({ ...registerForm, guardianRelation: e.target.value })}
                          className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="tel"
                          placeholder="Guardian Mobile"
                          value={registerForm.guardianPhone}
                          onChange={(e) => setRegisterForm({ ...registerForm, guardianPhone: e.target.value })}
                          className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Guardian Full Address"
                        value={registerForm.guardianAddress}
                        onChange={(e) => setRegisterForm({ ...registerForm, guardianAddress: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 4: ADDRESS DETAILS */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Home className="h-4 w-4 text-school-blue" />
                    <span>4. Residential & Permanent Address</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 04 / 09</span>
                </div>

                {/* Present Address */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-school-blue" /> Present Address
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Address Line 1 *"
                      value={registerForm.presentAddressLine1}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentAddressLine1: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Address Line 2 (Optional)"
                      value={registerForm.presentAddressLine2}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentAddressLine2: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <input
                      type="text"
                      placeholder="City *"
                      value={registerForm.presentCity}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentCity: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="District"
                      value={registerForm.presentDistrict}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentDistrict: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="State *"
                      value={registerForm.presentState}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentState: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="PIN Code *"
                      value={registerForm.presentPinCode}
                      onChange={(e) => setRegisterForm({ ...registerForm, presentPinCode: e.target.value })}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Permanent Address Checkbox */}
                <div className="pt-2 border-t border-slate-150 dark:border-slate-800 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-extrabold text-school-blue">
                    <input
                      type="checkbox"
                      checked={registerForm.sameAsPresentAddress}
                      onChange={(e) => setRegisterForm({ ...registerForm, sameAsPresentAddress: e.target.checked })}
                      className="rounded text-school-blue focus:ring-school-blue h-4 w-4"
                    />
                    <span>Permanent Address same as Present Address</span>
                  </label>

                  {!registerForm.sameAsPresentAddress && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Permanent Address</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Address Line 1"
                          value={registerForm.permanentAddressLine1}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentAddressLine1: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="Address Line 2"
                          value={registerForm.permanentAddressLine2}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentAddressLine2: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={registerForm.permanentCity}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentCity: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="District"
                          value={registerForm.permanentDistrict}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentDistrict: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="State"
                          value={registerForm.permanentState}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentState: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                        />
                        <input
                          type="text"
                          placeholder="PIN Code"
                          value={registerForm.permanentPinCode}
                          onChange={(e) => setRegisterForm({ ...registerForm, permanentPinCode: e.target.value })}
                          className="px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 5: MEDICAL & EMERGENCY CONTACT */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-red-500" />
                    <span>5. Emergency Contact & Health Record</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 05 / 09</span>
                </div>

                {/* Emergency Contact */}
                <div className="p-4 bg-red-50/40 dark:bg-red-950/20 rounded-2xl border border-red-200 dark:border-red-900 space-y-3">
                  <h4 className="text-xs font-extrabold text-red-650 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="h-3.5 w-3.5" /> Designated Emergency Contact
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="Contact Person Name *"
                      value={registerForm.emergencyContactName}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyContactName: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Relationship (e.g. Father)"
                      value={registerForm.emergencyRelation}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyRelation: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="tel"
                      placeholder="Emergency Mobile *"
                      value={registerForm.emergencyPhone}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyPhone: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="tel"
                      placeholder="Alternate Mobile (Optional)"
                      value={registerForm.emergencyAltPhone}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyAltPhone: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="email"
                      placeholder="Emergency Email"
                      value={registerForm.emergencyEmail}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyEmail: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                </div>

                {/* Medical Profile */}
                <div className="space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Medical & Health Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Known Allergies</label>
                      <input
                        type="text"
                        value={registerForm.allergies}
                        onChange={(e) => setRegisterForm({ ...registerForm, allergies: e.target.value })}
                        placeholder="e.g. Peanut, Dust"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Medical Conditions</label>
                      <input
                        type="text"
                        value={registerForm.medicalConditions}
                        onChange={(e) => setRegisterForm({ ...registerForm, medicalConditions: e.target.value })}
                        placeholder="e.g. Asthma"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase">Disability Status</label>
                      <select
                        value={registerForm.hasDisability}
                        onChange={(e) => setRegisterForm({ ...registerForm, hasDisability: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                      >
                        <option value="No">No Disability</option>
                        <option value="Yes">Yes (Differently Abled)</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Family Doctor Name (Optional)"
                      value={registerForm.doctorName}
                      onChange={(e) => setRegisterForm({ ...registerForm, doctorName: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Special Medical Notes / Hospital Preference"
                      value={registerForm.emergencyNotes}
                      onChange={(e) => setRegisterForm({ ...registerForm, emergencyNotes: e.target.value })}
                      className="px-3.5 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: TRANSPORT & HOSTEL DETAILS */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Bus className="h-4 w-4 text-amber-500" />
                    <span>6. Transport & Hostel Allocation</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 06 / 09</span>
                </div>

                {/* Transport Section */}
                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Bus className="h-4 w-4" /> School Bus Transport Facility
                      </h4>
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">Assign daily RFID bus route and pickup point.</p>
                    </div>
                    <select
                      value={registerForm.requiresTransport}
                      onChange={(e) => setRegisterForm({ ...registerForm, requiresTransport: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs font-extrabold text-amber-900 dark:text-amber-200"
                    >
                      <option value="No">Transport Not Required</option>
                      <option value="Yes">Requires Transport (₹1,200/mo)</option>
                    </select>
                  </div>

                  {registerForm.requiresTransport === 'Yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Pickup Stop / LandMark"
                        value={registerForm.pickupPoint}
                        onChange={(e) => setRegisterForm({ ...registerForm, pickupPoint: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Route Number (e.g. Route 04)"
                        value={registerForm.routeNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, routeNumber: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Vehicle No. (WB-74-AX-8910)"
                        value={registerForm.vehicleNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, vehicleNumber: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Driver Name"
                        value={registerForm.driverName}
                        onChange={(e) => setRegisterForm({ ...registerForm, driverName: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                      />
                      <input
                        type="tel"
                        placeholder="Driver Contact"
                        value={registerForm.driverContact}
                        onChange={(e) => setRegisterForm({ ...registerForm, driverContact: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-amber-250 dark:border-amber-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                      />
                    </div>
                  )}
                </div>

                {/* Hostel Section */}
                <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-200 dark:border-indigo-900 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-extrabold text-indigo-800 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Bed className="h-4 w-4" /> Boarding & Hostel Facility
                      </h4>
                      <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-0.5">Assign campus residential room and bed number.</p>
                    </div>
                    <select
                      value={registerForm.requiresHostel}
                      onChange={(e) => setRegisterForm({ ...registerForm, requiresHostel: e.target.value })}
                      className="px-3 py-1.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs font-extrabold text-indigo-900 dark:text-indigo-200"
                    >
                      <option value="No">Hostel Not Required</option>
                      <option value="Yes">Requires Hostel Boarding (₹4,500/mo)</option>
                    </select>
                  </div>

                  {registerForm.requiresHostel === 'Yes' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <input
                        type="text"
                        placeholder="Hostel Name (e.g. Ramanujan Block)"
                        value={registerForm.hostelName}
                        onChange={(e) => setRegisterForm({ ...registerForm, hostelName: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-indigo-250 dark:border-indigo-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Room Number (e.g. 302-B)"
                        value={registerForm.roomNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, roomNumber: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-indigo-250 dark:border-indigo-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Bed Number (e.g. Bed 02)"
                        value={registerForm.bedNumber}
                        onChange={(e) => setRegisterForm({ ...registerForm, bedNumber: e.target.value })}
                        className="px-3.5 py-2 rounded-xl border border-indigo-250 dark:border-indigo-900 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 7: FEE DETAILS */}
            {currentStep === 7 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-emerald-600" />
                    <span>7. Fee Structure & Discount Calculator</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 07 / 09</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Fee Structure Template</label>
                    <select
                      value={registerForm.feeStructure}
                      onChange={(e) => setRegisterForm({ ...registerForm, feeStructure: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                    >
                      <option value="Standard">Standard Academic Plan</option>
                      <option value="Concession">Staff Ward Concession</option>
                      <option value="Merit Scholarship">Merit Scholarship Tier</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Scholarship</label>
                    <select
                      value={registerForm.hasScholarship}
                      onChange={(e) => setRegisterForm({ ...registerForm, hasScholarship: e.target.value, scholarshipPercent: e.target.value === 'Yes' ? 20 : 0 })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
                    >
                      <option value="No">No Scholarship</option>
                      <option value="Yes">Merit Scholarship (20% Waiver)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Custom Discount (₹)</label>
                    <input
                      type="number"
                      value={registerForm.discountAmount}
                      onChange={(e) => setRegisterForm({ ...registerForm, discountAmount: Number(e.target.value) })}
                      placeholder="0"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-mono"
                    />
                  </div>
                </div>

                {/* Itemized Fee Breakdown */}
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-900 space-y-4">
                  <h4 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Itemized Fee Components</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Admission Fee</span>
                      <input
                        type="number"
                        value={registerForm.admissionFee}
                        onChange={(e) => setRegisterForm({ ...registerForm, admissionFee: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Tuition Fee</span>
                      <input
                        type="number"
                        value={registerForm.tuitionFee}
                        onChange={(e) => setRegisterForm({ ...registerForm, tuitionFee: Number(e.target.value) })}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 text-xs font-bold font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Transport Fee</span>
                      <input
                        type="number"
                        disabled
                        value={registerForm.transportFee}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-bold font-mono text-slate-500"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Hostel Fee</span>
                      <input
                        type="number"
                        disabled
                        value={registerForm.hostelFee}
                        className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-bold font-mono text-slate-500"
                      />
                    </div>
                  </div>

                  {/* Net Calculated Fee Summary Card */}
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 font-bold block">Net Payable Amount:</span>
                      <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">₹{registerForm.totalFees.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <label className="text-[10px] font-bold text-slate-400 uppercase block">Initial Payment Status</label>
                      <select
                        value={registerForm.paymentStatus}
                        onChange={(e) => setRegisterForm({ ...registerForm, paymentStatus: e.target.value })}
                        className="mt-1 px-3 py-1.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold"
                      >
                        <option value="Pending">Payment Pending</option>
                        <option value="Partial">Partial Advance Paid</option>
                        <option value="Paid">Fully Paid</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 8: DOCUMENT UPLOAD */}
            {currentStep === 8 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-4 w-4 text-indigo-500" />
                    <span>8. Institutional Documents Verification Repository</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 08 / 09</span>
                </div>

                {/* 10 Document Card Dropzones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'studentPhoto', title: 'Student Passport Photo', req: true },
                    { key: 'birthCert', title: 'Birth Certificate', req: true },
                    { key: 'aadhaarCard', title: 'Aadhaar Card Copy', req: false },
                    { key: 'transferCert', title: 'Transfer Certificate (TC)', req: false },
                    { key: 'marksheet', title: 'Previous Marksheet', req: false },
                    { key: 'addressProof', title: 'Address Proof Copy', req: false },
                    { key: 'parentID', title: 'Parent Government ID', req: false },
                    { key: 'incomeCert', title: 'Income Certificate', req: false },
                    { key: 'casteCert', title: 'Caste Certificate', req: false },
                    { key: 'medicalCert', title: 'Medical Fitness Certificate', req: false },
                  ].map((doc) => {
                    const fileItem = documentsState[doc.key];
                    return (
                      <div
                        key={doc.key}
                        className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          fileItem?.name
                            ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-indigo-400'
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                            fileItem?.name ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                          }`}>
                            {fileItem?.name ? <FileCheck className="h-5 w-5" /> : <FileUp className="h-5 w-5" />}
                          </div>
                          <div className="truncate">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {doc.title} {doc.req && <span className="text-red-500">*</span>}
                            </span>
                            <span className="text-[10px] text-slate-400 block font-semibold truncate">
                              {fileItem?.name ? `✓ ${fileItem.name}` : 'PDF, JPG, PNG · Max 5MB'}
                            </span>
                          </div>
                        </div>

                        <label className="cursor-pointer px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[11px] font-extrabold text-slate-700 dark:text-slate-300 hover:bg-slate-100 shrink-0">
                          {fileItem?.name ? 'Replace' : 'Upload'}
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            className="hidden"
                            onChange={(e) => handleDocumentChange(doc.key, e)}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 9: REVIEW & SUBMIT */}
            {currentStep === 9 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>9. Comprehensive Review & Portal Provisioning</span>
                  </h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Section 09 / 09</span>
                </div>

                {/* Login Credentials Banner */}
                <div className="p-4 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl text-white space-y-2 border border-blue-700/50 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold flex items-center gap-1.5 uppercase tracking-wider text-blue-200">
                      <Key className="h-4 w-4 text-amber-400" /> Provisioned Portal Credentials
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                      Ready to Activate
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Username:</span>
                      <span className="font-mono font-extrabold text-white">{registerForm.admissionNo.toLowerCase()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Student Email:</span>
                      <span className="font-mono font-extrabold text-white">{registerForm.parentEmail || `${registerForm.admissionNo.toLowerCase()}@student.school`}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Default Password:</span>
                      <span className="font-mono font-extrabold text-amber-300">{registerForm.dob ? registerForm.dob.replace(/-/g, '') : 'student123'}</span>
                    </div>
                  </div>
                </div>

                {/* Summary Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  {/* Personal Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-school-blue" /> Personal Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(1)} className="text-[11px] font-extrabold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400">Full Name:</span> <strong className="text-slate-900 dark:text-white">{registerForm.name || 'N/A'}</strong></p>
                    <p><span className="text-slate-400">Gender & DOB:</span> {registerForm.gender} • {registerForm.dob} ({registerForm.bloodGroup})</p>
                    <p><span className="text-slate-400">Category & Aadhaar:</span> {registerForm.category} • {registerForm.aadhaarNo || 'N/A'}</p>
                  </div>

                  {/* Academic Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-school-blue" /> Academic Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(2)} className="text-[11px] font-extrabold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400">Class & Section:</span> <strong className="text-school-blue">{registerForm.grade} - {registerForm.section}</strong> ({registerForm.house} House)</p>
                    <p><span className="text-slate-400">Session & Type:</span> {registerForm.academicSession} • {registerForm.admissionType}</p>
                    <p><span className="text-slate-400">Prev School:</span> {registerForm.prevSchoolName || 'N/A'}</p>
                  </div>

                  {/* Parent Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-school-blue" /> Parents Summary
                      </span>
                      <button type="button" onClick={() => setCurrentStep(3)} className="text-[11px] font-extrabold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400">Father:</span> {registerForm.fatherName || 'N/A'} ({registerForm.fatherPhone || 'N/A'})</p>
                    <p><span className="text-slate-400">Mother:</span> {registerForm.motherName || 'N/A'}</p>
                    <p><span className="text-slate-400">Email:</span> {registerForm.fatherEmail || registerForm.motherEmail || 'N/A'}</p>
                  </div>

                  {/* Facilities & Fee Summary */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1.5">
                      <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5 text-emerald-600" /> Fees & Facilities
                      </span>
                      <button type="button" onClick={() => setCurrentStep(7)} className="text-[11px] font-extrabold text-school-blue hover:underline">Edit</button>
                    </div>
                    <p><span className="text-slate-400">Net Annual Fee:</span> <strong className="text-emerald-600 dark:text-emerald-400 text-sm">₹{registerForm.totalFees.toLocaleString()}</strong></p>
                    <p><span className="text-slate-400">Transport Required:</span> {registerForm.requiresTransport} ({registerForm.pickupPoint || 'N/A'})</p>
                    <p><span className="text-slate-400">Hostel Required:</span> {registerForm.requiresHostel} ({registerForm.hostelName || 'N/A'})</p>
                  </div>
                </div>

                {/* Additional Info / RFID & Library Cards */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">Other Institutional Identifiers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input
                      type="text"
                      placeholder="RFID Card Number (Optional)"
                      value={registerForm.rfidCardNo}
                      onChange={(e) => setRegisterForm({ ...registerForm, rfidCardNo: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Library Card Number (Optional)"
                      value={registerForm.libraryCardNo}
                      onChange={(e) => setRegisterForm({ ...registerForm, libraryCardNo: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Languages Known"
                      value={registerForm.languagesKnown}
                      onChange={(e) => setRegisterForm({ ...registerForm, languagesKnown: e.target.value })}
                      className="px-3 py-2 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Bar */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="ghost"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                leftIcon={<ChevronLeft className="h-4 w-4" />}
              >
                Previous Step
              </Button>

              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" onClick={() => setIsRegisterOpen(false)}>
                  Cancel
                </Button>
                {currentStep < 9 ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() => setCurrentStep(prev => Math.min(9, prev + 1))}
                    rightIcon={<ChevronRight className="h-4 w-4" />}
                  >
                    Next Step ({currentStep + 1}/9)
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="accent"
                    isLoading={createStudentMutation.isPending}
                    leftIcon={<CheckCircle2 className="h-4 w-4" />}
                  >
                    Submit Student Registration
                  </Button>
                )}
              </div>
            </div>

          </form>
        </div>
      </Modal>

      {/* Enquiry Form Modal */}
      <Modal isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} title="Record Admission Enquiry">
        <form onSubmit={handleEnquirySubmit} className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Name</label>
              <input
                type="text"
                required
                value={enquiryForm.parent_name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_name: e.target.value })}
                placeholder="Ramesh Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Student Name</label>
              <input
                type="text"
                required
                value={enquiryForm.student_name}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, student_name: e.target.value })}
                placeholder="Aarav Sharma"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Phone</label>
              <input
                type="tel"
                required
                value={enquiryForm.parent_phone}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_phone: e.target.value })}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Applying Grade</label>
              <select
                value={enquiryForm.applying_grade}
                onChange={(e) => setEnquiryForm({ ...enquiryForm, applying_grade: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
              >
                <option value="Grade 9">Grade 9</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Parent Email</label>
            <input
              type="email"
              required
              value={enquiryForm.parent_email}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, parent_email: e.target.value })}
              placeholder="parent@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Enquiry Notes</label>
            <textarea
              rows={3}
              value={enquiryForm.notes}
              onChange={(e) => setEnquiryForm({ ...enquiryForm, notes: e.target.value })}
              placeholder="Questions regarding fee concessions, transport routes, or hostel facilities..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setIsEnquiryOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={createEnquiryMutation.isPending}>
              Submit Enquiry
            </Button>
          </div>
        </form>
      </Modal>

      {/* Student Profile Overview Modal */}
      <Modal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} title="Student Institutional Profile">
        {selectedStudent && (
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="h-16 w-16 rounded-full bg-school-blue/10 flex items-center justify-center text-school-blue font-black text-xl">
                {selectedStudent.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{selectedStudent.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  Admission No: <span className="font-mono font-bold text-school-blue">{selectedStudent.admission_no}</span>
                </p>
                <p className="text-xs text-slate-500">
                  {selectedStudent.grade} • Section {selectedStudent.section} • Roll No: {selectedStudent.roll_no || 'N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Parent Name</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold">{selectedStudent.parentName}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Parent Phone</span>
                <span className="text-slate-900 dark:text-slate-200 font-bold">{selectedStudent.parentPhone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Date of Birth</span>
                <span>{selectedStudent.dob}</span>
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Blood Group</span>
                <span>{selectedStudent.bloodGroup}</span>
              </div>
            </div>

            <div className="text-xs font-semibold">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Residential Address</span>
              <span>{selectedStudent.address || 'Address not registered'}</span>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-150 dark:border-slate-800">
              <Button variant="outline" onClick={() => setIsProfileOpen(false)}>
                Close Profile
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* BEAUTIFUL SUCCESS CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(registrationSuccessData)}
        onClose={() => setRegistrationSuccessData(null)}
        title="Student Registration Successful"
        size="md"
      >
        {registrationSuccessData && (
          <div className="text-center space-y-6 py-2">
            {/* Animated Celebration Icon */}
            <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75" />
              <div className="relative h-20 w-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                <CheckCircle className="h-10 w-10" />
              </div>
            </div>

            {/* Header Title */}
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                Student Registered Successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                Student portfolio created and portal credentials provisioned.
              </p>
            </div>

            {/* Credential Details Card */}
            <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-3 shadow-inner">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                  <User className="h-4 w-4 text-school-blue" />
                  {registrationSuccessData.name}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950/40 text-school-blue border border-blue-200 dark:border-blue-900 font-mono">
                  {registrationSuccessData.admissionNo}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Class & Section</span>
                  <span className="font-extrabold text-slate-800 dark:text-slate-200">
                    {registrationSuccessData.grade} - Section {registrationSuccessData.section}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Account Role</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Student Account</span>
                </div>
              </div>

              {/* Login Credentials Subcard */}
              <div className="p-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-xl text-white space-y-2 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                    <Key className="h-3.5 w-3.5" /> Student Login Credentials
                  </span>
                  <span className="text-[9px] font-bold bg-white/10 px-2 py-0.5 rounded-full text-slate-300">Auto-Generated</span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-sans text-[11px]">Portal Email:</span>
                    <span className="font-extrabold text-white">{registrationSuccessData.email}</span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-slate-400 font-sans text-[11px]">Default Password:</span>
                    <span className="font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400/30">
                      {registrationSuccessData.password}
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
                onClick={() => setRegistrationSuccessData(null)}
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
