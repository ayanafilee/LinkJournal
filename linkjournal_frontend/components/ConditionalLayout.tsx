"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import DynamicHeader from './DynamicHeader';

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Define which paths should NOT have the header/standard layout
  // This covers /auth/login, /auth/signup, etc.
  const isAuthRoute = pathname?.startsWith('/auth');

  if (isAuthRoute) {
    // Return just the children for login/signup pages
    return <>{children}</>;
  }

  // Return the full layout with Header for everything else
  return (
    <>
      <DynamicHeader />
      <main className="flex-1 w-full">
        {children}
      </main>
    </>
  );
}