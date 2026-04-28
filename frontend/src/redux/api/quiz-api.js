import { createApi } from '@reduxjs/toolkit/query/react';
import axiosQuery from '../axiosQuery';
import { dispatch } from '../store';

export const quizApi = createApi({
  reducerPath: 'quizApi',
  baseQuery: axiosQuery({
    baseUrl: '/quiz',
  }),
  tagTypes: ['quizes'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({ params }) => ({
        url: '/',
        method: 'GET',
        params,
      }),
      providesTags: ['quizes'],
    }),
    getItemById: builder.query({
      query: (id) => ({
        url: `/get-one/${id}`,
        method: 'GET',
      }),
      providesTags: ['quizes'],
    }),
    edit: builder.query({
      query: ({ id }) => ({
        url: `/edit/${id}`,
        method: 'GET',
      }),
      providesTags: ['quizes'],
    }),
    add: builder.mutation({
      query: (form) => ({
        url: '/',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: ['quizes'],
    }),
    generateQuiz: builder.mutation({
      query: (form) => ({
        url: '/generate',
        method: 'POST',
        body: form,
      }),
      invalidatesTags: ['quizes'],
    }),
    update: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['quizes'],
    }),
    remove: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['quizes'],
    }),
    getQuizInfinite: builder.query({
      query: (params) => ({
        url: '',
        method: 'GET',
        params,
      }),
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        if (currentCache.page < newItems.page) {
          currentCache.result.push(...newItems.result);
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
  }),
});

export const cacheClean = (tags) => {
  dispatch(quizApi.util.invalidateTags(tags));
};

export const {
  useGetItemsQuery,
  useGetItemByIdQuery,
  useAddMutation,
  useEditQuery,
  useGenerateQuizMutation,
  useUpdateMutation,
  useRemoveMutation,
  useGetQuizInfiniteQuery,
} = quizApi;
