'use client';

import { Provider } from 'react-redux';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { store } from './store';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LanguageProvider>{children}</LanguageProvider>
    </Provider>
  );
}
