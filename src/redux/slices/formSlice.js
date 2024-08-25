import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  anxieties: [],
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    toogleAnexieties: (state, anxiety) => {
      if (state.anxieties.includes(anxiety.payload)) {
        state.anxieties.splice(state.anxieties.indexOf(anxiety.payload), 1);
      } else {
        state.anxieties.push(anxiety.payload);
      }
    },
  },
});

export const { toogleAnexieties } = formSlice.actions;
export default formSlice.reducer;
