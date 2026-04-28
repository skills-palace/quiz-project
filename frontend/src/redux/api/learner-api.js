import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const learnerApi = createApi({
  reducerPath: "learnerApi",
  baseQuery: axiosQuery({
    baseUrl: "/learner",
  }),
  tagTypes: ["learners"],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["learners"],
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
      invalidatesTags: ["learners"],
    }),
    update: builder.mutation({
      query: ({ form, id }) => ({
        url: `/${id}`,
        method: "PATCH",
        body: form,
      }),
      invalidatesTags: ["learners"],
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["learners"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = learnerApi;
