import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // Свободные слоты
  freeSlots: [],
  // Впроцессе обработке
  loadList: [],
};

export const psycoSlots = createSlice({
  name: "psycoSlots",
  initialState,
  reducers: {
    setStateSlotLoading: (state, slot) => {
      state.loadList.push(slot.payload);
    },

    setStateSlotOk: (state, slot) => {
      let index = state.loadList.findIndex((s) => s == slot.payload);
      state.loadList.splice(index, 1);
    },

    pushSlot: (state, slot) => {
      state.freeSlots.push({ slot: slot.payload, state: "ok" });
    },

    spliceSlot: (state, index) => {
      state.freeSlots.splice(index.payload, 1);
    },

    setFreeSlots: (state, groupsOfSlots) => {
      for (let groupOfSlots of groupsOfSlots.payload) {
        let slots = groupOfSlots.slots;
        for (let time in slots) {
          if (slots[time].length != 0 && slots[time][0].status == "Свободен") {
            state.freeSlots.push({
              slot: `${groupOfSlots.pretty_date} ${time}`,
              state: "ok",
            });
          }
        }
      }
    },
  },
});

export const {
  setStateSlotLoading,
  spliceSlot,
  setStateSlotOk,
  pushSlot,
  setFreeSlots,
} = psycoSlots.actions;
export default psycoSlots.reducer;
