import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  age: "",
  sexClient: "",
  minClientAge: "",
  maxClientAge: "",
  psychologistExperience: "",
  mainModal: '',
  additionalModals: [],
  skills: [],
  queries: [],
  telegram_link: '',
  site_link: '',
  vk_link: ''
};

export const psySlice = createSlice({
  name: "form",
  initialState,
  reducers: {

    setVk: (state, vk_page) => {
      state.vk_link = vk_page.payload
    },
    setTelegram: (state, telegram_page) => {
      state.telegram_link = telegram_page.payload
    },
    setSite: (state, site_page) => {
      state.site_link = site_page.payload
    },
    setName: (state, name) => {
      state.name = name.payload;
    },
    setAge: (state, age) => {
      state.age = age.payload;
    },
    setSexClient: (state, sexClient) => {
      state.sexClient = sexClient.payload;
    },
    setMinClientAge: (state, minClientAge) => {
      state.minClientAge = minClientAge.payload;
    },
    setMaxClientAge: (state, maxClientAge) => {
      state.maxClientAge = maxClientAge.payload;
    },
    setPsychologistExperience: (state, psychologistExperience) => {
      state.psychologistExperience = psychologistExperience.payload;
    },
    setMainModal: (state, modal) => {
      state.mainModal = modal.payload
    },

    toogleAdditionalModals: (state, modal) => {
      if (state.additionalModals.includes(modal.payload)) {
        state.additionalModals.splice(state.additionalModals.indexOf(modal.payload), 1);
      } else {
        state.additionalModals.push(modal.payload);
      }
    },

    toogleSkills: (state, skill) => {
      if (state.skills.includes(skill.payload)) {
        state.skills.splice(state.skills.indexOf(skill.payload), 1);
      } else {
        state.skills.push(skill.payload);
      }
    },
    toogleQueries: (state, query) => {
      if (state.queries.includes(query.payload)) {
        state.queries.splice(state.queries.indexOf(query.payload), 1);
      } else {
        state.queries.push(query.payload);
      }
    },
  },
});

export const {
  setName,
  setAge,
  setSexClient,
  setMaxClientAge,
  setMinClientAge,
  setPsychologistExperience,
  toogleSkills,
  toogleQueries,
  setMainModal,
  toogleAdditionalModals,
  setSite,
  setVk,
  setTelegram
} = psySlice.actions;
export default psySlice.reducer;
