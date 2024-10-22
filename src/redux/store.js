import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import formStatusSlice from "./slices/formStatusSlice";
import psycoSlotsSlice from "./slices/psycoSlotsSlice";
import formPsyClientInfoSlice from "./slices/formPsyClientInfoSlice";
export const store = configureStore({
  reducer: {
    form: formReducer,
    formPsyClientInfo: formPsyClientInfoSlice,
    formStatus: formStatusSlice,
    psyco: psycoSlotsSlice,
  },
});
