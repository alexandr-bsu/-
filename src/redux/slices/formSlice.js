import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  anxieties: [],
  questions: [],
  customQuestion: [],
  diagnoses: [],
  diagnoseInfo: "",
  diagnoseMedicaments: "",
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
  contact: "",
  name: "",
  promocode: "",
  ticket_id: "",
  emptySlots: false,
  userTimeZone: "МСК",
  bid: 0,
  rid: 0,
  categoryType: '',
  question_to_psychologist: '',
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
    setQuestionToPsychologist: (state, question) => {
      state.question_to_psychologist = question.payload
    },

    setRid: (state, rid) => {
      state.rid = rid.payload;
    },

    setBid: (state, bid) => {
      state.bid = bid.payload;
    },

    setCategoryType: (state, category) => {
      state.categoryType = category.payload;
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

    setDiagnoses: (state, diagnose) => {
      state.diagnoses = [diagnose.payload]
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

    setUserTimeZone: (state) => {
      // Конвертируем текущее время в МСК
      const getMoscowTime = () => {
        const userTime = new Date();
        const userTimeZoneOffset = userTime.getTimezoneOffset() * 60 * 1000; // get user's time zone offset in milliseconds
        const moscowOffset = 3 * 60 * 60 * 1000; // Moscow is UTC+3
        const moscowTime = new Date(
          userTime.getTime() + userTimeZoneOffset + moscowOffset
        );

        return moscowTime;
      };

      // Получить разницу в часовых поясах между московским временем и временем пользователя
      const getTimeDifference = () => {
        const userTime = new Date();
        const moscowTime = getMoscowTime();
        const timeDifference = Math.round(
          (userTime - moscowTime) / 1000 / 60 / 60
        );
        return timeDifference;
      };

      let diff = getTimeDifference();
      if (diff > 0) {
        state.userTimeZone = `МСК+${diff}`;
      } else if (diff < 0) {
        state.userTimeZone = `МСК${diff}`;
      } else {
        state.userTimeZone = "МСК";
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
      if (!contact.payload.startsWith("+7")) {
        contact.payload = "+7" + contact.payload;
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

    setDiagnoseMedicaments: (state, medicaments) => {
      state.diagnoseMedicaments = medicaments.payload
    }
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
  setUserTimeZone,
  setCategoryType,
  setDiagnoseMedicaments,
  setDiagnoses,
  setQuestionToPsychologist
} = formSlice.actions;
export default formSlice.reducer;
