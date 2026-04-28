import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";

export const utilsApi = createApi({
  reducerPath: "utisApi",
  baseQuery: axiosQuery({
    baseUrl: "/option",
  }),
  tagTypes: ["statistic"],
  endpoints: (builder) => ({
    getStatistic: builder.query({
      query: () => ({
        url: "",
        method: "GET",
      }),
      providesTags: ["statistic"],
    }),
  }),
});

export const { useGetStatisticQuery } = utilsApi;
