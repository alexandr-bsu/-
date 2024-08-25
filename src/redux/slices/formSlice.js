import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  anxieties: [],
  questionToPsycologist: "",
  lastExperience: "",
  amountExpectations: "",
  age: "",
  slots: [],
  contactType: "",
  contact: "",
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

    setQuestionToPsycologist: (state, question) => {
      state.questionToPsycologist = question.payload;
    },

    setLastExperience: (state, experience) => {
      state.lastExperience = experience.payload;
    },

    setAmountExpectations: (state, expectations) => {
      state.amountExpectations = expectations.payload;
    },

    setAge: (state, age) => {
      state.age = age.payload;
    },

    toogleSlots: (state, slot) => {
      if (state.slots.includes(slot.payload)) {
        state.slots.splice(state.slots.indexOf(slot.payload), 1);
      } else {
        state.slots.push(slot.payload);
      }
    },

    setContactType: (state, contactType) => {
      state.contactType = contactType.payload;
    },

    setContact: (state, contact) => {
      state.contact = contact.payload;
    },
  },
});

export const {
  toogleAnexieties,
  setQuestionToPsycologist,
  setLastExperience,
  setAmountExpectations,
  setAge,
  toogleSlots,
  setContactType,
  setContact,
} = formSlice.actions;
export default formSlice.reducer;
