import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // Свободные слоты
  freeSlots: [],
  // Впроцессе обработке
  loadList: [],
  // Уведомление о создании слота над мероприятием
  slotOverEventNotification: null,
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

    pushSlot: (state, action) => {
      // action.payload может быть строкой (старый формат) или объектом с id и slot
      if (typeof action.payload === 'string') {
        state.freeSlots.push({ slot: action.payload, state: "ok" });
      } else {
        state.freeSlots.push({
          slot: action.payload.slot,
          id: action.payload.id,
          state: "ok"
        });
      }
    },

    spliceSlot: (state, index) => {
      state.freeSlots.splice(index.payload, 1);
    },

    setFreeSlots: (state, groupsOfSlots) => {
      for (let groupOfSlots of groupsOfSlots.payload) {
        let slots = groupOfSlots.slots;
        for (let time in slots) {
          if (slots[time].length != 0 && slots[time][0].status == "Свободен") {
            const slotData = slots[time][0];
            state.freeSlots.push({
              slot: `${groupOfSlots.pretty_date} ${time}`,
              id: slotData.id, // Сохраняем UUID слота
              state: "ok",
            });
          }
        }
      }
    },

    // Новое действие для уведомления о создании слота над мероприятием
    notifySlotOverEvent: (state, action) => {
      // Это действие используется для уведомления компонентов о том, 
      // что нужно обновить отображение слота
      state.slotOverEventNotification = {
        date: action.payload.date,
        time: action.payload.time,
        slotId: action.payload.slotId,
        timestamp: Date.now()
      };
    },
    // Действие для уведомления о сбросе слота над мероприятием
    notifySlotCleared: (state, action) => {
      // Уведомляем о том, что слот был удален и нужно сбросить slot_over_event
      state.slotOverEventNotification = {
        date: action.payload.date,
        time: action.payload.time,
        cleared: true,
        timestamp: Date.now()
      };
    },
  },
});

export const {
  setStateSlotLoading,
  spliceSlot,
  setStateSlotOk,
  pushSlot,
  setFreeSlots,
  notifySlotOverEvent,
  notifySlotCleared,
} = psycoSlots.actions;
export default psycoSlots.reducer;
