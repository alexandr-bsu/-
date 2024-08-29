import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Свободные слоты
  freeSlots: [],
};

export const psycoSlots = createSlice({
  name: "psycoSlots",
  initialState,
  reducers: {
    toogleSlots: (state, slotId) => {
      let index = state.freeSlots.findIndex((s) => s?.id == slotId?.payload);
      if (index != -1) {
        state.freeSlots.splice(index, 1);
      } else {
        state.freeSlots.push({ id: 1, state: "ok" });
      }
    },
    setFreeSlots: (state, groupsOfSlots) => {
      for (let groupOfSlots of groupsOfSlots.payload) {
        let slots = groupOfSlots.slots;
        for (let time in slots) {
          if (slots[time].length != 0 && slots[time][0].status == "Свободен") {
            state.freeSlots.push({ id: slots[time][0].id, state: "ok" });
          }
        }
      }
    },
  },
});

export const { toogleSlots, setFreeSlots } = psycoSlots.actions;
export default psycoSlots.reducer;
