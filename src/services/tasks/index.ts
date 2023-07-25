import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { keys } from "../../keys";
import type { Task, CreateTask, UpdateTask, Remove, Upload } from "./types";

export const tasksApi = createApi({
  reducerPath: "tasksApi",
  baseQuery: fetchBaseQuery({ baseUrl: keys.baseUrl }),
  tagTypes: ["Tag"],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => ({ url: "tasks", method: "GET" }),
      providesTags: ["Tag"],
    }),
    addTasks: builder.mutation<Task, Partial<CreateTask>>({
      query: (body) => ({
        url: "tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    upload: builder.mutation<Upload, FormData>({
      query: (body) => ({
        url: "tasks/upload",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    remove: builder.mutation<Upload, Remove>({
      query: (body) => ({
        url: "tasks/removeFile",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    updateTask: builder.mutation<Task, UpdateTask>({
      query: ({ id, body }) => ({
        url: `tasks/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Tag"],
    }),
    deleteTask: builder.mutation<Task, number>({
      query: (id) => ({
        url: `tasks/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useAddTasksMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useUploadMutation,
  useRemoveMutation,
} = tasksApi;
