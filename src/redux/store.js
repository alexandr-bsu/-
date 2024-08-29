import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import formStatusSlice from "./slices/formStatusSlice";
import psycoSlotsSlice from "./slices/psycoSlotsSlice";
export const store = configureStore({
  reducer: {
    form: formReducer,
    formStatus: formStatusSlice,
    psyco: psycoSlotsSlice,
  },
});
