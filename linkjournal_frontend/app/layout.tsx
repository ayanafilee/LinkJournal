import React from 'react';
import type { Metadata } from 'next';
import { ReduxProvider } from './Provider';
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export const metadata: Metadata = {
  title: 'LinkJournal',
  description: 'Your personal digital journal for links and insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className="min-h-screen flex flex-col w-full"
        suppressHydrationWarning={true}
      >
        <ErrorBoundary>
          <ReduxProvider>
            {/* This component now handles the logic of showing the header */}
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </ReduxProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}