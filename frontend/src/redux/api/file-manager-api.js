import { createApi } from "@reduxjs/toolkit/query/react";
import axiosQuery from "../axiosQuery";
import { dispatch } from "../store";

const fileManagerApi = createApi({
  reducerPath: "fileManager",
  baseQuery: axiosQuery({
    baseUrl: "/file-manager",
  }),
  tagTypes: ["files"],
  endpoints: (builder) => ({
    getFiles: builder.query({
      query: (params) => ({
        url: "",
        method: "GET",
        params,
      }),
      providesTags: ["files"],
    }),
    getFileInfinite: builder.query({
      query: ({ params }) => ({
        url: ``,
        method: "GET",
        params,
      }),
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ endpointName }) => {
        return endpointName;
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        if (newItems.page > currentCache.page) {
          currentCache.result.push(...newItems.result);
        }
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg !== previousArg;
      },
    }),
    removeFile: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["files"],
    }),
  }),
});

export const cacheClean = (tags) => {
  dispatch(fileManagerApi.util.invalidateTags(tags));
};

export default fileManagerApi;

export const {
  useGetFilesQuery,
  useGetFileInfiniteQuery,
  useRemoveFileMutation,
} = fileManagerApi;
