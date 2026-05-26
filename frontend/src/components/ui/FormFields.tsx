import React from 'react';

// Input Field
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: 'var(--space-md)' }}>
      <label htmlFor={inputId} className="form-label">
        {label}
      </label>
      <input id={inputId} className={`form-control ${error ? 'is-invalid' : ''}`} {...props} />
      {error && <span className="error-message">{error}</span>}
      <style>{localStyles}</style>
    </div>
  );
};

// Select Dropdown
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string | number; label: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({ label, options, error, className = '', id, ...props }) => {
  const selectId = id || `select-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <div className={`form-group ${className}`} style={{ marginBottom: 'var(--space-md)' }}>
      <label htmlFor={selectId} className="form-label">
        {label}
      </label>
      <select id={selectId} className={`form-control ${error ? 'is-invalid' : ''}`} {...props}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
      <style>{localStyles}</style>
    </div>
  );
};

// Toggle / Switch
interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ label, checked, onChange, className = '' }) => {
  return (
    <div className={`toggle-container ${className}`}>
      <span className="toggle-label">{label}</span>
      <button 
        type="button"
        className={`switch ${checked ? 'checked' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <span className="slider"></span>
      </button>
      <style>{toggleStyles}</style>
    </div>
  );
};

// File Upload UI
interface FileUploadProps {
  label: string;
  accept?: string;
  onChange: (file: File | null) => void;
  helperText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, accept, onChange, helperText }) => {
  const [fileName, setFileName] = React.useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      onChange(files[0]);
    } else {
      setFileName(null);
      onChange(null);
    }
  };

  return (
    <div className="file-upload-group">
      <label className="form-label">{label}</label>
      <div className="file-upload-zone">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '8px' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="17 8 12 3 7 8"></polyline>
          <line x1="12" y1="3" x2="12" y2="15"></line>
        </svg>
        <span className="upload-prompt">
          {fileName ? fileName : 'Click to upload files or drag and drop'}
        </span>
        {helperText && <span className="upload-helper">{helperText}</span>}
        <input 
          type="file" 
          accept={accept} 
          onChange={handleFileChange} 
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
        />
      </div>
      <style>{fileUploadStyles}</style>
    </div>
  );
};

// Style declarations
const localStyles = `
  .form-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--text-secondary);
    margin-bottom: 6px;
  }
  .form-control {
    width: 100%;
    padding: 0.65rem 0.8rem;
    font-size: 0.875rem;
    background-color: var(--bg-primary);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius-md);
    outline: none;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
  }
  .form-control:focus {
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }
  .is-invalid {
    border-color: var(--danger) !important;
  }
  .error-message {
    font-size: 0.75rem;
    color: var(--danger);
    margin-top: 4px;
    display: block;
  }
`;

const toggleStyles = `
  .toggle-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-sm) 0;
  }
  .toggle-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
    font-weight: 500;
  }
  .switch {
    width: 44px;
    height: 24px;
    border-radius: 12px;
    background-color: var(--border-color);
    border: none;
    position: relative;
    cursor: pointer;
    transition: background-color var(--transition-fast);
    padding: 0;
  }
  .switch.checked {
    background-color: var(--success);
  }
  .slider {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.15);
    transition: transform var(--transition-fast);
  }
  .switch.checked .slider {
    transform: translateX(20px);
  }
`;

const fileUploadStyles = `
  .file-upload-group {
    margin-bottom: var(--space-md);
  }
  .file-upload-zone {
    border: 2px dashed var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--space-lg) var(--space-md);
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgba(var(--accent-primary-rgb), 0.01);
    position: relative;
    cursor: pointer;
    transition: border-color var(--transition-fast), background-color var(--transition-fast);
  }
  .file-upload-zone:hover {
    border-color: var(--accent-primary);
    background-color: rgba(var(--accent-primary-rgb), 0.03);
  }
  .upload-prompt {
    font-size: 0.85rem;
    color: var(--text-secondary);
    font-weight: 600;
    margin-bottom: 2px;
  }
  .upload-helper {
    font-size: 0.75rem;
    color: var(--text-tertiary);
  }
`;
