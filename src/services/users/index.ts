import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { keys } from "../../keys";
import type { User } from "./types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({ baseUrl: keys.baseUrl }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({ url: "users", method: "GET" }),
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
