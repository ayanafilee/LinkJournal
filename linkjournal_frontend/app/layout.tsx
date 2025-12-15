// app/layout.tsx
import React from 'react';
import { ReduxProvider } from './Provider'; // Assuming this file exists
import './globals.css';
import DynamicHeader from '@/components/DynamicHeader'; // Import the header component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <html lang="en">
      <head>
        {/* You may want to add metadata here */}
      </head>
      <body className="min-h-screen flex flex-col w-full">
        {/* Wrap your entire application with the ReduxProvider */}
        <ReduxProvider>
          
          {/* 1. Header Component */}
          <DynamicHeader 
          />
          {/* 2. Main Content Area */}
          <main  className="flex-1 w-full">
            {children}
          </main>
          
        </ReduxProvider>
      </body>
    </html>
  );
}