import axios from "axios";
import QueryString from "qs";
import { format } from "date-fns";

const BASE_URL = "https://n8n-v2.hrani.live/webhook";

/**
 * Извлекает параметр 'secret' из URL
 * @returns {string|null} Значение secret или null если не найдено
 */
export function getSecretFromUrl() {
  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;
  return secret || null;
}

/**
 * Форматирует Date объект в формат "YYYY-MM-DD"
 * @param {Date|string} date - Дата для форматирования
 * @returns {string} Дата в формате "YYYY-MM-DD"
 */
export function formatDateForApi(date) {
  if (typeof date === "string") {
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return date;
    }
    date = new Date(date);
  }
  return format(date, "yyyy-MM-dd");
}

/**
 * Форматирует время в формат "HH:MM"
 * @param {string|Date} time - Время для форматирования
 * @returns {string} Время в формате "HH:MM"
 */
export function formatTimeForApi(time) {
  if (typeof time === "string") {
    if (/^\d{2}:\d{2}$/.test(time)) {
      return time;
    }
  }
  if (time instanceof Date) {
    return format(time, "HH:mm");
  }
  return time;
}

/**
 * Форматирует дату для отображения в календаре (русские названия месяцев и дней недели)
 * @param {string|Date} dateStr - Дата для форматирования
 * @returns {Object} Объект с полями pretty_date (например, "10 ноября") и day_name (например, "понедельник")
 */
export function formatDateForGroup(dateStr) {
  const date = new Date(dateStr);
  const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
    'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const dayName = days[date.getDay()];
  return {
    pretty_date: `${day} ${month}`,
    day_name: dayName
  };
}

/**
 * Получает список всех доступных мероприятий
 * @returns {Promise<Array>} Массив мероприятий
 */
export async function getAllEvents() {
  try {
    const secret = getSecretFromUrl();

    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/get-all-events`,
      params: secret ? { secret } : {},
    });

    if (response.data) {
      return response.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching all events:", error);
    throw new Error("Не удалось загрузить список мероприятий");
  }
}

/**
 * Получает информацию о мероприятии для конкретного слота
 * @param {string} date - Дата в формате "YYYY-MM-DD"
 * @param {string} time - Время в формате "HH:MM"
 * @returns {Promise<Object>} Объект мероприятия
 */
export async function getEventForSlot(date, time) {
  try {
    const secret = getSecretFromUrl();
    if (!secret) {
      throw new Error("Secret не найден в URL");
    }

    const formattedDate = formatDateForApi(date);
    const formattedTime = formatTimeForApi(time);

    const response = await axios({
      method: "GET",
      url: `${BASE_URL}/get-event-for-slot`,
      params: {
        secret,
        date: formattedDate,
        time: formattedTime,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching event for slot:", error);
    throw new Error("Не удалось загрузить информацию о мероприятии");
  }
}

/**
 * Регистрирует пользователя на мероприятие
 * @param {string} date - Дата в формате "YYYY-MM-DD"
 * @param {string} time - Время в формате "HH:MM"
 * @param {string} eventName - Название мероприятия
 * @returns {Promise<Object>} Результат регистрации
 */
export async function joinToEvent(date, time, eventName) {
  try {
    const secret = getSecretFromUrl();
    if (!secret) {
      throw new Error("Secret не найден в URL");
    }

    const formattedDate = formatDateForApi(date);
    const formattedTime = formatTimeForApi(time);

    const response = await axios({
      method: "POST",
      url: `${BASE_URL}/join-to-event`,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        secret,
        date: formattedDate,
        time: formattedTime,
        event: eventName,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error joining event:", error);
    throw new Error("Не удалось записаться на мероприятие");
  }
}

