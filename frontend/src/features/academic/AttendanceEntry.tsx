import React, { useState, useEffect } from 'react';
import { Attendance } from '../../types';
import { academicService } from '../../services/academicService';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Select, Input } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const AttendanceEntry: React.FC = () => {
  const [date, setDate] = useState('2026-05-27');
  const [classId, setClassId] = useState('cls-10');
  const [sectionId, setSectionId] = useState('sec-10a');
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    setLoading(true);
    academicService.getAttendance(date, classId, sectionId).then(data => {
      setAttendance(data);
      setLoading(false);
    });
  }, [date, classId, sectionId]);

  const handleStatusChange = (studentId: string, status: Attendance['status']) => {
    setAttendance(prev => prev.map(a => a.studentId === studentId ? { ...a, status } : a));
  };

  const handleRemarksChange = (studentId: string, remarks: string) => {
    setAttendance(prev => prev.map(a => a.studentId === studentId ? { ...a, remarks } : a));
  };

  const handleSave = async () => {
    setLoading(true);
    await academicService.markAttendance(attendance);
    setLoading(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <h2>Daily Attendance Entry Panel</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Log student attendance sheets by date and classroom section.</p>
      </div>

      {/* Filter Row */}
      <Card>
        <Card.Body style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', padding: 'var(--space-md)' }}>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Input label="Attendance Date" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Select 
              label="Select Grade"
              value={classId}
              onChange={e => setClassId(e.target.value)}
              options={[
                { value: 'cls-10', label: 'Grade 10' },
                { value: 'cls-9', label: 'Grade 9' }
              ]}
            />
          </div>
          <div style={{ flex: 1, minWidth: '150px' }}>
            <Select 
              label="Select Section"
              value={sectionId}
              onChange={e => setSectionId(e.target.value)}
              options={[
                { value: 'sec-10a', label: 'A' },
                { value: 'sec-10b', label: 'B' }
              ]}
            />
          </div>
        </Card.Body>
      </Card>

      {savedMessage && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <Icons.CheckCircle2 size={18} />
          <span>Attendance logs saved successfully in simulated database!</span>
        </div>
      )}

      {/* Marking Table */}
      <Card>
        <Card.Body style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="sms-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Student Name</th>
                  <th>Status Selector</th>
                  <th>Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>Loading attendance details...</td>
                  </tr>
                ) : attendance.length > 0 ? (
                  attendance.map((att) => (
                    <tr key={att.id}>
                      <td style={{ fontWeight: 'bold' }}>{att.rollNo}</td>
                      <td>{att.studentName}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button 
                            className={`btn ${att.status === 'present' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: att.status === 'present' ? 'var(--success)' : '' }}
                            onClick={() => handleStatusChange(att.studentId, 'present')}
                          >
                            Present
                          </button>
                          <button 
                            className={`btn ${att.status === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                            onClick={() => handleStatusChange(att.studentId, 'absent')}
                          >
                            Absent
                          </button>
                          <button 
                            className={`btn ${att.status === 'late' ? 'btn-primary' : 'btn-secondary'}`}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', backgroundColor: att.status === 'late' ? 'var(--warning)' : '', color: att.status === 'late' ? 'black' : '' }}
                            onClick={() => handleStatusChange(att.studentId, 'late')}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                      <td>
                        <input 
                          type="text" 
                          placeholder="Add comment..." 
                          value={att.remarks || ''} 
                          onChange={(e) => handleRemarksChange(att.studentId, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            border: '1px solid var(--border-color)',
                            backgroundColor: 'var(--bg-primary)',
                            color: 'var(--text-primary)',
                            borderRadius: 'var(--radius-sm)',
                            outline: 'none',
                            width: '80%'
                          }}
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: 'var(--space-xl)', color: 'var(--text-secondary)' }}>No students registered for this class section.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
        <Card.Footer>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading || attendance.length === 0}>
            <Icons.Save size={16} /> Save Attendance Ledger
          </button>
        </Card.Footer>
      </Card>
    </div>
  );
};
export default AttendanceEntry;
// CSS rules for inputs inside this file
