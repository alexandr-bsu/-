import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  // Свободные слоты
  freeSlots: [],
};

export const psycoSlots = createSlice({
  name: "psycoSlots",
  initialState,
  reducers: {
    toogleSlots: (state, slot) => {
      let index = state.freeSlots.findIndex((s) => s.slot == slot.payload);
      console.log("slot", slot?.payload);

      if (index != -1) {
        state.freeSlots[index].state = "loading";
        state.freeSlots.splice(index, 1);

        axios({
          url: "https://n8n.hrani.live/webhook/delete-slot",
          data: {
            slot: slot.payload,
            secret: "ecbb9433-1336-45c4-bb26-999aa194b3b9",
          },
          method: "POST",
        }).then((resp) => {
          state.freeSlots[index].state = "ok";
          state.freeSlots.splice(index, 1);
        });
      } else {
        axios({
          url: "https://n8n.hrani.live/webhook/add-slot",
          data: {
            secret: "ecbb9433-1336-45c4-bb26-999aa194b3b9",
            slot: slot.payload,
          },
          method: "POST",
        }).then((resp) => {
          // state.freeSlots[index].state = "ok";
          state.freeSlots.push({ slot: slot.payload, state: "ok" });
        });
      }
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

export const { toogleSlots, setFreeSlots } = psycoSlots.actions;
export default psycoSlots.reducer;
