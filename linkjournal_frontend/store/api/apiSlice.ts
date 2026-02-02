// store/api/apiSlice.ts (UPDATED)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import {
    Topic, LinkJournal, User, CreateTopicRequest, CreateJournalRequest, UpdateJournalRequest, ObjectId,
} from '@/types/index';

const FIREBASE_TOKEN_KEY = 'firebaseIdToken';

const getAuthToken = async (): Promise<string | undefined> => {
    if (typeof window === 'undefined') return undefined;
    const token = localStorage.getItem(FIREBASE_TOKEN_KEY);
    return token && token.trim() !== '' ? token : undefined;
};

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || '',
    prepareHeaders: async (headers) => {
        const token = await getAuthToken();
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    },
});

const baseQueryWithErrorHandling = async (args: any, api: any, extraOptions: any) => {
    try {
        const result = await baseQuery(args, api, extraOptions);

        if (result.error) {
            const status = result.error.status;
            const method = typeof args === 'string' ? 'GET' : args.method || 'GET';
            const url = typeof args === 'string' ? args : args.url;

            // Handle specific status codes to reduce console noise
            if (status === 404) {
                console.warn(`ℹ️ 404 Not Found: [${method}] ${url}`);
            } else if (status === 409) {
                // 409 Conflict is normal during signup-as-login flows
                console.info(`ℹ️ 409 Conflict (User/Resource already exists): [${method}] ${url}`);
            } else if (status === 401) {
                console.warn(`🔒 401 Unauthorized: [${method}] ${url}. Check if token is valid.`);
            } else {
                console.error(`❌ API Error (${status}): [${method}] ${url}`, result.error);
            }
        }

        return result;
    } catch (error) {
        return { error: { status: 'FETCH_ERROR', error: String(error) } };
    }
};

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['Topic', 'Journal', 'User'],
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

        // 1. Get Topic Name by ID
        getTopicById: builder.query<{ name: string }, ObjectId>({
            query: (id) => `api/topics/${id}`,
            providesTags: (result, error, id) => [{ type: 'Topic', id }],
        }),

        createTopic: builder.mutation<Topic, CreateTopicRequest>({
            query: (newTopic) => ({
                url: 'api/topics',
                method: 'POST',
                body: newTopic,
            }),
            invalidatesTags: [{ type: 'Topic', id: 'LIST' }],
        }),

        // 2. Edit Topic
        updateTopic: builder.mutation<
            { message: string },
            { id: ObjectId; name: string }
        >({
            query: ({ id, name }) => ({
                url: `api/topics/${id}`,
                method: 'PUT',
                body: { name },
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: 'Topic', id },
                { type: 'Topic', id: 'LIST' },
            ],
        }),

        // 3. Delete Topic
        deleteTopic: builder.mutation<{ message: string }, ObjectId>({
            query: (id) => ({
                url: `api/topics/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Topic', id: 'LIST' }],
        }),

        getJournalsByTopic: builder.query<LinkJournal[], ObjectId>({
            query: (topicId) => `api/topics/${topicId}/journals`,
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Journal' as const, id })),
                        { type: 'Journal', id: 'TOPIC_LIST' },
                    ]
                    : [{ type: 'Journal', id: 'TOPIC_LIST' }],
        }),

        // ================== JOURNAL ENDPOINTS ==================
        getJournals: builder.query<LinkJournal[], void>({
            query: () => 'api/journals',
            providesTags: (result) =>
                result
                    ? [
                        ...result.map(({ id }) => ({ type: 'Journal' as const, id })),
                        { type: 'Journal', id: 'LIST' },
                    ]
                    : [{ type: 'Journal', id: 'LIST' }],
        }),

        getJournalById: builder.query<LinkJournal, ObjectId>({
            query: (id) => `api/journal/${id}`,
            providesTags: (result, error, id) => [{ type: 'Journal', id }],
        }),

        createJournal: builder.mutation<LinkJournal, CreateJournalRequest>({
            query: (newJournal) => ({
                url: 'api/journals',
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
                url: `api/journal/${id}`,
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
                url: `api/journal/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Journal', id: 'LIST' }],
        }),

        toggleImportant: builder.mutation<
            { message: string; isImportant: boolean },
            ObjectId
        >({
            query: (id) => ({
                url: `api/journal/${id}/important`,
                method: 'PUT',
            }),
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
        // ================== USER ENDPOINTS ==================
        signupUser: builder.mutation<any, any>({
            query: (userData) => ({
                url: 'api/users/signup',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User'],
        }),

        getUserProfile: builder.query<any, void>({
            query: () => 'api/users/me',
            providesTags: ['User'],
        }),
        // 🔥 NEW: Update Profile Picture
        updateProfilePicture: builder.mutation<{ message: string; profile_picture: string }, { profile_picture: string }>({
            query: (body) => ({
                url: 'api/users/profile-picture',
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['User'], // This refreshes getUserProfile automatically
        }),
    }),
});

// Export the hooks
export const {
    useGetTopicsQuery,
    useGetTopicByIdQuery,    // <--- New
    useCreateTopicMutation,
    useUpdateTopicMutation, // <--- New
    useDeleteTopicMutation, // <--- New
    useGetJournalsByTopicQuery,
    useGetJournalsQuery,
    useGetJournalByIdQuery,
    useCreateJournalMutation,
    useUpdateJournalMutation,
    useDeleteJournalMutation,
    useToggleImportantMutation,
    useSignupUserMutation,
    useGetUserProfileQuery,
    useUpdateProfilePictureMutation,
} = apiSlice;