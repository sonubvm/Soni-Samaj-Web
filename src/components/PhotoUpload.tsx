'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import api from '@/lib/api';

interface PhotoUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  required?: boolean;
  error?: string;
}

const MAX_SIZE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

export default function PhotoUpload({ label, value, onChange, required, error }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const displayError = error || localError;

  const handleFile = async (file: File) => {
    setLocalError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError('Image must be 5 MB or smaller.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setUploading(true);

    try {
      const dataUri = await readFileAsDataUri(file);
      const res = await api.post<{ success: boolean; data: { url: string }; message?: string }>(
        '/api/upload',
        { image: dataUri }
      );

      if (!res.data.success || !res.data.data?.url) {
        throw new Error(res.data.message || 'Upload failed.');
      }

      onChange(res.data.data.url);
      setLocalError(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        'Failed to upload photo. Please try again.';
      setLocalError(message);
      setPreview(null);
      onChange('');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
    }
  };

  const clearPhoto = () => {
    onChange('');
    setPreview(null);
    setLocalError(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const photoSrc = preview || value;

  return (
    <div>
      <label className="label">
        {label}
        {required ? ' *' : ''}
      </label>

      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-start">
        <div
          className={`relative mx-auto sm:mx-0 w-28 h-28 sm:w-28 sm:h-28 rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 ${
            displayError ? 'border-red-300 bg-red-50/50' : 'border-saffron-200 bg-saffron-50/40'
          }`}
        >
          {photoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={photoSrc} alt={label} className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-8 h-8 text-saffron-400" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-saffron-600 animate-spin" />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2 w-full">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <button
              type="button"
              className="btn-secondary text-sm py-2.5 min-h-[44px] w-full sm:w-auto"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
            >
              {photoSrc ? 'Change Photo' : 'Upload Photo'}
            </button>
            {photoSrc && !uploading && (
              <button
                type="button"
                className="btn-secondary text-sm py-2.5 min-h-[44px] w-full sm:w-auto text-red-600"
                onClick={clearPhoto}
              >
                <X className="w-4 h-4" /> Remove
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">JPEG, PNG or WebP · max 5 MB</p>
          {displayError && <p className="text-xs text-red-600">{displayError}</p>}
        </div>
      </div>
    </div>
  );
}

function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}
