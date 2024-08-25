import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
import formStatusSlice from "./slices/formStatusSlice";
export const store = configureStore({
  reducer: { form: formReducer, formStatus: formStatusSlice },
});
