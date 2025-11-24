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
  lastFetchTime: null, // Время последнего успешного запроса
};

// Async thunk для получения всех мероприятий
export const fetchAllEvents = createAsyncThunk(
  "events/fetchAllEvents",
  async (_, { rejectWithValue }) => {
    try {
      const events = await getAllEvents();
      return events;
    } catch (error) {
      return rejectWithValue(error.message || "Ошибка загрузки мероприятий");
    }
  },
  {
    // Предотвращаем повторные вызовы, если запрос уже выполняется
    // Или если прошло меньше 2 секунд с последнего успешного запроса
    condition: (_, { getState }) => {
      const state = getState();
      const now = Date.now();
      const lastFetchTime = state.events.lastFetchTime;
      const timeSinceLastFetch = lastFetchTime ? now - lastFetchTime : Infinity;
      
      // Не делаем запрос, если:
      // 1. Уже идет загрузка
      // 2. Прошло меньше 2 секунд с последнего запроса
      const shouldFetch = !state.events.loading && timeSinceLastFetch > 2000;
      return shouldFetch;
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
      return { result, date, time, eventName };
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
    // Удаление регистрации из registeredEvents
    removeRegistration: (state, action) => {
      const { date, time, eventName } = action.payload;
      state.registeredEvents = state.registeredEvents.filter(
        (reg) =>
          !(reg.date === date && reg.time === time && reg.eventName === eventName)
      );
      
      // Обновляем событие в allEvents, устанавливая registered: false
      const eventIndex = state.allEvents.findIndex(
        (event) => event.name === eventName || event.title === eventName
      );
      if (eventIndex !== -1) {
        state.allEvents[eventIndex].registered = false;
      }
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
        state.lastFetchTime = Date.now(); // Сохраняем время успешного запроса
        const newEvents = action.payload;
        
        // Синхронизируем registeredEvents с новыми данными событий
        // Если событие помечено как registered в новых данных, добавляем его в registeredEvents
        newEvents.forEach((event) => {
          if (event.registered && event.date && event.time) {
            // Нормализуем дату в формат YYYY-MM-DD
            let normalizedDate = event.date;
            if (typeof event.date === 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(event.date)) {
              // Если дата не в формате YYYY-MM-DD, конвертируем
              try {
                normalizedDate = new Date(event.date).toISOString().split('T')[0];
              } catch (e) {
                console.warn('Failed to normalize date:', event.date);
                return; // Пропускаем это событие
              }
            }
            
            const eventName = event.name || event.title;
            if (!eventName) return; // Пропускаем события без названия
            
            const existingIndex = state.registeredEvents.findIndex(
              (reg) =>
                reg.date === normalizedDate &&
                reg.time === event.time &&
                reg.eventName === eventName
            );
            
            if (existingIndex === -1) {
              state.registeredEvents.push({
                date: normalizedDate,
                time: event.time,
                eventName: eventName,
              });
            }
          }
        });
        
        // Обновляем allEvents
        state.allEvents = newEvents;
        console.log('Events fetched and stored:', newEvents.length, 'events');
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

export const { clearRegistrationStatus, clearCurrentEvent, clearError, removeRegistration } =
  eventsSlice.actions;

export default eventsSlice.reducer;

