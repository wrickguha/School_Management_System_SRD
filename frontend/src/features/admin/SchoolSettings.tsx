import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Input, Select, Toggle } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const SchoolSettings: React.FC = () => {
  const [schoolName, setSchoolName] = useState('Hogwarts School of Witchcraft and Wizardry');
  const [address, setAddress] = useState('Highlands, Scotland');
  const [term, setTerm] = useState('Autumn Term 2026');
  const [enable3d, setEnable3d] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    // Persist system configurations in localStorage
    localStorage.setItem('sms_enable_3d', String(enable3d));
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div>
        <h2>School Administration Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Configure school profile metadata, ERP terms, and rendering preferences.</p>
      </div>

      {saved && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: 'var(--space-sm) var(--space-md)', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>
          <Icons.CheckCircle2 size={18} />
          <span>System configurations updated successfully!</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
        
        {/* Profile Card */}
        <Card>
          <Card.Header>
            <h3>Institution Profile</h3>
          </Card.Header>
          <Card.Body style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <Input label="School Name" value={schoolName} onChange={e => setSchoolName(e.target.value)} />
            <Input label="Physical Address" value={address} onChange={e => setAddress(e.target.value)} />
            <Select 
              label="Active Term Session"
              value={term}
              onChange={e => setTerm(e.target.value)}
              options={[
                { value: 'Autumn Term 2026', label: 'Autumn Term 2026' },
                { value: 'Winter Term 2026', label: 'Winter Term 2026' },
                { value: 'Spring Term 2027', label: 'Spring Term 2027' }
              ]}
            />
          </Card.Body>
          <Card.Footer>
            <button className="btn btn-primary" onClick={handleSave}>
              Save Profiles
            </button>
          </Card.Footer>
        </Card>

        {/* Technical rendering settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
          <Card>
            <Card.Header>
              <h3>ERP Core Preferences</h3>
            </Card.Header>
            <Card.Body>
              <Toggle 
                label="Render Spline 3D Graphics"
                checked={enable3d}
                onChange={(checked) => {
                  setEnable3d(checked);
                  localStorage.setItem('sms_enable_3d', String(checked));
                  alert(`WebGL rendering status set to: ${checked ? 'ENABLED' : 'DISABLED'}. Reload page to apply changes.`);
                }}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '8px', lineHeight: 1.4 }}>
                Disable this toggle to turn off background Spline 3D canvasses system-wide. This defaults all pages to static 2D vector fallback illustrations for legacy systems.
              </p>
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>
              <h3>Audit Trails Info</h3>
            </Card.Header>
            <Card.Body style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>Core Version:</strong> v1.0.0 (Pre-Laravel Node)</div>
              <div><strong>Database Sync Status:</strong> Mock SQLite simulated</div>
              <div><strong>Client Support:</strong> WebGL 2.0 Compliant</div>
            </Card.Body>
          </Card>
        </div>

      </div>
    </div>
  );
};
export default SchoolSettings;
