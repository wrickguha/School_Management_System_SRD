import React, { useState, useEffect } from 'react';
import { Exam, GradeBookEntry } from '../../types';
import { academicService } from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';
import { DataTable, Column } from '../../components/ui/DataTable';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const ExamsGrades: React.FC = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [selectedExam, setSelectedExam] = useState('ex-1');
  const [grades, setGrades] = useState<GradeBookEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishedMsg, setPublishedMsg] = useState(false);

  useEffect(() => {
    academicService.getExams().then(setExams);
  }, []);

  useEffect(() => {
    setLoading(true);
    academicService.getGradebook(selectedExam).then(data => {
      setGrades(data);
      setLoading(false);
    });
  }, [selectedExam]);

  const handleMarkChange = (studentId: string, marksObtained: number) => {
    setGrades(prev => prev.map(g => g.studentId === studentId ? { ...g, marksObtained } : g));
  };

  const handlePublish = async () => {
    setLoading(true);
    const updated = grades.map(g => ({ ...g, status: 'published' as const }));
    await academicService.publishGrades(selectedExam, updated);
    setGrades(updated);
    setLoading(false);
    setPublishedMsg(true);
    setTimeout(() => setPublishedMsg(false), 3000);
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal';

  const columns: Column<GradeBookEntry>[] = [
    { key: 'rollNo', title: 'Roll No', sortable: true },
    { key: 'studentName', title: 'Student Name', sortable: true },
    {
      key: 'marksObtained',
      title: 'Marks Obtained',
      sortable: true,
      render: (val, row) => {
        if (!isTeacher) return <strong>{val} / 100</strong>;
        return (
          <input 
            type="number"
            value={val}
            max="100"
            min="0"
            onChange={(e) => handleMarkChange(row.studentId, Number(e.target.value))}
            style={{
              padding: '4px 8px',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)',
              borderRadius: 'var(--radius-sm)',
              outline: 'none',
              width: '80px',
              fontWeight: 'bold'
            }}
          />
        );
      }
    },
    {
      key: 'grade',
      title: 'Equivalent Grade',
      render: (_, row) => {
        const marks = row.marksObtained;
        if (marks >= 90) return <Badge color="success">O (Outstanding)</Badge>;
        if (marks >= 80) return <Badge color="success">E (Exceeds Exp.)</Badge>;
        if (marks >= 65) return <Badge color="info">A (Acceptable)</Badge>;
        if (marks >= 50) return <Badge color="warning">P (Poor)</Badge>;
        return <Badge color="danger">D (Dreadful)</Badge>;
      }
    },
    { key: 'remarks', title: 'Remarks' },
    {
      key: 'status',
      title: 'Publication Status',
      sortable: true,
      render: (val) => (
        <Badge color={val === 'published' ? 'success' : 'secondary'}>
          {val}
        </Badge>
      )
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div>
          <h2>Exams Gradebook & Results Ledger</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review mock transcripts, register test outcomes, and publish scores.</p>
        </div>

        <div style={{ width: '250px' }}>
          <Select 
            label="Select Examination"
            value={selectedExam}
            onChange={e => setSelectedExam(e.target.value)}
            options={exams.map(ex => ({ value: ex.id, label: `${ex.name} - ${ex.subjectName}` }))}
          />
        </div>
      </div>

      {publishedMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <Icons.CheckCircle2 size={18} />
          <span>Exam grades published successfully in simulated database!</span>
        </div>
      )}

      <Card>
        <Card.Body style={{ padding: 0 }}>
          <DataTable 
            columns={columns}
            data={grades}
            searchKey="studentName"
            searchPlaceholder="Search student by name..."
          />
        </Card.Body>
        {isTeacher && (
          <Card.Footer>
            <button className="btn btn-primary" onClick={handlePublish} disabled={loading || grades.length === 0}>
              <Icons.Send size={16} /> Publish All Scores
            </button>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};
export default ExamsGrades;
