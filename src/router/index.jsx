import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";
import FormPageWithoutPsychologists from "@/pages/FormPageWithoutPsycologists";
import FormPsyClientInfoPage from "../pages/FormPsyClientInfoPage";
import PsycoSlotsPage from "../pages/PsycoSlotsPage";
import SaveSlotsPage from "../pages/SaveSlotsPage";
import PsycologistPage from "@/pages/PsycologistPage";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <FormPageWithoutPsychologists />,
  },
  {
    path: "/form-with-psychologists",
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

  { path: "/psycologist-anketa", element: <PsycologistPage /> },
]);
