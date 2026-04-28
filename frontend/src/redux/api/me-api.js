import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const meApi = createApi({
  reducerPath: "meApi",
  baseQuery: axiosQuery({
    baseUrl: "/me/",
  }),
  endpoints: (builder) => ({
    getInfo: builder.query({
      query: () => ({
        url: "get-info",
        method: "get",
      }),
    }),
    getOrders: builder.query({
      query: (query) => ({
        url: `orders?${query}`,
        method: "get",
      }),
    }),
    createOrder: builder.mutation({
      query: (form) => ({
        url: "place-order",
        method: "POST",
        body: form,
      }),
    }),
    update: builder.mutation({
      query: (form) => ({
        url: "",
        method: "PATCH",
        body: form,
      }),
    }),
    login: builder.mutation({
      query: (form) => ({
        url: "login",
        method: "POST",
        body: form,
      }),
    }),
    register: builder.mutation({
      query: (form) => ({
        url: "register",
        method: "POST",
        body: form,
      }),
    }),
  }),
});

export const {
  useGetInfoQuery,
  useGetOrdersQuery,
  useCreateOrderMutation,
  useUpdateMutation,
  useLoginMutation,
  useRegisterMutation,
} = meApi;
