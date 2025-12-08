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
    // You can replace this with a proper loading spinner component
    return (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2em' }}>
            Initializing App & Authentication...
        </div>
    );
  }

  // Once the authentication state is loaded, wrap the app in the Redux Provider.
  return <Provider store={store}>{children}</Provider>;
}