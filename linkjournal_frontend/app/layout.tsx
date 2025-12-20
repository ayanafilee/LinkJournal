import React from 'react';
import { ReduxProvider } from './Provider'; 
import './globals.css';
import ConditionalLayout from '@/components/ConditionalLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body 
        className="min-h-screen flex flex-col w-full" 
        suppressHydrationWarning={true}
      >
        <ReduxProvider>
          {/* This component now handles the logic of showing the header */}
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </ReduxProvider>
      </body>
    </html>
  );
}