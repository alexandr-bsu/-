import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: "active",
};

export const formStatusSlice = createSlice({
  name: "formStatus",
  initialState,
  reducers: {
    setStatus: (state, status) => {
      state.status = status.payload;
    },
  },
});

export const { setStatus } = formStatusSlice.actions;
export default formStatusSlice.reducer;
