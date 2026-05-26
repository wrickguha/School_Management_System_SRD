import React, { useState, useEffect } from 'react';
import { NoticeBoardItem } from '../../types';
import { adminService } from '../../services/adminService';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/FormFields';
import * as Icons from 'lucide-react';

export const NoticeBoard: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<NoticeBoardItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    adminService.getNotices().then(setNotices);
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newNotice = await adminService.postNotice({
      title,
      content,
      postedBy: user.name,
      targetRole: 'all',
    });

    setNotices([newNotice, ...notices]);
    setIsOpen(false);
    // Reset Form
    setTitle('');
    setContent('');
  };

  const canPost = user?.role === 'super_admin' || user?.role === 'school_admin' || user?.role === 'principal';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2>Public Notice Board</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Read bulletins, campus announcements, and administrative notes.</p>
        </div>

        {canPost && (
          <button className="btn btn-primary" onClick={() => setIsOpen(true)}>
            <Icons.Plus size={16} /> Broadcast Notice
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {notices.map((notice) => (
          <Card key={notice.id} variant="glass">
            <Card.Header style={{ borderBottom: 'none', paddingBottom: '0px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{notice.title}</h3>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>
                  Posted by: <strong>{notice.postedBy}</strong> on {notice.postedDate}
                </span>
              </div>
            </Card.Header>
            <Card.Body style={{ paddingTop: '10px' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                {notice.content}
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Broadcast Notice Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Broadcast New Campus Announcement"
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handlePost}>Post Notice</button>
          </>
        }
      >
        <form onSubmit={handlePost} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <Input label="Announcement Title" required value={title} onChange={e => setTitle(e.target.value)} />
          <div className="form-group">
            <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Content Body</label>
            <textarea 
              required 
              rows={4}
              value={content} 
              onChange={e => setContent(e.target.value)} 
              style={{
                width: '100%',
                padding: '0.65rem 0.8rem',
                fontSize: '0.875rem',
                backgroundColor: 'var(--bg-primary)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                borderRadius: 'var(--radius-md)',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
export default NoticeBoard;
