import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mark: '',
  feelings: '',
  questions: '',
  needs: '',
  status: '',
  wantOtherPschologist: '',
  secondSessionTime: ''
};

export const clientFeedbackSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setMark: (state, mark) => {
      state.mark = mark.payload;
    },

    setFeelings: (state, feelings) => {
      state.feelings = feelings.payload;
    },

    setQuestions: (state, questions) => {
      state.questions = questions.payload;
    },  

    setNeeds: (state, needs) => {      
      state.needs = needs.payload;
    },

    setStatus: (state, status) => {
      state.status = status.payload;
    },

    setWantOtherPschologist: (state, wantOtherPschologist) => {
      state.wantOtherPschologist = wantOtherPschologist.payload;
    },

    setSecondSessionTime: (state, secondSessionTime) => {
      state.secondSessionTime = secondSessionTime.payload;
    },  
  },
});

export const {
  setMark,
  setFeelings,
  setQuestions,
  setNeeds,
  setStatus,
  setWantOtherPschologist,
  setSecondSessionTime
} = clientFeedbackSlice.actions;
export default clientFeedbackSlice.reducer;
