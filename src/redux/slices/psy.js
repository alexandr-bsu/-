import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  age: "",
  sexClient: "",
  minClientAge: "",
  maxClientAge: "",
  psychologistExperience: "",
  skills: [],
  queries: [],
};

export const psySlice = createSlice({
  name: "form",
  initialState,
  reducers: {
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
} = psySlice.actions;
export default psySlice.reducer;
