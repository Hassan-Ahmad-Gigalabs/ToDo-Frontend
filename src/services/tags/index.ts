import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { keys } from "../../keys";
import type { CreateTag, Tag, UpdateTag } from "./types";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({ baseUrl: keys.baseUrl }),
  tagTypes: ["Tag"],
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], void>({
      query: () => ({ url: "tags", method: "GET" }),
      providesTags: ["Tag"],
    }),
    addTag: builder.mutation<Tag, CreateTag>({
      query: (body) => ({
        url: "tags",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    updateTag: builder.mutation<Tag, UpdateTag>({
      query: ({ id, body }) => ({
        url: `tags/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const { useGetTagsQuery, useAddTagMutation, useUpdateTagMutation } =
  tagsApi;
