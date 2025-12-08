// store/store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice'; // Will be created in Step 4

export const store = configureStore({
  reducer: {
    // Add the generated reducer from the API slice
    [apiSlice.reducerPath]: apiSlice.reducer,
    // Add other slices/reducers here if you have them (e.g., authSlice)
  },
  // Add the API middleware for caching, invalidation, etc.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

// Export types for RootState and AppDispatch for use in typed hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;