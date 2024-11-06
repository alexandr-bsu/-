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
  name: "",
  promocode: "",
  ticket_id: "",
  bid: 0,
  rid: 0,
};

function makeid(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setRid: (state, rid) => {
      state.rid = rid.payload;
    },

    setBid: (state, bid) => {
      state.bid = bid.payload;
    },

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

    setName: (state, name) => {
      state.name = name.payload;
    },

    setPromocode: (state, prompcode) => {
      state.promocode = prompcode.payload;
    },

    generateTicketId: (state) => {
      state.ticket_id = makeid(7);
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
  setName,
  setPromocode,
  generateTicketId,
  setRid,
  setBid,
} = formSlice.actions;
export default formSlice.reducer;
