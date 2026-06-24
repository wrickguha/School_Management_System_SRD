import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { DataTable } from '../../components/ui/DataTable';
import { Modal } from '../../components/ui/Modal';
import { Plus, CheckCircle, Database, LayoutGrid } from 'lucide-react';

interface SandboxModuleProps {
  moduleName: string;
}

export default function SandboxModule({ moduleName }: SandboxModuleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Generate dynamic mockup datasets based on module name
  const sandboxConfig = React.useMemo(() => {
    switch (moduleName) {
      case 'Admissions Management':
        return {
          stats: [
            { label: 'New Applicants', val: '142' },
            { label: 'Verified Documents', val: '118' },
            { label: 'Admitted Today', val: '14' }
          ],
          columns: [
            { header: 'Applicant ID', accessor: 'id' as any },
            { header: 'Student Name', accessor: 'name' as any },
            { header: 'Applied Grade', accessor: 'grade' as any },
            { header: 'Parent Email', accessor: 'email' as any },
            { header: 'Status', accessor: (r: any) => <span className="px-2.5 py-1 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-600 rounded-lg text-xs font-bold">{r.status}</span> }
          ],
          data: [
            { id: 'APP049', name: 'Kabir Dev', grade: 'Grade 9', email: 'dev.kabir@example.com', status: 'Pending Verification' },
            { id: 'APP050', name: 'Riya Sen', grade: 'Grade 10', email: 'sen.riya@example.com', status: 'Document Mismatch' },
            { id: 'APP051', name: 'Advik Roy', grade: 'Grade 11', email: 'roy.advik@example.com', status: 'Awaiting Payment' }
          ],
          formFields: ['Applicant Name', 'Applying Grade', 'Parent Contact', 'Previous School Transcript']
        };
      case 'Teachers Directory':
        return {
          stats: [
            { label: 'Active Teachers', val: '78' },
            { label: 'On Leave', val: '3' },
            { label: 'Science Dept', val: '16' }
          ],
          columns: [
            { header: 'Teacher ID', accessor: 'id' as any },
            { header: 'Teacher Name', accessor: 'name' as any },
            { header: 'Department', accessor: 'dept' as any },
            { header: 'Classes Allocated', accessor: 'classes' as any },
            { header: 'Attendance', accessor: (r: any) => <span className="text-school-green font-bold">{r.att}</span> }
          ],
          data: [
            { id: 'T202008', name: 'Dr. Sunita Rao', dept: 'Science', classes: 'Grade 10-A, Grade 9-A', att: '98.5%' },
            { id: 'T202102', name: 'Mr. Rajesh Verma', dept: 'Mathematics', classes: 'Grade 10-A, Grade 10-B', att: '96.2%' },
            { id: 'T202209', name: 'Mrs. Priya Sen', dept: 'English', classes: 'Grade 9-A, Grade 9-B', att: '99.0%' }
          ],
          formFields: ['Full Name', 'Department', 'Email Address', 'Salary Band']
        };
      case 'Teachers':
      case 'Parents Registry':
        return {
          stats: [
            { label: 'Registered Parents', val: '2,240' },
            { label: 'Active Logins', val: '1,950' },
            { label: 'Circular Receivers', val: '2,240' }
          ],
          columns: [
            { header: 'Parent ID', accessor: 'id' as any },
            { header: 'Parent Name', accessor: 'name' as any },
            { header: 'Ward Allocated', accessor: 'ward' as any },
            { header: 'Contact No', accessor: 'phone' as any },
            { header: 'Portal Sync', accessor: () => <span className="px-2 py-0.5 bg-school-greenLight dark:bg-school-green/10 text-school-green rounded-full text-[10px] font-bold uppercase">Online</span> }
          ],
          data: [
            { id: 'PAR892', name: 'Ramesh Sharma', ward: 'Aarav Sharma (Roll 01)', phone: '+91 98765 43210' },
            { id: 'PAR893', name: 'Srinivasan Iyer', ward: 'Ananya Iyer (Roll 02)', phone: '+91 98765 43211' },
            { id: 'PAR894', name: 'Alok Mehta', ward: 'Kabir Mehta (Roll 03)', phone: '+91 98765 43212' }
          ],
          formFields: ['Parent Name', 'Ward Registration No', 'Mobile Phone', 'Sync Email']
        };
      case 'Homework & Tasks':
        return {
          stats: [
            { label: 'Assigned Today', val: '8' },
            { label: 'Avg Submission Rate', val: '92.4%' },
            { label: 'Grading Pending', val: '14' }
          ],
          columns: [
            { header: 'Task ID', accessor: 'id' as any },
            { header: 'Subject / Topic', accessor: 'title' as any },
            { header: 'Grade Allocation', accessor: 'grade' as any },
            { header: 'Deadline Date', accessor: 'date' as any },
            { header: 'Status', accessor: (r: any) => <span className="px-2 py-0.5 bg-school-blueLight dark:bg-school-blue/10 text-school-blue rounded-full text-[10px] font-bold uppercase">{r.status}</span> }
          ],
          data: [
            { id: 'HWK049', title: 'Algebra Equations Practice', grade: 'Grade 10-A', date: 'June 08, 2026', status: 'Active' },
            { id: 'HWK050', title: 'Physics Kinematics Lab Report', grade: 'Grade 10-B', date: 'June 09, 2026', status: 'Draft' },
            { id: 'HWK051', title: 'English Essay Structure draft', grade: 'Grade 9-A', date: 'June 10, 2026', status: 'Active' }
          ],
          formFields: ['Subject Name', 'Task Instructions', 'Target Class', 'Submission Deadline']
        };
      case 'Transport Fleet':
        return {
          stats: [
            { label: 'Active Buses', val: '12' },
            { label: 'Total Routes Covered', val: '9' },
            { label: 'Fleet Status', val: 'All Clean' }
          ],
          columns: [
            { header: 'Bus Number', accessor: 'id' as any },
            { header: 'Route Allocation', accessor: 'route' as any },
            { header: 'Driver Name', accessor: 'driver' as any },
            { header: 'Driver Phone', accessor: 'phone' as any },
            { header: 'Fleet GPS', accessor: () => <span className="text-school-green font-bold flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-school-green animate-ping" /> Live Signal</span> }
          ],
          data: [
            { id: 'BUS-DL-402', route: 'Sector 62 Noida to School Campus', driver: 'Sukhdev Singh', phone: '+91 99887 76601' },
            { id: 'BUS-DL-419', route: 'Indirapuram Ghaziabad to Campus', driver: 'Karan Sharma', phone: '+91 99887 76602' },
            { id: 'BUS-DL-425', route: 'Dwarka Sector 10 to Campus', driver: 'Om Prakash', phone: '+91 99887 76603' }
          ],
          formFields: ['Bus Registration No', 'Route Route details', 'Driver Name', 'Driver Licensing Id']
        };
      case 'Library Catalog':
        return {
          stats: [
            { label: 'Total Volumes', val: '12,450' },
            { label: 'Issued Copies', val: '412' },
            { label: 'Overdue Books', val: '18' }
          ],
          columns: [
            { header: 'Accession No', accessor: 'id' as any },
            { header: 'Book Name', accessor: 'title' as any },
            { header: 'Author', accessor: 'author' as any },
            { header: 'Issued To', accessor: 'issued' as any },
            { header: 'Fine Accrued', accessor: (r: any) => <span className="text-red-500 font-bold">{r.fine}</span> }
          ],
          data: [
            { id: 'LIB-0941', title: 'Introduction to Algorithms', author: 'Cormen, Leiserson', issued: 'Aarav Sharma (G10)', fine: '₹0.00' },
            { id: 'LIB-0942', title: 'Concepts of Physics Vol 1', author: 'Dr. H.C. Verma', issued: 'Ananya Iyer (G10)', fine: '₹5.00' },
            { id: 'LIB-0943', title: 'High School English Grammar', author: 'Wren & Martin', issued: 'None (Available)', fine: '₹0.00' }
          ],
          formFields: ['Book Title', 'ISBN Code', 'Author Name', 'Rack Allocation Code']
        };
      case 'Hostel Rooms':
        return {
          stats: [
            { label: 'Hostel Capacity', val: '350 Beds' },
            { label: 'Occupied Beds', val: '284' },
            { label: 'Available Rooms', val: '22' }
          ],
          columns: [
            { header: 'Room No', accessor: 'id' as any },
            { header: 'Block Name', accessor: 'block' as any },
            { header: 'Room Type', accessor: 'type' as any },
            { header: 'Wards Allocated', accessor: 'wards' as any },
            { header: 'Vacancy Status', accessor: (r: any) => <span className="text-school-blue font-bold">{r.status}</span> }
          ],
          data: [
            { id: 'RM-102', block: 'Aryabhata Block-A', type: '4-Bed Sharing', wards: 'Aarav, Kabir, 2 Vacant', status: '2 Vacancies' },
            { id: 'RM-103', block: 'Aryabhata Block-A', type: '2-Bed Sharing', wards: 'Rohan, Sunil (Full)', status: 'No Vacancies' },
            { id: 'RM-204', block: 'Gargi Girls Hostel-B', type: '2-Bed Sharing', wards: 'Meera, 1 Vacant', status: '1 Vacancy' }
          ],
          formFields: ['Room Number', 'Hostel Block', 'Sharing Beds Count', 'Rent Charge per Term']
        };
      case 'HR & Payroll Ledger':
        return {
          stats: [
            { label: 'Registered Employees', val: '124' },
            { label: 'Salary Ledger Out', val: '₹84,500' },
            { label: 'Unpaid Slips', val: '0' }
          ],
          columns: [
            { header: 'Employee ID', accessor: 'id' as any },
            { header: 'Staff Name', accessor: 'name' as any },
            { header: 'Role/Title', accessor: 'role' as any },
            { header: 'Salary Grade', accessor: 'salary' as any },
            { header: 'Payout Status', accessor: () => <span className="px-2 py-0.5 bg-school-greenLight dark:bg-school-green/10 text-school-green rounded-full text-[10px] font-bold uppercase">Disbursed</span> }
          ],
          data: [
            { id: 'EMP001', name: 'Dr. Sunita Rao', role: 'Sr. Lecturer', salary: '₹65,000 /yr' },
            { id: 'EMP002', name: 'Mr. Rajesh Verma', role: 'Lecturer', salary: '₹58,000 /yr' },
            { id: 'EMP003', name: 'Mrs. Priya Sen', role: 'Lecturer', salary: '₹55,000 /yr' }
          ],
          formFields: ['Full Name', 'Role Title', 'Bank Account Number', 'Base Monthly Salary']
        };
      case 'Global Announcements & SMS':
        return {
          stats: [
            { label: 'SMS Sent Today', val: '482' },
            { label: 'Email Campaigns', val: '4' },
            { label: 'Active Broadcasts', val: '3' }
          ],
          columns: [
            { header: 'Alert ID', accessor: 'id' as any },
            { header: 'Topic Header', accessor: 'title' as any },
            { header: 'Message Preview', accessor: 'text' as any },
            { header: 'Target Audience', accessor: 'target' as any },
            { header: 'Dispatch Time', accessor: 'time' as any }
          ],
          data: [
            { id: 'ALR021', title: 'Summer Vacation notice', text: 'School closes for summer break starting June 20th...', target: 'Parents & Students', time: '1 day ago' },
            { id: 'ALR022', title: 'Monthly PTM allocations', text: 'PTM slots are allocated and available on Parent portal...', target: 'Parents', time: '2 days ago' },
            { id: 'ALR023', title: 'Syllabus Review Submission', text: 'All teachers must upload syllabus reviews by Friday...', target: 'Teachers', time: '3 days ago' }
          ],
          formFields: ['Broadcast Headline', 'Alert Content Details', 'Target Recipients', 'Enable Instant SMS dispatch']
        };
      default:
        return {
          stats: [{ label: 'General Records', val: '24' }],
          columns: [
            { header: 'Record ID', accessor: 'id' as any },
            { header: 'Description', accessor: 'desc' as any }
          ],
          data: [
            { id: 'REC001', desc: 'Mock entry 1' },
            { id: 'REC002', desc: 'Mock entry 2' }
          ],
          formFields: ['Record Details']
        };
    }
  }, [moduleName]);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* Module Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{moduleName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Enterprise database sandbox for {moduleName.toLowerCase()}.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setIsOpen(true)} leftIcon={<Plus className="h-4 w-4" />}>
          Add Sandbox Record
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sandboxConfig.stats.map((stat, idx) => (
          <Card key={idx} className="p-5 flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</span>
              <span className="block text-2xl font-extrabold text-slate-900 dark:text-white mt-2 leading-tight">
                {stat.val}
              </span>
            </div>
            <div className="h-10 w-10 rounded-xl bg-school-blue/10 flex items-center justify-center text-school-blue shrink-0">
              <Database className="h-5 w-5" />
            </div>
          </Card>
        ))}
      </div>

      {/* Main Database Table */}
      <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
        <CardHeader className="mb-4">
          <CardTitle className="flex items-center gap-2 text-md">
            <LayoutGrid className="h-5 w-5 text-school-blue" />
            <span>Sandbox Registry Logs</span>
          </CardTitle>
        </CardHeader>
        <DataTable
          columns={sandboxConfig.columns as any[]}
          data={sandboxConfig.data as any[]}
          searchKey="id"
          searchPlaceholder="Search by ID..."
        />
      </Card>

      {/* Sandbox Form Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Create new ${moduleName.slice(0, -3)} record`}>
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-14 w-14 bg-school-green/10 rounded-full flex items-center justify-center text-school-green mb-4">
              <CheckCircle className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">Record Saved!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Changes persisted successfully in the sandbox database.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <p className="text-xs text-slate-500">
              Complete the parameters below. The sandbox service client will dispatch this payload simulating standard CRUD procedures.
            </p>

            {sandboxConfig.formFields.map((field) => (
              <div key={field} className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{field}</label>
                <input
                  type="text"
                  required
                  placeholder={`Enter ${field.toLowerCase()}...`}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
                />
              </div>
            ))}

            <div className="pt-4 flex items-center justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Sandbox Record
              </Button>
            </div>
          </form>
        )}
      </Modal>

    </div>
  );
}
