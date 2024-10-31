import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  age: "",
  city: "",
  sex: "",
  psychoEducated: "",
  anxieties: [],
  customAnexiety: "",
  hasDiagnsose: "",
  hasPsychoExperience: "",
  meetType: "",
  selectionСriteria: "",
  custmCreteria: "",
  importancePsycho: [],
  customImportance: "",
  agePsycho: "",
  sexPsycho: "",
  priceLastSession: "",
  durationSession: "",
  reasonCancel: "",
  pricePsycho: "",
  reasonNonApplication: "",
  contactType: "",
  contact: "",
  name: "",
  is_adult: false,
  is_last_page: false,
};

export const formPsyClientInfoSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setCustomAnexiety: (state, anexiety) => {
      state.customAnexiety = anexiety.payload;
    },
    setCustomCreteria: (state, creteria) => {
      state.custmCreteria = creteria.payload;
    },

    setCustomImportance: (state, importance) => {
      state.customImportance = importance.payload;
    },

    setAge: (state, age) => {
      state.age = age.payload;
      if (Number(age.payload) >= 18 || isNaN(Number(age.payload))) {
        state.is_adult = true;
      } else {
        state.is_adult = false;
      }
    },

    setAgePsycho: (state, age) => {
      state.agePsycho = age.payload;
    },

    setCity: (state, city) => {
      state.city = city.payload;
    },

    setSex: (state, sex) => {
      state.sex = sex.payload;
    },

    setSexPsycho: (state, sex) => {
      state.sexPsycho = sex.payload;
    },

    setDurationSession: (state, duration) => {
      state.durationSession = duration.payload;
    },

    setReasonCancel: (state, reason) => {
      state.reasonCancel = reason.payload;
    },

    setPsychoEducated: (state, educated) => {
      state.psychoEducated = educated.payload;
    },

    toogleAnexieties: (state, anxiety) => {
      if (state.anxieties.includes(anxiety.payload)) {
        state.anxieties.splice(state.anxieties.indexOf(anxiety.payload), 1);
      } else {
        state.anxieties.push(anxiety.payload);
      }
    },

    setHasDiagnsose: (state, diagnos) => {
      state.hasDiagnsose = diagnos.payload;
    },

    setHasPsychoExperience: (state, experience) => {
      state.hasPsychoExperience = experience.payload;
    },

    setMeetType: (state, meetType) => {
      state.meetType = meetType.payload;
    },

    setSelectionСriteria: (state, criteria) => {
      state.selectionСriteria = criteria.payload;
    },

    toogleImportancePsycho: (state, importance) => {
      if (state.importancePsycho.includes(importance.payload)) {
        state.importancePsycho.splice(
          state.importancePsycho.indexOf(importance.payload),
          1
        );
      } else {
        state.importancePsycho.push(importance.payload);
      }
    },

    setPricePsycho: (state, price) => {
      state.pricePsycho = price.payload;
    },

    setPriceLastSession: (state, price) => {
      state.priceLastSession = price.payload;
    },

    setReasonNonApplication: (state, reason) => {
      state.reasonNonApplication = reason.payload;
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
  },
});

export const {
  setAge,
  setAgePsycho,
  setCity,
  setSex,
  setSexPsycho,
  setDurationSession,
  setReasonCancel,
  setPsychoEducated,
  toogleAnexieties,
  setHasDiagnsose,
  setHasPsychoExperience,
  setMeetType,
  setSelectionСriteria,
  toogleImportancePsycho,
  setPricePsycho,
  setPriceLastSession,
  setReasonNonApplication,
  setContactType,
  setContact,
  setName,
  setCustomAnexiety,
  setCustomCreteria,
  setCustomImportance,
} = formPsyClientInfoSlice.actions;
export default formPsyClientInfoSlice.reducer;
