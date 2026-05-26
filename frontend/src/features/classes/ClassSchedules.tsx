import React, { useState, useEffect } from 'react';
import { TimetableSlot } from '../../types';
import { academicService } from '../../services/academicService';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const ClassSchedules: React.FC = () => {
  const [timetable, setTimetable] = useState<TimetableSlot[]>([]);
  const [selectedClass, setSelectedClass] = useState('cls-10');

  useEffect(() => {
    academicService.getTimetable().then(setTimetable);
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const filteredSlots = timetable.filter(slot => slot.classId === selectedClass);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-sm)' }}>
        <div>
          <h2>Class Timetables & Course Schedules</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Check weekly lecture allocations, subject rooms, and instructors.</p>
        </div>
        
        <div style={{ width: '200px' }}>
          <Select 
            label="Filter Classroom"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
              { value: 'cls-10', label: 'Grade 10 - A/B' },
              { value: 'cls-9', label: 'Grade 9 - A/B' }
            ]}
          />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
        {days.map((dayName, dayIndex) => {
          const daySlots = filteredSlots.filter(s => s.dayOfWeek === dayIndex + 1);
          return (
            <Card key={dayIndex}>
              <Card.Header style={{ backgroundColor: 'rgba(var(--accent-primary-rgb), 0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icons.CalendarDays size={18} color="var(--accent-primary)" />
                  <strong style={{ fontSize: '1rem' }}>{dayName}</strong>
                </div>
              </Card.Header>
              <Card.Body style={{ padding: 'var(--space-md)' }}>
                {daySlots.length > 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                    {daySlots.map((slot) => (
                      <div 
                        key={slot.id}
                        style={{
                          padding: '12px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{slot.subjectName}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Instructor: {slot.teacherName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                            Room: {slot.roomNo}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right', fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>No magical lectures scheduled.</p>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
export default ClassSchedules;
