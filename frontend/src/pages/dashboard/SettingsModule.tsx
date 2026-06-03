import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ShieldAlert, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';

export default function SettingsModule() {
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [settingsForm, setSettingsForm] = useState({
    schoolName: 'St. Xavier Academy Noida',
    academicYear: '2026-2027',
    currentTerm: 'Term-I',
    notifyAbsent: true,
    notifyFees: true,
    rfidStatus: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      alert('[Demo Mode] System settings updated successfully!');
    }, 1200);
  };

  return (
    <div className="space-y-8 text-left">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">System Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Configure academic years, automated gateways, and institution parameters.
        </p>
      </div>

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
                  value={settingsForm.schoolName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, schoolName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Academic Session Year</label>
                  <input
                    type="text"
                    required
                    value={settingsForm.academicYear}
                    onChange={(e) => setSettingsForm({ ...settingsForm, academicYear: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-450 uppercase tracking-widest block">Current Operational Term</label>
                  <select
                    value={settingsForm.currentTerm}
                    onChange={(e) => setSettingsForm({ ...settingsForm, currentTerm: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none dark:text-white font-bold"
                  >
                    <option value="Term-I">Term-I Examination period</option>
                    <option value="Term-II">Term-II Mid-session</option>
                    <option value="Term-III">Term-III Final review</option>
                  </select>
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
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, notifyAbsent: !settingsForm.notifyAbsent })}
                    className="text-slate-500 hover:text-school-blue transition-colors"
                  >
                    {settingsForm.notifyAbsent ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold block">Automatic Late Fee Invoicing</span>
                    <span className="text-[10px] text-slate-400">Trigger invoice adjustments on due date expiry</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, notifyFees: !settingsForm.notifyFees })}
                    className="text-slate-500 hover:text-school-blue transition-colors"
                  >
                    {settingsForm.notifyFees ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="flex items-center justify-between p-3 border border-slate-150 dark:border-slate-800 rounded-xl">
                  <div>
                    <span className="text-xs font-bold block">RFID Gate Signal receiver</span>
                    <span className="text-[10px] text-slate-400">Sync database with smart gates active controllers</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSettingsForm({ ...settingsForm, rfidStatus: !settingsForm.rfidStatus })}
                    className="text-slate-500 hover:text-school-blue transition-colors"
                  >
                    {settingsForm.rfidStatus ? <ToggleRight className="h-9 w-9 text-school-blue" /> : <ToggleLeft className="h-9 w-9" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-slate-150 dark:border-slate-800 flex items-center justify-end gap-3">
              <Button type="submit" variant="primary" isLoading={saveSuccess}>
                Save System Config
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
