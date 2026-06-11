'use client';

import { useRef, useState } from 'react';
import { Camera, ImageIcon, Loader2, X } from 'lucide-react';
import api from '@/lib/api';
import { useLanguage } from '@/i18n/LanguageProvider';
import { translateErrorMessage } from '@/lib/validateFamily';

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
  const { t } = useLanguage();
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const displayError = error ? translateErrorMessage(error, t) : localError;

  const handleFile = async (file: File) => {
    setLocalError(null);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setLocalError(t('photoUpload.invalidType'));
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setLocalError(t('photoUpload.tooLarge'));
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
        throw new Error(res.data.message || t('photoUpload.uploadFailed'));
      }

      onChange(res.data.data.url);
      setLocalError(null);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        (err as Error)?.message ||
        t('photoUpload.uploadFailed');
      setLocalError(message);
      setPreview(null);
      onChange('');
    } finally {
      setUploading(false);
      URL.revokeObjectURL(objectUrl);
      if (cameraInputRef.current) cameraInputRef.current.value = '';
      if (galleryInputRef.current) galleryInputRef.current.value = '';
    }
  };

  const clearPhoto = () => {
    onChange('');
    setPreview(null);
    setLocalError(null);
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (galleryInputRef.current) galleryInputRef.current.value = '';
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
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
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
              onClick={() => cameraInputRef.current?.click()}
            >
              <Camera className="w-4 h-4" />
              {photoSrc ? t('photoUpload.changePhoto') : t('photoUpload.takePhoto')}
            </button>
            <button
              type="button"
              className="btn-secondary text-sm py-2.5 min-h-[44px] w-full sm:w-auto"
              disabled={uploading}
              onClick={() => galleryInputRef.current?.click()}
            >
              <ImageIcon className="w-4 h-4" />
              {t('photoUpload.chooseGallery')}
            </button>
            {photoSrc && !uploading && (
              <button
                type="button"
                className="btn-secondary text-sm py-2.5 min-h-[44px] w-full sm:w-auto text-red-600"
                onClick={clearPhoto}
              >
                <X className="w-4 h-4" /> {t('photoUpload.remove')}
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400">{t('photoUpload.fileHint')}</p>
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
