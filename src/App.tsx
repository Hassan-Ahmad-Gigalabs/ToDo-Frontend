import { Suspense, lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  status: {
    danger: "orange",
  },
});

const ErrorPage = lazy(() => import("./components/error"));
const Dashboard = lazy(() => import("./modules/Dashboard"));

const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/dashboard" replace /> },
  {
    path: "/dashboard",
    element: (
      <Suspense>
        <Dashboard />
      </Suspense>
    ),
    errorElement: (
      <Suspense>
        <ErrorPage />
      </Suspense>
    ),
  },
]);

export default function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}
