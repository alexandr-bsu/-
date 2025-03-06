import * as React from "react";
import { createBrowserRouter } from "react-router-dom";
import FormPage from "../pages/FormPage";
import FormPageWithoutPsychologists from "@/pages/FormPageWithoutPsycologists";
import FormPsyClientInfoPage from "../pages/FormPsyClientInfoPage";
import PsycoSlotsPage from "../pages/PsycoSlotsPage";
import SaveSlotsPage from "../pages/SaveSlotsPage";
import PsycologistPage from "@/pages/PsycologistPage";
import ClientFeedbackPage from "@/pages/ClientFeedbackPage";
import PsyFeedbackPage from "@/pages/PsyFeedbackPage";
import FormHelpfulHandPage from '@/pages/FormHelpfulHandPage'
import ReassigmentPage from "@/pages/ReassigmentPage";
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
  { path: "/reassigment", element: <ReassigmentPage /> },
  { path: "/psycologist-anketa", element: <PsycologistPage /> },
  { path: "/helpful-hand", element: <FormHelpfulHandPage /> },
  { path: "/client-feedback-anketa", element: <ClientFeedbackPage /> },
  { path: "/psychologist-feedback-anketa", element: <PsyFeedbackPage /> },
]);
