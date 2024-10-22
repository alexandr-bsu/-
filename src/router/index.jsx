import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";
import FormPsyClientInfoPage from "../pages/FormPsyClientInfoPage";
import PsycoSlotsPage from "../pages/PsycoSlotsPage";
import SaveSlotsPage from "../pages/SaveSlotsPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <FormPage />,
  },
  {
    path: "/form-psy-client-info",
    element: <FormPsyClientInfoPage />,
  },
  {
    path: "/slots",
    element: <PsycoSlotsPage />,
  },
  {
    path: "/slots-saved",
    element: <SaveSlotsPage />,
  },
]);
