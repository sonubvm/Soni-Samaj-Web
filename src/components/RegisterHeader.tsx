'use client';

import Link from 'next/link';
import { ArrowLeft, Clock, Shield, CheckCircle2 } from 'lucide-react';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function RegisterHeader() {
  const { t } = useLanguage();

  return (
    <>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-saffron-700 hover:text-saffron-800 text-sm font-medium min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> {t('register.backHome')}
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
        <h4 className="text-2xl sm:text-3xl font-bold text-gray-800">{t('register.title')}</h4>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">{t('register.subtitle')}</p>
        <div className="flex flex-wrap gap-4 mt-4">
          {[
            { icon: Clock, text: t('register.fiveMinutes') },
            { icon: Shield, text: t('register.secureSubmission') },
            { icon: CheckCircle2, text: t('register.noLogin') },
          ].map(({ icon: Icon, text }) => (
            <span
              key={text}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-saffron-700 bg-saffron-50 border border-saffron-200 rounded-full px-3 py-1"
            >
              <Icon className="w-3.5 h-3.5" />
              {text}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
