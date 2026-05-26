import React, { useState, useEffect } from 'react';
import { Homework } from '../../types';
import { academicService } from '../../services/academicService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input, Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const HomeworkLogs: React.FC = () => {
  const { user } = useAuth();
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('sb-1');
  const [dueDate, setDueDate] = useState('2026-06-05');

  useEffect(() => {
    academicService.getHomework().then(setHomeworkList);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newHw = await academicService.createHomework({
      classId: 'cls-10',
      sectionId: 'sec-10a',
      subjectId,
      subjectName: subjectId === 'sb-1' ? 'Potions' : subjectId === 'sb-2' ? 'Transfiguration' : 'Defence Against the Dark Arts',
      teacherId: user.id,
      title,
      description,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate
    });

    setHomeworkList([newHw, ...homeworkList]);
    setIsAddOpen(false);
    // Reset Form
    setTitle('');
    setDescription('');
  };

  const isTeacher = user?.role === 'teacher' || user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Academic Homework Logs</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Review assigned homework, submit essay files, and track due dates.</p>
        </div>

        {isTeacher && (
          <button className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
            <Icons.ClipboardList size={16} /> Assign Homework
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-md)' }}>
        {homeworkList.map((hw) => (
          <Card key={hw.id}>
            <Card.Header>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {hw.subjectName}
                </span>
                <h4 style={{ fontSize: '1rem', fontWeight: 750, marginTop: '2px' }}>{hw.title}</h4>
              </div>
              <Badge color="danger">Due: {hw.dueDate}</Badge>
            </Card.Header>
            <Card.Body>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 'var(--space-md)' }}>
                {hw.description}
              </p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                <span>Assigned: {hw.assignedDate}</span>
                <span>Submissions: {hw.submissionsCount ?? 0} class entries</span>
              </div>
            </Card.Body>
            <Card.Footer style={{ justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Class Grade 10-A
              </span>
              {user?.role === 'student' ? (
                <button className="btn btn-primary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  Submit Homework
                </button>
              ) : (
                <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '0.75rem' }}>
                  View Submissions
                </button>
              )}
            </Card.Footer>
          </Card>
        ))}
      </div>

      {/* Assign Homework Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Assign New Homework Coursework"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsAddOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleCreate}>Post Homework</button>
          </>
        }
      >
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Select 
            label="Target Subject"
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
            options={[
              { value: 'sb-1', label: 'Potions' },
              { value: 'sb-2', label: 'Transfiguration' },
              { value: 'sb-3', label: 'Defence Against the Dark Arts' }
            ]}
          />
          <Input label="Homework Title" required value={title} onChange={e => setTitle(e.target.value)} />
          <Input label="Due Date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          <Input label="Instructions / Description" required value={description} onChange={e => setDescription(e.target.value)} />
        </form>
      </Modal>
    </div>
  );
};
export default HomeworkLogs;
