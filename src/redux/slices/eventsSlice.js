import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEvents,
  getEventForSlot,
  joinToEvent,
} from "../../api/eventsApi";

const initialState = {
  allEvents: [],
  currentEvent: null,
  loading: false,
  registering: false,
  error: null,
  registrationSuccess: false,
  registrationMessage: null,
  registeredEvents: [], // Массив объектов {date, time, eventName} для отслеживания регистраций
};

// Async thunk для получения всех мероприятий
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async (_, { rejectWithValue, getState }) => {
    try {
      // Проверяем, не загружены ли уже события
      const state = getState();
      if (state.events.allEvents.length > 0 && !state.events.loading) {
        return state.events.allEvents;
      }
      const events = await getAllEvents();
      return events;
    } catch (error) {
      return rejectWithValue(error.message || "Ошибка загрузки мероприятий");
    }
  },
  {
    // Предотвращаем повторные вызовы, если запрос уже выполняется
    condition: (_, { getState }) => {
      const state = getState();
      // Не вызываем API если уже загружается или уже загружено
      return !state.events.loading && state.events.allEvents.length === 0;
    },
  }
);

// Async thunk для получения мероприятия для слота
export const fetchEventForSlot = createAsyncThunk(
  "events/fetchEventForSlot",
  async ({ date, time }, { rejectWithValue }) => {
    try {
      const event = await getEventForSlot(date, time);
      return event;
    } catch (error) {
      return rejectWithValue(
        error.message || "Ошибка загрузки информации о мероприятии"
      );
    }
  }
);

// Async thunk для регистрации на мероприятие
export const registerForEvent = createAsyncThunk(
  "events/registerForEvent",
  async ({ date, time, eventName }, { rejectWithValue }) => {
    try {
      const result = await joinToEvent(date, time, eventName);
      return { result, eventName };
    } catch (error) {
      return rejectWithValue(
        error.message || "Ошибка регистрации на мероприятие"
      );
    }
  }
);

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    clearRegistrationStatus: (state) => {
      state.registrationSuccess = false;
      state.registrationMessage = null;
      state.error = null;
    },
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchAllEvents
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.allEvents = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // fetchEventForSlot
    builder
      .addCase(fetchEventForSlot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventForSlot.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventForSlot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // registerForEvent
    builder
      .addCase(registerForEvent.pending, (state) => {
        state.registering = true;
        state.registrationSuccess = false;
        state.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.registering = false;
        state.registrationSuccess = true;
        state.registrationMessage = action.payload.result;

        // Сохраняем регистрацию в registeredEvents
        const registrationKey = `${action.payload.date}_${action.payload.time}_${action.payload.eventName}`;
        const existingIndex = state.registeredEvents.findIndex(
          (reg) => `${reg.date}_${reg.time}_${reg.eventName}` === registrationKey
        );
        
        if (existingIndex === -1) {
          state.registeredEvents.push({
            date: action.payload.date,
            time: action.payload.time,
            eventName: action.payload.eventName,
          });
        }

        // Обновляем событие в allEvents, устанавливая registered: true
        const eventIndex = state.allEvents.findIndex(
          (event) => event.name === action.payload.eventName
        );
        if (eventIndex !== -1) {
          state.allEvents[eventIndex].registered = true;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload;
      });
  },
});

export const { clearRegistrationStatus, clearCurrentEvent, clearError } =
  eventsSlice.actions;

export default eventsSlice.reducer;

