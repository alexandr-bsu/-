import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  slots: [],
};

export const psycoSlots = createSlice({
  name: "psycoSlots",
  initialState,
  reducers: {
    toogleSlots: (state, slot) => {
      if (state.slots.includes(slot.payload)) {
        state.slots.splice(state.slots.indexOf(slot.payload), 1);
      } else {
        state.slots.push(slot.payload);
      }
    },
  },
});

export const { toogleSlots } = psycoSlots.actions;
export default psycoSlots.reducer;
