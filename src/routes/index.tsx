// src/routes/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { TestPage } from "@/pages/TestPage";
import { StatsPage } from "@/pages/StatsPage";
import { NotFoundPage } from "@/pages/NotFoundPage"; // Create a simple 404 page

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
    errorElement: <NotFoundPage />, // Optional: for root path errors
  },
  {
    path: "/test",
    element: <TestPage />,
  },
  {
    path: "/stats",
    element: <StatsPage />,
  },
  {
    // Catch-all for 404
    path: "*",
    element: <NotFoundPage />,
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
