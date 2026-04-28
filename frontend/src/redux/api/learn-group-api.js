import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const learnGroupApi = createApi({
  reducerPath: "learnGroupApi",
  baseQuery: axiosQuery({
    baseUrl: "/learn-group",
  }),
  tagTypes: ["learngroups"],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["learngroups"],
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
      invalidatesTags: ["learngroups"],
    }),
    update: builder.mutation({
      query: (form) => ({
        url: `/${form._id}`,
        method: "PATCH",
        body: form,
      }),
      invalidatesTags: ["learngroups"],
    }),
    delete: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["learngroups"],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useGetItemQuery,
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
} = learnGroupApi;
