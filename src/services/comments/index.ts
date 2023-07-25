import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { keys } from "../../keys";
import type {
  Comment,
  CreateComment,
  GetComments,
  TaskCommentsType,
} from "./types";

export const commentsApi = createApi({
  reducerPath: "commentsApi",
  baseQuery: fetchBaseQuery({ baseUrl: keys.baseUrl }),
  tagTypes: ["Comment"],
  endpoints: (builder) => ({
    getTaskCommets: builder.query<GetComments, TaskCommentsType>({
      query: ({ id, params }) => ({
        url: `comments/task/${id}` + params,
        method: "GET",
      }),
      providesTags: ["Comment"],
    }),
    addComment: builder.mutation<Comment, CreateComment>({
      query: (body) => ({
        url: "comments",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Comment"],
    }),
  }),
});

export const { useGetTaskCommetsQuery, useAddCommentMutation } = commentsApi;
