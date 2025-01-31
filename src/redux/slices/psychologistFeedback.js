import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mark: '',
  first_paid_session_clients: '',
  paid_session_clients: ''
};

export const psychologistFeedbackSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setMark: (state, mark) => {
      state.mark = mark.payload;
    },

    setFirstPaidSessionClients: (state, clients) => {
      state.first_paid_session_clients = clients.payload;
    },

    setPaidSessionClients: (state, clients) => {
      state.paid_session_clients = clients.payload;
    },

    
  },
});

export const {
  setMark,
  setFirstPaidSessionClients,
  setPaidSessionClients
} = psychologistFeedbackSlice.actions;
export default psychologistFeedbackSlice.reducer;
