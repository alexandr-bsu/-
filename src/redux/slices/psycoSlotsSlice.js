import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Свободные слоты
  freeSlots: [],
};

export const psycoSlots = createSlice({
  name: "psycoSlots",
  initialState,
  reducers: {
    toogleSlots: (state, slot) => {
      if (state.freeSlots.includes(slot.payload)) {
        state.freeSlots.splice(state.freeSlots.indexOf(slot.payload), 1);
      } else {
        state.freeSlots.push(slot.payload);
      }
    },
    setFreeSlots: (state, groupsOfSlots) => {
      for (let groupOfSlots of groupsOfSlots.payload) {
        let slots = groupOfSlots.slots;
        for (let time in slots) {
          if (slots[time].length != 0 && slots[time][0].status == "Свободен") {
            state.freeSlots.push(`${groupOfSlots.pretty_date} ${time}`);
          }
        }
      }
    },
  },
});

export const { toogleSlots, setFreeSlots } = psycoSlots.actions;
export default psycoSlots.reducer;
