'use client';

import { useLanguage } from '@/i18n/LanguageProvider';
import { Locale } from '@/i18n/translations';

const options: { value: Locale; label: string }[] = [
  { value: 'en', label: 'EN' },
  { value: 'hi', label: 'हिं' },
];

export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div
      className={`inline-flex rounded-xl border border-saffron-300 overflow-hidden text-xs font-semibold ${className}`}
      role="group"
      aria-label={t('language.switchLabel')}
    >
      {options.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => setLocale(value)}
          className={`px-3 py-2 min-h-[36px] min-w-[40px] transition ${
            locale === value
              ? 'bg-saffron-500 text-white'
              : 'bg-white text-saffron-700 hover:bg-saffron-50'
          }`}
          aria-pressed={locale === value}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
