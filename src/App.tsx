import React, { lazy, Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { Routes } from './Routes';
import { useTheme } from './hooks/useTheme';
import { Loader } from 'lucide-react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'sonner';

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Loader className="w-8 h-8 animate-spin text-accent-600" />
  </div>
);

export default function App() {
  const { isDark } = useTheme();

  React.useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes />
            <Toaster position="top-right" />
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}