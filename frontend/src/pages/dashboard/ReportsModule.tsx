import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Download, RefreshCw } from 'lucide-react';

export default function ReportsModule() {
  const [reportType, setReportType] = useState('academic');
  const [selectedGrade, setSelectedGrade] = useState('Grade 10');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      setIsGenerating(false);
      const newReport = {
        id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
        title: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Audit report - ${selectedGrade}`,
        date: new Date().toLocaleDateString(),
        size: '1.4 MB',
        type: reportType === 'financial' ? 'XLSX' : 'PDF'
      };
      setGeneratedReports([newReport, ...generatedReports]);
    }, 1200);
  };

  const defaultReports = [
    { id: 'REP-4019', title: 'Student Attendance Consolidation - Term I', date: 'June 01, 2026', size: '2.4 MB', type: 'PDF' },
    { id: 'REP-4025', title: 'Monthly Revenue Cashflow Ledger - May 2026', date: 'May 31, 2026', size: '840 KB', type: 'XLSX' },
    { id: 'REP-4028', title: 'Syllabus Coverage milestones review - Grade 9 & 10', date: 'May 24, 2026', size: '1.1 MB', type: 'PDF' }
  ];

  const allReports = [...generatedReports, ...defaultReports];

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Audit Reports</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Generate, review, and export academic and financial datasets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Custom Generator Form */}
        <Card className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 h-fit">
          <CardHeader className="mb-4">
            <CardTitle>Report Generator Panel</CardTitle>
          </CardHeader>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Audit Subject Category</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
              >
                <option value="academic">Academic Marks & Grading Summary</option>
                <option value="financial">Fee Invoicing & Revenue Ledger</option>
                <option value="attendance">Student Attendance Logs</option>
                <option value="hr">Teacher Payroll & Staff slips</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Target Cohort/Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
              >
                <option value="All Grades">All Cohorts consolidated</option>
                <option value="Grade 9">Grade 9 Cohort</option>
                <option value="Grade 10">Grade 10 Cohort</option>
                <option value="Grade 11">Grade 11 Cohort</option>
                <option value="Grade 12">Grade 12 Cohort</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isGenerating} leftIcon={<RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />}>
              Compile Report
            </Button>
          </form>
        </Card>

        {/* Available Reports list */}
        <Card className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <CardHeader className="mb-4">
            <CardTitle>Report Downloads Vault</CardTitle>
          </CardHeader>
          
          <div className="space-y-4">
            {allReports.map((rep) => (
              <div key={rep.id} className="p-4 border border-slate-150 dark:border-slate-800 rounded-2xl flex items-center justify-between hover:bg-slate-50/40 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-school-blueLight dark:bg-school-blue/15 text-school-blue rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block leading-tight">{rep.title}</span>
                    <span className="text-[10px] text-slate-400 font-semibold block mt-1">Compiled {rep.date} • {rep.size}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold tracking-wider ${
                    rep.type === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-school-greenLight text-school-green'
                  }`}>
                    {rep.type}
                  </span>
                  <button
                    onClick={() => alert(`[Demo Mode] Downloading ${rep.id} (${rep.type})`)}
                    className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>
    </div>
  );
}
