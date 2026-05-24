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

const steps = [
  {
    num: '01',
    title: 'Contact & Address',
    desc: 'Head of family name, mobile and full residential address.',
    icon: MapPin,
  },
  {
    num: '02',
    title: 'Parents & Income',
    desc: 'Father and mother details with occupation and family income.',
    icon: IndianRupee,
  },
  {
    num: '03',
    title: 'Submit & Done',
    desc: 'Add children or co-residents if needed, review and submit.',
    icon: CheckCircle2,
  },
];

const features = [
  {
    icon: ClipboardList,
    title: 'Simple 4-Step Form',
    desc: 'Only required fields are marked. Optional sections can be skipped.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data is stored safely and managed by community admins only.',
  },
  {
    icon: Users,
    title: 'Community Registry',
    desc: 'Help build a unified Soni Samaj family database across regions.',
  },
];

const checklist = [
  'Head of family name & mobile number',
  'Full address (city, district, state, pincode)',
  'Father & mother names (occupation optional)',
  'Children school details (optional)',
  'Co-resident info (optional)',
];

const trustBadges = [
  'Free Registration',
  '5 Minute Form',
  '100% Secure',
  'Mobile Friendly',
  'Step-by-Step Guide',
  'Skip Optional Fields',
];

const stats = [
  { label: 'Easy Steps', value: '4', icon: FileText },
  { label: 'Avg. Time', value: '5 min', icon: Clock },
  { label: 'Data Safe', value: '100%', icon: Lock },
];

export default function HomePage() {
  const [showFloatingCta, setShowFloatingCta] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const onScroll = () => setShowFloatingCta(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-saffron-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-saffron-500 to-gold-500 flex items-center justify-center text-white font-bold text-sm shadow-md">
              SS
            </div>
            <span className="font-semibold text-gray-800">Soni Samaj</span>
          </div>
          <Link href="/register" className="btn-primary text-sm py-2 px-5 hidden sm:inline-flex">
            Register Now
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-br from-saffron-500 via-saffron-400 to-gold-500 text-white hero-pattern overflow-hidden">
        <div className="absolute top-10 left-[10%] w-32 h-32 rounded-full bg-white/10 blur-2xl animate-float pointer-events-none" />
        <div className="absolute bottom-20 right-[15%] w-48 h-48 rounded-full bg-gold-400/20 blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute top-1/3 right-[8%] hidden lg:block w-20 h-20 rounded-2xl bg-white/10 border border-white/20 rotate-12 animate-float pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-up">
              <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Family Registration Portal
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Register Your Family in{' '}
                <span className="underline decoration-gold-400 decoration-4 underline-offset-4">
                  Minutes
                </span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-xl">
                Join the Soni Samaj community registry. Submit contact details, address, parents,
                children and income — quick, secure and completely free.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <Link
                  href="/register"
                  className="cta-pulse inline-flex items-center gap-2 bg-white text-saffron-700 font-semibold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.03] transition relative z-10"
                >
                  <Users className="w-5 h-5" />
                  Start Registration — It&apos;s Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center gap-2 border-2 border-white/50 text-white font-medium px-8 py-4 rounded-xl hover:bg-white/15 transition"
                >
                  See How It Works
                </a>
              </div>
              <div className="flex flex-wrap gap-3">
                {['No login needed', 'Mobile friendly', 'Skip optional fields'].map((tag) => (
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

            {/* Hero card preview */}
            <div className="animate-fade-up-delay hidden lg:block">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-800 rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-saffron-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-saffron-600" />
                  </div>
                  <div>
                    <p className="font-semibold">Registration Preview</p>
                    <p className="text-xs text-gray-500">4 simple steps</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['Contact & Address', 'Parents & Income', 'Other Members', 'Review & Submit'].map(
                    (s, i) => (
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
                          <span className="ml-auto text-xs text-saffron-600 font-medium">Start here →</span>
                        )}
                      </div>
                    )
                  )}
                </div>
                <Link
                  href="/register"
                  className="mt-5 w-full btn-primary py-3 text-base justify-center"
                >
                  Open Form Now
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="max-w-6xl mx-auto px-6 pb-12">
          <div className="grid grid-cols-3 gap-4 md:gap-6">
            {stats.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="bg-white/15 backdrop-blur rounded-2xl p-4 md:p-6 text-center border border-white/25 hover:bg-white/20 transition"
              >
                <Icon className="w-5 h-5 mx-auto mb-2 opacity-80" />
                <p className="text-2xl md:text-3xl font-bold">{value}</p>
                <p className="text-xs md:text-sm text-white/80 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* Marquee trust badges */}
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

      {/* What you'll need */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">What You&apos;ll Need</h2>
            <p className="text-gray-600 mb-6">
              Keep these details handy before you start. Only starred fields are mandatory — everything
              else is optional.
            </p>
            <Link href="/register" className="btn-primary">
              I&apos;m Ready — Start Form
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

      {/* How it works — interactive */}
      <section id="how-it-works" className="bg-saffron-50/60 py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">How It Works</h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              Hover or tap each step to see what you&apos;ll fill in.
            </p>
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
              Begin Step 1 Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
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

      {/* Social proof */}
      <section className="bg-gradient-to-r from-saffron-500 to-gold-500 py-14">
        <div className="max-w-6xl mx-auto px-6 text-center text-white">
          <GraduationCap className="w-10 h-10 mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Join the Community Registry</h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-2">
            Every registered family strengthens our community database — helping Soni Samaj stay
            connected with accurate family records across cities and districts.
          </p>
          <p className="text-white/70 text-sm mb-8">Your contribution takes less than 5 minutes.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 bg-white text-saffron-700 font-semibold px-10 py-4 rounded-xl shadow-xl hover:scale-105 transition text-lg"
          >
            Register My Family Today
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="card border-2 border-saffron-200 text-center py-12 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-saffron-50 via-transparent to-gold-50 pointer-events-none" />
          <div className="relative">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-saffron-500" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Click below to open the registration form. No account needed — just fill and submit.
            </p>
            <Link href="/register" className="btn-primary text-base px-10 py-3.5">
              Open Registration Form
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-500">
        © Soni Samaj Family Registration Portal
      </footer>

      {/* Floating CTA on scroll */}
      <div
        className={clsx(
          'fixed bottom-6 right-6 z-50 transition-all duration-300',
          showFloatingCta ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        )}
      >
        <Link
          href="/register"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-500 to-gold-500 text-white font-semibold px-6 py-3.5 rounded-full shadow-2xl hover:scale-105 transition animate-shimmer"
          style={{
            backgroundImage: 'linear-gradient(90deg, #f97316, #ffd700, #f97316)',
          }}
        >
          <Users className="w-5 h-5" />
          Register Now
        </Link>
      </div>
    </div>
  );
}
