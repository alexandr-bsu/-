import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import formStatusSlice from "./slices/formStatusSlice";
import psycoSlotsSlice from "./slices/psycoSlotsSlice";
import formPsyClientInfoSlice from "./slices/formPsyClientInfoSlice";
import psySlice from "./slices/psy";
import clientFeedbackSlice  from "./slices/clientFeedback";
import psyFeedbackSlice  from "./slices/psychologistFeedback";

export const store = configureStore({
  reducer: {
    form: formReducer,
    formPsyClientInfo: formPsyClientInfoSlice,
    formStatus: formStatusSlice,
    psyco: psycoSlotsSlice,
    psyAnketa: psySlice,
    clientFeedback: clientFeedbackSlice,
    psyFeedback: psyFeedbackSlice
  },
});
