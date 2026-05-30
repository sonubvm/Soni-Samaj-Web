import type { Metadata } from 'next';
import './globals.css';
import ReduxProvider from '@/store/Provider';

export const metadata: Metadata = {
  title: 'Soni Samaj Uttarbhartiya Trust Surat - Family Registration',
  description: 'Soni Samaj Uttarbhartiya Trust Surat family details collection portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-gradient-to-br from-saffron-50 via-white to-gold-400/10 min-h-screen">
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
