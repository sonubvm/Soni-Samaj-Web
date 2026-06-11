import RegistrationForm from '@/components/RegistrationForm';
import RegisterHeader from '@/components/RegisterHeader';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-saffron-50/40 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <RegisterHeader />
        <RegistrationForm />
      </div>
    </div>
  );
}
