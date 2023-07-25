import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./modules/Dashboard/slice";
import { tasksApi } from "./services/tasks";
import { usersApi } from "./services/users";
import { tagsApi } from "./services/tags";
import { commentsApi } from "./services/comments";

export const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [tagsApi.reducerPath]: tagsApi.reducer,
    [commentsApi.reducerPath]: commentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(tasksApi.middleware)
      .concat(usersApi.middleware)
      .concat(tagsApi.middleware)
      .concat(commentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
