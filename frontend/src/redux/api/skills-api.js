import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const skillsApi = createApi({
  reducerPath: "skillsApi",
  baseQuery: axiosQuery({
    baseUrl: "/skills",
  }),
  tagTypes: ["skills"],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["skills"],
    }),
    getItem: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    create: builder.mutation({
      query: (form) => ({
        url: "",
        method: "POST",
        body: form,
      }),
      invalidatesTags: ["skills"],
    }),
    update: builder.mutation({
      query: ({ form, id }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: form,
      }),
      invalidatesTags: ["skills"],
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["skills"],
    }),
    updateSkillsOrder: builder.mutation({
      query: (orderedSkills) => ({
        url: "/order",
        method: "POST",
        body: { orderedSkills },
      }),
      invalidatesTags: ["skills"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useUpdateSkillsOrderMutation, // Export the new mutation hook
} = skillsApi;
