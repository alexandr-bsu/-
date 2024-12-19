import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  anxieties: [],
  questions: [],
  customQuestion: [],
  diagnoses: [],
  diagnoseInfo: "",
  traumaticEvents: [],
  clientStates: [],
  selectedPsychologistsNames: [],
  shownPsychologists: "",
  psychos: [],
  lastExperience: "",
  amountExpectations: "",
  age: "",
  slots: [],
  contactType: "Telegram",
  contact: "@",
  name: "",
  promocode: "",
  ticket_id: "",
  emptySlots: false,
  bid: 0,
  rid: 0,
  // Используется только при автомотчинге без карточек
  filtered_by_automatch_psy_names: [],
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

    tooglePsychologists: (state, psychologistsName) => {
      if (
        state.selectedPsychologistsNames.includes(psychologistsName.payload)
      ) {
        state.selectedPsychologistsNames.splice(
          state.selectedPsychologistsNames.indexOf(psychologistsName.payload),
          1
        );
      } else {
        state.selectedPsychologistsNames.push(psychologistsName.payload);
      }
    },

    setFilteredPsychologists: (state, psychologists) => {
      state.filtered_by_automatch_psy_names = psychologists.payload;
    },

    toogleDiagnoses: (state, diagnose) => {
      if (state.diagnoses.includes(diagnose.payload)) {
        state.diagnoses.splice(state.diagnoses.indexOf(diagnose.payload), 1);
      } else {
        state.diagnoses.push(diagnose.payload);
      }
    },

    toogleClientStates: (state, clientState) => {
      if (state.clientStates.includes(clientState.payload)) {
        state.clientStates.splice(
          state.clientStates.indexOf(clientState.payload),
          1
        );
      } else {
        state.clientStates.push(clientState.payload);
      }
    },

    toogleQuestions: (state, question) => {
      if (state.questions.includes(question.payload)) {
        state.questions.splice(state.questions.indexOf(question.payload), 1);
      } else {
        state.questions.push(question.payload);
      }
    },

    setCustomQuestion: (state, question) => {
      state.customQuestion = question.payload;
    },

    setDiagnoseInfo: (state, info) => {
      state.diagnoseInfo = info.payload;
    },

    toogleTraumaticEvents: (state, event) => {
      if (state.traumaticEvents.includes(event.payload)) {
        state.traumaticEvents.splice(
          state.traumaticEvents.indexOf(event.payload),
          1
        );
      } else {
        state.traumaticEvents.push(event.payload);
      }
    },

    setPsychologists: (state, ps) => {
      state.psychos = ps.payload;
    },

    setEmptySlots: (state) => {
      state.emptySlots = true;
    },
    removeEmptySlots: (state) => {
      state.emptySlots = false;
    },
    setShownPsychologists: (state, ps) => {
      state.shownPsychologists = ps.payload;
    },

    toogleAnexieties: (state, anxiety) => {
      if (state.anxieties.includes(anxiety.payload)) {
        state.anxieties.splice(state.anxieties.indexOf(anxiety.payload), 1);
      } else {
        state.anxieties.push(anxiety.payload);
      }
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
      if (!contact.payload.startsWith("@")) {
        contact.payload = "@" + contact.payload;
      }

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
  tooglePsychologists,
  setPsychologists,
  setShownPsychologists,
  toogleClientStates,
  setDiagnoseInfo,
  toogleTraumaticEvents,
  toogleDiagnoses,
  toogleQuestions,
  setCustomQuestion,
  setEmptySlots,
  removeEmptySlots,
  setFilteredPsychologists,
} = formSlice.actions;
export default formSlice.reducer;
