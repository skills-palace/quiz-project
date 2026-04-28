import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosQuery({
    baseUrl: "/user",
  }),
  tagTypes: ["users", "Me"],
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      providesTags: ["Me"],
    }),
    updateProfile: builder.mutation({
      query: (body) => ({
        url: "/me",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Me", "users"],
    }),
    getItems: builder.query({
      query: ({ params }) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
    getItem: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    getLearners: builder.query({
      query: (params) => ({
        url: "/learner",
        method: "GET",
        params,
      }),
      providesTags: ["users"],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    createUser: builder.mutation({
      query: (form) => ({
        url: "",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["users"],
    }),
    remove: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    update: builder.mutation({
      query: (form) => ({
        url: `/${form._id}`,
        method: "PATCH",
        body: form,
      }),
      invalidatesTags: ["users"],
    }),
  }),
});

export const {
  useGetMeQuery,
  useUpdateProfileMutation,
  useGetItemsQuery,
  useGetLearnersQuery,
  useGetItemQuery,
  useRemoveMutation,
  useCreateUserMutation,
  useUpdateMutation,
} = userApi;
