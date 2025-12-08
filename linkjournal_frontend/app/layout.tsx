// app/layout.tsx

import React from 'react';
import { ReduxProvider } from './Provider'; // Import the wrapper
import './globals.css'; // Add this line to import Tailwind CSS

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Wrap your entire application with the ReduxProvider */}
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}