import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Sliders, ToggleLeft, ToggleRight, AlertCircle, Check } from 'lucide-react';

interface SchoolSettings {
  school: {
    id: number;
    name: string;
    subdomain: string;
    address: string;
    phone: string;
    email: string;
    logo_path: string;
    plan: string;
    status: string;
  };
  settings: {
    academic_year: string;
    current_term: string;
    notify_absent: boolean;
    notify_fees: boolean;
    rfid_status: boolean;
  };
  stats: {
    total_students: number;
    total_teachers: number;
    total_staff: number;
  };
}

export default function SettingsModule() {
  const queryClient = useQueryClient();
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settingsForm, setSettingsForm] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch settings
  const { data: settingsData, isLoading, error } = useQuery<SchoolSettings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await fetch('/api/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update settings');
      return response.json();
    },
    onSuccess: () => {
      setSaveSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      setTimeout(() => setSaveSuccess(false), 3000);
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (settingsData) {
      setSettingsForm({
        school_name: settingsData.school.name,
        address: settingsData.school.address,
        phone: settingsData.school.phone,
        email: settingsData.school.email,
        academic_year: settingsData.settings.academic_year,
        current_term: settingsData.settings.current_term,
        notify_absent: settingsData.settings.notify_absent,
        notify_fees: settingsData.settings.notify_fees,
        rfid_status: settingsData.settings.rfid_status,
      });
    }
  }, [settingsData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(settingsForm);
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading settings...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg text-red-700 dark:text-red-400 flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        Failed to load settings. Please try again later.
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Configure academic years, automated gateways, and institution parameters for {settingsData?.school.name}.
        </p>
      </div>

      {/* School Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-school-blue">{settingsData?.stats.total_students}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Students</p>
          </div>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-school-maroon">{settingsData?.stats.total_teachers}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Total Teachers</p>
          </div>
        </Card>
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-school-green">{settingsData?.stats.total_staff}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Staff Members</p>
          </div>
        </Card>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-xl text-xs text-green-700 dark:text-green-400 flex items-center gap-2">
          <Check className="h-4 w-4" />
          Settings updated successfully!
        </div>
      )}

      <div className="max-w-3xl">
        <Card className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Institution Config */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-school-blue uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                <span>Institution parameters</span>
              </h3>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Institution Official Name</label>
                <input
                  type="text"
                  required
                  value={settingsForm.school_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, school_name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Address</label>
                <input
                  type="text"
                  value={settingsForm.address || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  disabled={!isEditing}
                  placeholder="School address"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Phone</label>
                  <input
                    type="text"
                    value={settingsForm.phone || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Contact number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Email</label>
                  <input
                    type="email"
                    value={settingsForm.email || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Contact email"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Academic Session Year</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.academic_year || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, academic_year: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., 2025-2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Current Operational Term</label>
                  <input
                    type="text"
                    value={settingsForm.current_term || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, current_term: e.target.value })}
                    disabled={!isEditing}
                    placeholder="e.g., Term-I"
                    list="term-list"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold disabled:opacity-60"
                  />
                  <datalist id="term-list">
                    <option value="Term-I" />
                    <option value="Term-II" />
                    <option value="Term-III" />
                  </datalist>
                </div>
              </div>
            </div>

            {/* Gateway Toggles */}
            <div className="space-y-4 pt-4">
              <h3 className="text-sm font-bold text-school-maroon uppercase tracking-wider border-b border-slate-100 dark:border-slate-850 pb-2 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4" />
                <span>Automated Alert triggers</span>
              </h3>
              
              <div className="space-y-3.5">
                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold block">Absent student Parent notifications</span>
                    <span className="text-[10px] text-slate-400">Dispatch instant SMS warnings on RFID check-in failures</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, notify_absent: !settingsForm.notify_absent })}
                      className="text-slate-500 hover:text-school-blue transition-colors"
                    >
                      {settingsForm.notify_absent ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                    </button>
                  )}
                  {!isEditing && (
                    <span className="text-xs font-bold">{settingsForm.notify_absent ? '✓ Enabled' : '✗ Disabled'}</span>
                  )}
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold block">Automatic Late Fee Invoicing</span>
                    <span className="text-[10px] text-slate-400">Trigger invoice adjustments on due date expiry</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, notify_fees: !settingsForm.notify_fees })}
                      className="text-slate-500 hover:text-school-blue transition-colors"
                    >
                      {settingsForm.notify_fees ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                    </button>
                  )}
                  {!isEditing && (
                    <span className="text-xs font-bold">{settingsForm.notify_fees ? '✓ Enabled' : '✗ Disabled'}</span>
                  )}
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold block">RFID Gate Signal receiver</span>
                    <span className="text-[10px] text-slate-400">Sync database with smart gates active controllers</span>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setSettingsForm({ ...settingsForm, rfid_status: !settingsForm.rfid_status })}
                      className="text-slate-500 hover:text-school-blue transition-colors"
                    >
                      {settingsForm.rfid_status ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                    </button>
                  )}
                  {!isEditing && (
                    <span className="text-xs font-bold">{settingsForm.rfid_status ? '✓ Enabled' : '✗ Disabled'}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-end gap-3">
              {!isEditing ? (
                <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Settings
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      if (settingsData) {
                        setSettingsForm({
                          school_name: settingsData.school.name,
                          address: settingsData.school.address,
                          phone: settingsData.school.phone,
                          email: settingsData.school.email,
                          academic_year: settingsData.settings.academic_year,
                          current_term: settingsData.settings.current_term,
                          notify_absent: settingsData.settings.notify_absent,
                          notify_fees: settingsData.settings.notify_fees,
                          rfid_status: settingsData.settings.rfid_status,
                        });
                      }
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" isLoading={updateMutation.isPending}>
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}

