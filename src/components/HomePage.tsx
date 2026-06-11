'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Shield,
  ClipboardList,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lock,
  Sparkles,
  FileText,
  MapPin,
  GraduationCap,
  IndianRupee,
} from 'lucide-react';
import clsx from 'clsx';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/i18n/LanguageProvider';

export default function HomePage() {
  const { t } = useLanguage();
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: '01',
      title: t('home.howStep1Title'),
      desc: t('home.howStep1Desc'),
      icon: MapPin,
    },
    {
      num: '02',
      title: t('home.howStep2Title'),
      desc: t('home.howStep2Desc'),
      icon: IndianRupee,
    },
    {
      num: '03',
      title: t('home.howStep3Title'),
      desc: t('home.howStep3Desc'),
      icon: CheckCircle2,
    },
  ];

  const features = [
    {
      icon: ClipboardList,
      title: t('home.feature1Title'),
      desc: t('home.feature1Desc'),
    },
    {
      icon: Shield,
      title: t('home.feature2Title'),
      desc: t('home.feature2Desc'),
    },
    {
      icon: Users,
      title: t('home.feature3Title'),
      desc: t('home.feature3Desc'),
    },
  ];

  const checklist = [
    t('home.checklist1'),
    t('home.checklist2'),
    t('home.checklist3'),
    t('home.checklist4'),
    t('home.checklist5'),
    t('home.checklist6'),
  ];

  const trustBadges = [
    t('home.badgeFree'),
    t('home.badgeFiveMin'),
    t('home.badgeSecure'),
    t('home.badgeMobile'),
    t('home.badgeGuide'),
    t('home.badgeSkip'),
  ];

  const stats = [
    { label: t('home.statEasySteps'), value: '4', icon: FileText },
    { label: t('home.statAvgTime'), value: t('home.statAvgTimeValue'), icon: Clock },
    { label: t('home.statDataSafe'), value: '100%', icon: Lock },
  ];

  const heroTags = [t('home.tagNoLogin'), t('home.tagMobileFriendly'), t('home.tagSkipOptional')];

  const previewSteps = [
    t('home.stepContact'),
    t('home.stepParents'),
    t('home.stepOther'),
    t('home.stepReview'),
  ];

  useEffect(() => {
    const onScroll = () => setShowFloatingCta(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-saffron-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-sm shadow-md shrink-0">
              SS
            </div>
            <span className="font-semibold text-gray-800 hidden sm:inline">{t('nav.orgName')}</span>
            <span className="font-semibold text-gray-800 sm:hidden text-sm leading-tight max-w-[10rem]">
              {t('nav.orgName')}
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <LanguageSwitcher />
            <Link href="/register" className="btn-primary text-sm py-2 px-5 hidden sm:inline-flex">
              {t('nav.registerNow')}
            </Link>
          </div>
        </div>
      </nav>

      <header className="relative bg-gradient-to-br from-saffron-500 via-saffron-400 to-gold-500 text-white hero-pattern overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-white/10 blur-2xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-gold-400/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute top-1/3 right-[8%] hidden lg:block w-20 h-20 rounded-2xl bg-white/10 border border-white/20 rotate-12 animate-float pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Sparkles className="w-4 h-4" />
                {t('home.familyPortal')}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6">
                {t('home.heroTitle')}{' '}
                <span className="underline decoration-gold-400 decoration-4 underline-offset-4">
                  {t('home.heroTitleHighlight')}
                </span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">{t('home.heroDesc')}</p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-6 sm:mb-8">
                <Link
                  href="/register"
                  className="cta-pulse inline-flex items-center justify-center gap-2 bg-white text-saffron-700 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition relative z-10 min-h-[44px] w-full sm:w-auto"
                >
                  <Users className="w-5 h-5" />
                  {t('home.startRegistration')}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-medium px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl hover:bg-white/15 transition min-h-[44px] w-full sm:w-auto"
                >
                  {t('home.seeHowItWorks')}
                </a>
              </div>
              <div className="flex flex-wrap gap-3">
                {heroTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 text-sm bg-white/15 rounded-full px-3 py-1 border border-white/20"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="animate-fade-up-delay hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{t('home.previewTitle')}</p>
                    <p className="text-xs text-gray-500">{t('home.previewSubtitle')}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {previewSteps.map((s, i) => (
                    <div
                      key={s}
                      className={clsx(
                        'flex items-center gap-3 p-3 rounded-xl text-sm',
                        i === 0 ? 'bg-saffron-50 border border-saffron-200' : 'bg-gray-50'
                      )}
                    >
                      <span
                        className={clsx(
                          'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                          i === 0 ? 'bg-saffron-500 text-white' : 'bg-gray-200 text-gray-500'
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className={i === 0 ? 'font-medium text-saffron-800' : 'text-gray-600'}>
                        {s}
                      </span>
                      {i === 0 && (
                        <span className="ml-auto text-xs text-saffron-600 font-medium">
                          {t('home.startHere')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
                <Link href="/register" className="mt-5 w-full btn-primary py-3 text-base justify-center">
                  {t('home.openFormNow')}
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-8 sm:pb-12">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 text-center border border-white/25 hover:bg-white/20 transition"
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1 sm:mb-2 opacity-80" />
                <p className="text-lg sm:text-2xl md:text-3xl font-bold">{value}</p>
                <p className="text-[10px] sm:text-xs md:text-sm text-white/80 mt-0.5 sm:mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      <div className="bg-saffron-600 text-white py-3 overflow-hidden border-y border-saffron-700/30">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...trustBadges, ...trustBadges].map((badge, i) => (
            <span key={`${badge}-${i}`} className="mx-6 inline-flex items-center gap-2 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 text-gold-400" />
              {badge}
            </span>
          ))}
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{t('home.whatYouNeed')}</h2>
            <p className="text-gray-600 mb-6">{t('home.whatYouNeedDesc')}</p>
            <Link href="/register" className="btn-primary">
              {t('home.readyStart')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ul className="space-y-3">
            {checklist.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 p-4 bg-white rounded-xl border border-saffron-100 shadow-sm hover:shadow-md hover:border-saffron-200 transition"
              >
                <CheckCircle2 className="w-5 h-5 text-saffron-500 shrink-0 mt-0.5" />
                <span className="text-gray-700 text-sm">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="bg-saffron-50/60 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">{t('home.howItWorks')}</h2>
            <p className="text-gray-600 max-w-xl mx-auto">{t('home.howItWorksDesc')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map(({ num, title, desc, icon: Icon }, i) => (
              <button
                key={num}
                type="button"
                onMouseEnter={() => setActiveStep(i)}
                onFocus={() => setActiveStep(i)}
                onClick={() => setActiveStep(i)}
                className={clsx(
                  'text-left card transition-all duration-300 cursor-pointer',
                  activeStep === i
                    ? 'border-saffron-400 shadow-xl scale-[1.02] bg-white'
                    : 'hover:shadow-lg hover:border-saffron-200'
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl font-bold text-saffron-200">{num}</span>
                  <div
                    className={clsx(
                      'w-10 h-10 rounded-xl flex items-center justify-center transition',
                      activeStep === i ? 'bg-saffron-500 text-white' : 'bg-saffron-100 text-saffron-600'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </button>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/register" className="btn-primary text-base px-8 py-3">
              {t('home.beginStep1')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card flex gap-4 items-start hover:border-saffron-300 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-saffron-100 to-gold-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-saffron-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-r from-saffron-500 to-gold-500 py-14">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">{t('home.joinCommunity')}</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-2">{t('home.joinCommunityDesc')}</p>
          <p className="text-white/70 text-sm mb-8">{t('home.joinCommunityNote')}</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-saffron-700 font-semibold px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition text-lg"
          >
            {t('home.registerToday')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="card border-2 border-saffron-200 text-center py-12 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-50 via-transparent to-gold-50 pointer-events-none" />
          <div className="relative">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-saffron-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">{t('home.readyTitle')}</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">{t('home.readyDesc')}</p>
            <Link href="/register" className="btn-primary text-base px-10 py-3.5">
              {t('home.openRegistration')}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        {t('home.footer')}
      </footer>

      <div
        className={clsx(
          'fixed bottom-4 right-4 sm:bottom-6 sm:right-6 left-4 sm:left-auto z-50 transition-all duration-300',
          showFloatingCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        )}
      >
        <Link
          href="/register"
          className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white font-semibold px-5 sm:px-6 py-3.5 rounded-full shadow-2xl hover:scale-105 transition animate-shimmer w-full sm:w-auto min-h-[44px]"
          style={{
            backgroundImage: 'linear-gradient(90deg, #f97316, #ffd700, #f97316)',
          }}
        >
          <Users className="w-5 h-5" />
          {t('nav.registerNow')}
        </Link>
      </div>
    </div>
  );
}
