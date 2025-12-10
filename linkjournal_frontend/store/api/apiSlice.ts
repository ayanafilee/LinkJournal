// store/api/apiSlice.ts (FINAL CODE)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store'; 
import {
    Topic, LinkJournal, CreateTopicRequest, CreateJournalRequest, UpdateJournalRequest, ObjectId,
} from '@/types/index';

// 💡 The key must match the key used in useFirebaseAuthToken.ts
const FIREBASE_TOKEN_KEY = 'firebaseIdToken'; 

const getAuthToken = async (): Promise<string | undefined> => {
    // Ensure we're in the browser environment
    if (typeof window === 'undefined') {
        return undefined;
    }
    
    // Reads the token set by the useFirebaseAuthToken hook
    const token = localStorage.getItem(FIREBASE_TOKEN_KEY);
    
    // Return undefined if token is null or empty string
    return token && token.trim() !== '' ? token : undefined;
};


// 1. Define the baseQuery with Authentication setup
const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://linkjournal-3.onrender.com',
    
    prepareHeaders: async (headers, { getState }) => {
        const token = await getAuthToken();

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
            console.log('🔑 Token attached to request:', token.substring(0, 20) + '...');
        } else {
            console.warn('⚠️ No token found in localStorage');
        }

        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

// Wrap baseQuery with error logging and better error messages
const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
    try {
        const result = await baseQuery(args, api, extraOptions);
        
        // Log errors for debugging
        if (result.error) {
            if (result.error.status === 'FETCH_ERROR') {
                console.error('❌ Network/CORS Error:', {
                    message: 'Failed to fetch - Check CORS configuration on backend',
                    url: args?.url || 'unknown',
                    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://linkjournal-3.onrender.com/api',
                    error: result.error,
                });
                console.error('💡 Backend CORS must allow:');
                console.error('   - Origin: http://localhost:3000');
                console.error('   - Headers: Authorization, Content-Type');
                console.error('   - Methods: GET, POST, PUT, DELETE, OPTIONS');
            } else {
                console.error('❌ API Error:', {
                    status: result.error.status,
                    data: result.error.data,
                    error: result.error,
                });
            }
        }
        
        return result;
    } catch (error) {
        console.error('❌ Unexpected error in baseQuery:', error);
        return {
            error: {
                status: 'FETCH_ERROR',
                error: String(error),
            },
        };
    }
};

// 2. Define the main API slice
export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Topic', 'Journal'],
    endpoints: (builder) => ({

        // ================== TOPIC ENDPOINTS ==================
        getTopics: builder.query<Topic[], void>({
            query: () => 'api/topics',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Topic' as const, id })),
                        { type: 'Topic', id: 'LIST' },
                    ]
                    : [{ type: 'Topic', id: 'LIST' }],
        }),

        createTopic: builder.mutation<Topic, CreateTopicRequest>({
            query: (newTopic) => ({
                url: '/topics',
                method: 'POST',
                body: newTopic,
            }),
            invalidatesTags: [{ type: 'Topic', id: 'LIST' }],
        }),

        // ================== JOURNAL ENDPOINTS ==================
        getJournals: builder.query<LinkJournal[], void>({
            query: () => '/journals',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Journal' as const, id })),
                        { type: 'Journal', id: 'LIST' },
                    ]
                    : [{ type: 'Journal', id: 'LIST' }],
        }),

        getJournalById: builder.query<LinkJournal, ObjectId>({
            query: (id) => `/journal/${id}`,
            providesTags: (result, error, id) => [{ type: 'Journal', id }],
        }),

        createJournal: builder.mutation<LinkJournal, CreateJournalRequest>({
            query: (newJournal) => ({
                url: '/journals',
                method: 'POST',
                body: newJournal,
            }),
            invalidatesTags: [{ type: 'Journal', id: 'LIST' }],
        }),

        updateJournal: builder.mutation<
            { message: string },
            { id: ObjectId; updates: UpdateJournalRequest }
        >({
            query: ({ id, updates }) => ({
                url: `/journal/${id}`,
                method: 'PUT',
                body: updates,
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Journal', id },
                { type: 'Journal', id: 'LIST' },
            ],
        }),

        deleteJournal: builder.mutation<{ message: string }, ObjectId>({
            query: (id) => ({
                url: `/journal/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Journal', id: 'LIST' }],
        }),

        toggleImportant: builder.mutation<
            { message: string; isImportant: boolean },
            ObjectId
        >({
            query: (id) => ({
                url: `/journal/${id}/important`,
                method: 'PUT',
            }),
            // Optimistic update logic
            async onQueryStarted(id, { dispatch, queryFulfilled }) {
                const patchResult = dispatch(
                    apiSlice.util.updateQueryData('getJournals', undefined, (draft) => {
                        const journalToUpdate = draft.find((j) => j.id === id);
                        if (journalToUpdate) {
                            journalToUpdate.is_important = !journalToUpdate.is_important;
                        }
                    })
                );
                try {
                    await queryFulfilled;
                } catch {
                    patchResult.undo();
                }
                dispatch(apiSlice.util.invalidateTags([{ type: 'Journal', id }]));
            },
        }),
    }),
});

// 3. Export the auto-generated, typed hooks
export const {
    useGetTopicsQuery,
    useCreateTopicMutation,
    useGetJournalsQuery,
    useGetJournalByIdQuery,
    useCreateJournalMutation,
    useUpdateJournalMutation,
    useDeleteJournalMutation,
    useToggleImportantMutation,
} = apiSlice;