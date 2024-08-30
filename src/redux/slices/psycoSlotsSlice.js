import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // Свободные слоты
  freeSlots: [],
  // Впроцессе обработке
  loadList: [],
  // Слоты на удаление
  deleteList: [],
  //Слоты на добавление
  addList: [],
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

    pushToDeleteList: (state, slot) => {
      state.deleteList.push(slot.payload);
    },

    spliceDeleteList: (state, slot) => {
      let index = state.deleteList.findIndex(
        (s) => s.slot == slot.payload?.slot
      );
      state.deleteList.splice(index, 1);
    },

    pushToAddList: (state, slot) => {
      state.addList.push(slot.payload);
    },

    spliceAddList: (state, slot) => {
      let index = state.addList.findIndex((s) => s.slot == slot.payload?.slot);
      state.addList.splice(index, 1);
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
  pushToDeleteList,
  spliceDeleteList,
  pushToAddList,
  spliceAddList,
} = psycoSlots.actions;
export default psycoSlots.reducer;
