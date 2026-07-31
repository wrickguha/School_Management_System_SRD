import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Award, Download, Eye, Plus, Search, Filter, Trash2,
  Calendar, User, UploadCloud, ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { certificateService, studentService, type CertificateItem } from '../../services/services';
import { useAuth } from '../../store/AuthContext';
import { getImageUrl } from '../../services/apiClient';

const CERTIFICATE_TYPES = [
  'Academic Excellence',
  'Sports & Athletics',
  'Course Completion',
  'Extra-Curricular',
  'Character & Conduct',
  'Merit',
  'Other'
];

export default function CertificatesModule() {
  const { role } = useAuth();
  const queryClient = useQueryClient();

  const isStaffOrAdmin = ['Teacher', 'Faculty', 'Super Admin', 'School Admin', 'Principal'].includes(role || '');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState<CertificateItem | null>(null);

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    student_id: '',
    title: '',
    certificate_type: 'Academic Excellence',
    issue_date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Queries
  const { data: certificates, isLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: () => certificateService.getAll()
  });

  const { data: students } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll,
    enabled: isStaffOrAdmin
  });

  // Upload Mutation
  const uploadMutation = useMutation({
    mutationFn: certificateService.upload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      setIsUploadOpen(false);
      setUploadForm({
        student_id: '',
        title: '',
        certificate_type: 'Academic Excellence',
        issue_date: new Date().toISOString().split('T')[0],
        description: ''
      });
      setSelectedFile(null);
      alert('Certificate uploaded and issued successfully!');
    },
    onError: (err: any) => {
      alert('Failed to upload certificate: ' + (err.response?.data?.message || err.message));
    }
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: certificateService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be under 5MB.');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadForm.student_id) {
      alert('Please select a student.');
      return;
    }
    if (!selectedFile) {
      alert('Please select a certificate file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('student_id', uploadForm.student_id);
    formData.append('title', uploadForm.title);
    formData.append('certificate_type', uploadForm.certificate_type);
    formData.append('issue_date', uploadForm.issue_date);
    if (uploadForm.description) formData.append('description', uploadForm.description);
    formData.append('file', selectedFile);

    uploadMutation.mutate(formData);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to revoke/delete this certificate record?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filtered Certificates
  const filteredCertificates = (certificates || []).filter((cert) => {
    const matchesSearch =
      cert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.student?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cert.file_name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'All' || cert.certificate_type === selectedType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-school-blue/10 via-indigo-50/50 to-purple-50/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-school-blue/10 text-school-blue dark:bg-school-blue/20">
              <Award className="h-6 w-6" />
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Student Certificate Vault</h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium max-w-xl">
            {isStaffOrAdmin
              ? 'Issue, manage, and distribute verified certificates of achievement and completion to students.'
              : 'View, preview, and download your officially awarded certificates and merit recognitions.'}
          </p>
        </div>

        {isStaffOrAdmin && (
          <Button
            variant="primary"
            size="lg"
            onClick={() => setIsUploadOpen(true)}
            leftIcon={<Plus className="h-5 w-5" />}
            className="shadow-lg shadow-school-blue/25 hover:shadow-school-blue/40 relative z-10 shrink-0"
          >
            Upload Certificate
          </Button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 md:p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, student name, or file..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 dark:focus:ring-school-blue/50 focus:border-school-blue text-slate-900 dark:text-slate-100 transition-all"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden md:block" />
            <button
              onClick={() => setSelectedType('All')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedType === 'All'
                  ? 'bg-school-blue text-white shadow-sm shadow-school-blue/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Types
            </button>
            {CERTIFICATE_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedType === type
                    ? 'bg-school-blue text-white shadow-sm shadow-school-blue/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

        </div>
      </Card>

      {/* Certificate Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl" />
          ))}
        </div>
      ) : filteredCertificates.length === 0 ? (
        <Card className="p-12 text-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="mx-auto h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
            <Award className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-lg font-bold">No certificates found</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              {searchQuery || selectedType !== 'All'
                ? 'Try adjusting your search criteria or category filter.'
                : 'No certificates have been issued yet. Faculty members can upload certificates above.'}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((cert) => {
            const fileUrl = getImageUrl(cert.file_path);

            return (
              <Card
                key={cert.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-school-blue/40 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden group"
              >
                {/* Header Badge & Actions */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/40 text-school-blue border border-blue-100 dark:border-blue-900/50">
                      {cert.certificate_type}
                    </span>

                    {isStaffOrAdmin && (
                      <button
                        onClick={() => handleDelete(cert.id)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Certificate"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white line-clamp-2 group-hover:text-school-blue transition-colors">
                      {cert.title}
                    </h3>
                    {cert.description && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 font-medium">
                        {cert.description}
                      </p>
                    )}
                  </div>

                  {/* Recipient & Metadata Info */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    {cert.student && (
                      <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold">
                        <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">Recipient: {cert.student.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">({cert.student.grade}-{cert.student.section})</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>Issued: {cert.issue_date || cert.created_at.split('T')[0]}</span>
                    </div>

                    {cert.issued_by && (
                      <div className="flex items-center gap-2 text-slate-400 text-[11px] font-medium">
                        <ShieldCheck className="h-3.5 w-3.5 text-school-green shrink-0" />
                        <span>Issued by: {cert.issued_by.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-4 bg-slate-50/70 dark:bg-slate-950/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono font-bold text-slate-400 truncate max-w-[120px]">
                    {cert.file_size || 'Verified'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5 text-school-blue" />
                      <span>Preview</span>
                    </button>

                    <a
                      href={fileUrl}
                      download={cert.file_name || cert.title}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl bg-school-blue text-white text-xs font-bold hover:bg-school-blue/90 transition-colors flex items-center gap-1.5 shadow-sm shadow-school-blue/20"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal 1: Upload Certificate (Faculty / Admin) */}
      <Modal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} title="Issue Student Certificate">
        <form onSubmit={handleUploadSubmit} className="space-y-5 text-left">
          
          {/* Select Student */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Select Recipient Student <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={uploadForm.student_id}
              onChange={(e) => setUploadForm({ ...uploadForm, student_id: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100"
            >
              <option value="">-- Choose Student --</option>
              {(students || []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.grade}-{s.section} | Adm: {s.admissionNo || s.admission_no})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Certificate Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. 1st Position - Annual Science Exhibition 2026"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Type & Issue Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Category</label>
              <select
                value={uploadForm.certificate_type}
                onChange={(e) => setUploadForm({ ...uploadForm, certificate_type: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100"
              >
                {CERTIFICATE_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Issue Date</label>
              <input
                type="date"
                value={uploadForm.issue_date}
                onChange={(e) => setUploadForm({ ...uploadForm, issue_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Optional Notes / Remarks</label>
            <textarea
              rows={2}
              value={uploadForm.description}
              onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
              placeholder="Add additional details regarding this award or certificate..."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-school-blue/20 focus:border-school-blue text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* File Drag and Drop / Input */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">
              Upload Certificate File (PDF / Image) <span className="text-red-500">*</span>
            </label>
            <label className="border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-school-blue rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 dark:bg-slate-950/40 hover:bg-blue-50/30 transition-all">
              <UploadCloud className="h-8 w-8 text-school-blue mb-2" />
              {selectedFile ? (
                <div className="text-center">
                  <span className="text-sm font-extrabold text-school-blue block">{selectedFile.name}</span>
                  <span className="text-xs font-mono text-slate-400">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Click to browse or drag file here</span>
                  <span className="text-[10px] text-slate-400">Supports PDF, PNG, JPG, WEBP (Max 5MB)</span>
                </div>
              )}
              <input
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsUploadOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={uploadMutation.isPending}>
              Issue & Upload Certificate
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Preview Certificate */}
      {previewCert && (
        <Modal isOpen={!!previewCert} onClose={() => setPreviewCert(null)} title={previewCert.title}>
          <div className="space-y-4 text-left">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-xs font-extrabold uppercase text-school-blue block">{previewCert.certificate_type}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-white">Recipient: {previewCert.student?.name || 'Student'}</span>
              </div>
              <a
                href={getImageUrl(previewCert.file_path)}
                download={previewCert.file_name}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-school-blue text-white text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </a>
            </div>

            {/* Embedded File Preview */}
            <div className="w-full min-h-[400px] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              {/\.(jpg|jpeg|png|webp|gif)$/i.test(previewCert.file_name || previewCert.file_path) ? (
                <img
                  src={getImageUrl(previewCert.file_path)}
                  alt={previewCert.title}
                  className="max-h-[500px] w-auto object-contain mx-auto"
                />
              ) : (
                <iframe
                  src={getImageUrl(previewCert.file_path)}
                  title={previewCert.title}
                  className="w-full h-[500px] border-0"
                />
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button variant="outline" onClick={() => setPreviewCert(null)}>
                Close Preview
              </Button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
