import { createApi } from "@reduxjs/toolkit/query/react";
import { dispatch } from "../store";
import axiosQuery from "../axiosQuery";

const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: axiosQuery({
    baseUrl: "/app",
  }),
  tagTypes: ["medias"],
  endpoints: (builder) => ({
    dashboardHome: builder.query({
      query: (params) => ({
        url: "/dashboard-home",
        method: "GET",
        params,
      }),
      providesTags: ["blogs"],
    }),
    contactMessages: builder.query({
      query: (params) => ({
        url: "/contact-us",
        method: "GET",
        params,
      }),
      providesTags: ["blogs"],
    }),
    replyContactMessage: builder.mutation({
      query: ({ id, reply }) => ({
        url: `/contact-us/${id}/reply`,
        method: "POST",
        body: { reply },
      }),
    }),
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: `/contact-us/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const cacheClean = (tags) => {
  dispatch(appApi.util.invalidateTags(tags));
};

export const {
  useDashboardHomeQuery,
  useContactMessagesQuery,
  useReplyContactMessageMutation,
  useDeleteContactMessageMutation,
} = appApi;

export default appApi;
