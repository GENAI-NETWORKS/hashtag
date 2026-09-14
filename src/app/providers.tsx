'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.875rem',
            fontWeight: 500,
            borderRadius: '12px',
            padding: '12px 16px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          },
          success: {
            iconTheme: { primary: '#00AEEF', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#EC008C', secondary: '#fff' },
          },
        }}
      />
    </QueryClientProvider>
  );
}
