// hooks/useFirebaseAuthToken.ts

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase/clientApp'; // Assuming your firebase auth instance is here

// Define a key for localStorage
const FIREBASE_TOKEN_KEY = 'firebaseIdToken';
 
/**
 * Custom hook to listen for Firebase auth changes and manage the ID token.
 */
export const useFirebaseAuthToken = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Set up the Firebase Auth Listener
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        
        // 2. Retrieve the fresh ID token
        const token = await user.getIdToken();
        
        // 3. Store the token in localStorage for use by apiSlice
        localStorage.setItem(FIREBASE_TOKEN_KEY, token);

        console.log('✅ Firebase ID Token stored successfully.');
        // Optional: Refresh the token periodically (Firebase handles this somewhat, 
        // but manually refreshing helps keep API calls valid for long sessions)
        setupTokenRefresh(user);
      } else {
        // User logged out
        setCurrentUser(null);
        localStorage.removeItem(FIREBASE_TOKEN_KEY);
      }
      setLoading(false);
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  return { currentUser, loading };
};

/**
 * Sets up a timer to proactively refresh the token before it expires (usually 1 hour).
 */
const setupTokenRefresh = (user: User) => {
    // Firebase tokens expire after 1 hour (3600 seconds). 
    // We refresh them slightly before, e.g., every 50 minutes (3000 seconds).
    const refreshInterval = 3000 * 1000; // 50 minutes in milliseconds
    
    const refresher = setInterval(async () => {
        const token = await user.getIdToken(true); // 'true' forces a refresh
        localStorage.setItem(FIREBASE_TOKEN_KEY, token);
        console.log('🔄 Firebase ID Token refreshed.');
    }, refreshInterval);

    // Clear interval when the user logs out or leaves
    return () => clearInterval(refresher);
};