// app/Provider.tsx (FINAL CODE)

'use client'; // Required for Next.js App Router

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store'; 
import { useFirebaseAuthToken } from '@/hooks/useFirebaseAuthToken'; // <-- NEW IMPORT

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  
  // 💡 Run the Firebase Auth Listener hook here!
  const { loading } = useFirebaseAuthToken(); 

  // Wait for Firebase to initialize and check for the user/token state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  // Once the authentication state is loaded, wrap the app in the Redux Provider.
  return <Provider store={store}>{children}</Provider>;
}