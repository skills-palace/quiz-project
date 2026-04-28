import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";
import { dispatch } from "../store";

export const mediaApi = createApi({
  reducerPath: "mediaApi",
  baseQuery: axiosQuery({
    baseUrl: "/media",
  }),
  tagTypes: ["mediaItems"],
  endpoints: (builder) => ({
    getItems: builder.query({
      query: () => ({
        url: "",
        method: "get",
      }),
      providesTags: ["mediaItems"],
    }),
    destroy: builder.mutation({
      query: (name) => ({
        url: `/${name}`,
        method: "delete",
      }),
      invalidatesTags: ["mediaItems"],
    }),
    uploadMedia: builder.mutation({
      query: (file) => ({
        url: "",
        method: "post",
        data: file,
      }),
    }),
  }),
});

export const cacheClean = (tags) => {
  dispatch(mediaApi.util.invalidateTags(tags));
};

export const { useGetItemsQuery, useDestroyMutation } = mediaApi;
