import { createApi } from '@reduxjs/toolkit/query/react';
import axiosQuery from '../axiosQuery';
import { dispatch } from '../store';

export const lessonApi = createApi({
  reducerPath: 'lessonApi',
  baseQuery: axiosQuery({
    baseUrl: '/lesson',
  }),
  tagTypes: ['lessons', 'lesson', 'quiz-validate'],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: ({ params }) => ({
        url: '/list',
        method: 'GET',
        params,
      }),
      providesTags: ['lessons'],
    }),
    getLessons: builder.query({
      query: ({ page = 1, limit = 18, ...params }) => ({
        url: '',
        method: 'GET',
        params: { ...params, page, limit },
      }),
      providesTags: ['siteLessons'],
    }),

    getLesson: builder.query({
      query: (title) => ({
        url: `/site-lesson/${title}`,
        method: 'GET',
      }),
      providesTags: ['siteLesson'],
    }),
    getLessonLog: builder.query({
      query: (id) => ({
        url: `/log/${id}`,
        method: 'GET',
      }),
      providesTags: ['siteLesson'],
    }),
    getMyLessonLog: builder.query({
      query: (id) => ({
        url: `/my_log/6646ad5af863311oec9aeeb6`,
        method: 'GET',
      }),
      providesTags: ['siteLesson'],
    }),
    edit: builder.query({
      query: ({ id }) => ({
        url: `/edit/${id}`,
        method: 'GET',
      }),
      providesTags: ['edit-lesson'],
    }),
    valiateQuiz: builder.mutation({
      query: (form) => ({
        url: `/validate-quiz/${form.id}`,
        method: 'POST',
        body: form,
      }),
      providesTags: ['quiz-validate'],
    }),
    add: builder.mutation({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['lessons'],
    }),
    update: builder.mutation({
      query: ({ formData, id }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: formData,
      }),
      invalidatesTags: ['lessons'],
    }),
    remove: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['lessons'],
    }),
  }),
});

export const cacheClean = (tags) => {
  dispatch(lessonApi.util.invalidateTags(tags));
};

export const {
  useGetItemsQuery,
  useValiateQuizMutation,
  useGetLessonLogQuery,
  useGetMyLessonLogQuery,
  useEditQuery,
  useAddMutation,
  useUpdateMutation,
  useGetLessonQuery,
  useGetLessonsQuery,
  useRemoveMutation,
} = lessonApi;
