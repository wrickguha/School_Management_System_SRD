import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface AdminProfileProps {
  currentImage?: string;
  userName: string;
  role: string;
  onImageUpload: (file: File) => Promise<void>;
}

export default function AdminProfile({ currentImage, userName, role, onImageUpload }: AdminProfileProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size should be less than 2MB');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    setUploadError('');
    try {
      await onImageUpload(file);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
      <h3 className="text-lg font-bold mb-4">Profile Picture</h3>
      
      <div className="flex items-start gap-6">
        {/* Current/Preview Image */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
            {previewImage ? (
              <img src={previewImage} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl text-slate-400">👤</span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-semibold">{userName}</p>
          <p className="text-xs text-slate-400">{role}</p>
        </div>

        {/* Upload Section */}
        <div className="flex-1">
          <label className="block">
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg p-6 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
              <div className="flex items-center justify-center gap-3">
                <Upload className="h-5 w-5 text-school-blue" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    Click to upload image
                  </p>
                  <p className="text-xs text-slate-500">PNG, JPG, GIF up to 2MB</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
              />
            </div>
          </label>

          {/* Status Messages */}
          {uploadSuccess && (
            <div className="mt-3 p-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg flex items-center gap-2 text-xs text-green-700 dark:text-green-400">
              <Check className="h-4 w-4" />
              Image uploaded successfully!
            </div>
          )}

          {uploadError && (
            <div className="mt-3 p-2 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg flex items-center gap-2 text-xs text-red-700 dark:text-red-400">
              <X className="h-4 w-4" />
              {uploadError}
            </div>
          )}

          {isUploading && (
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg text-xs text-blue-700 dark:text-blue-400">
              Uploading...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
