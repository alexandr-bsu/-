import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";
import PsycoSlotsPage from "../pages/PsycoSlotsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <FormPage />,
  },
  {
    path: "/slots",
    element: <PsycoSlotsPage />,
  },
]);
