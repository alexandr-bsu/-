import { configureStore } from "@reduxjs/toolkit";
import formReducer from "./slices/formSlice";
export const store = configureStore({
  reducer: { form: formReducer },
});

console.log(store);
