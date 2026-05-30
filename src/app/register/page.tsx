import Link from 'next/link';
import { ArrowLeft, Clock, Shield, CheckCircle2 } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50/40 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-saffron-700 hover:text-saffron-800 text-sm font-medium min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="mt-4 sm:mt-6 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Family Registration</h1>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Fill in the required fields and submit. Optional sections can be skipped.
          </p>
          <div className="flex flex-wrap gap-4 mt-4">
            {[
              { icon: Clock, text: '~5 minutes' },
              { icon: Shield, text: 'Secure submission' },
              { icon: CheckCircle2, text: 'No login required' },
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

        <RegistrationForm />
      </div>
    </div>
  );
}