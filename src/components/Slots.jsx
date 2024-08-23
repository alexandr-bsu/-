import React from "react";
import { useEffect, useState } from "react";
import WeekToogleContainer from "./WeekToogleContainer";
import DateGroup from "./DateGroup";
import axios from "axios";

const Slots = () => {
  const [groups_of_slots, setGroupsOfSlots] = useState([]);
  //Получаем даты начала и конца недели
  function getWeekStartEnd(date) {
    //Преобразуем строку в объект DateTime
    let givenDate = new Date(date);

    //Определяем день недели (0 - воскрессение, 1 - понедельник, ... 6 - суббота)
    let dayOfWeek = givenDate.getDay();

    // Считаем смещение от понедельника
    let diffToMonday = (dayOfWeek + 6) % 7;

    // Находим воскресенье предыдущей недели
    let monday = new Date(givenDate);
    monday.setDate(givenDate.getDate() - diffToMonday);

    // Находим понедельник следующей недели
    let sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    // Преобразуем даты в строку формата YYYY-MM-DD
    let mondayStr = monday.toISOString().split("T")[0];
    let sundayStr = sunday.toISOString().split("T")[0];

    return { monday: mondayStr, sunday: sundayStr };
  }
  // Даты начала и конца текущей недели
  const currWeekBorders = getWeekStartEnd(new Date());
  // Даты начала и конца следующей недели
  let next_date = new Date();
  next_date.setDate(next_date.getDate() + 7);
  const nextWeekBorders = getWeekStartEnd(next_date);

  // Даты для поиска слотов по неделям
  const dates = [
    `${currWeekBorders.monday}:${currWeekBorders.sunday}`,
    `${nextWeekBorders.monday}:${nextWeekBorders.sunday}`,
  ];

  const [selectedDate, setSelectedDate] = useState(dates[0]);

  //Таймер запроса апи (нужно для получения обновлений только нату дату, которая соответствует дате владки на которой находится пользователь)
  // const [timerRequestScheduleId, setTimerRequestScheduleId] = useState();

  // Флаг показывает загружается ли расписание или нет
  const [isLoading, setIsLoading] = useState(false);

  // Получаем группы слотов и обновляем переменную groups_of_slots
  // Срабатывает когда выбирается дата в WeekToogleContainer
  function selectFn(date) {
    let splited_dates = date.split(":");
    let startDate = splited_dates[0];
    let endDate = splited_dates[1];

    setIsLoading(true);
    axios({
      method: "GET",
      params: { startDate, endDate },
      url: "https://n8n.hrani.live/webhook/aggregated-schedule",
    }).then((resp) => {
      setGroupsOfSlots(resp.data);
      setIsLoading(false);
    });
  }

  // Запрашиваем группы слотов при загрузке страницы
  useEffect(() => {
    selectFn(selectedDate);
  }, []);

  return (
    <>
      {/* Контейнер для переключателей недель */}
      <WeekToogleContainer
        dates={dates}
        selectFn={selectFn}
      ></WeekToogleContainer>
      {/* Индикатор загрузки */}
      {isLoading && (
        <div
          data-name="data-groups"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={150}
            height={150}
            viewBox="0 0 200 200"
          >
            <radialGradient
              id="a6"
              cx=".66"
              fx=".66"
              cy=".3125"
              fy=".3125"
              gradientTransform="scale(1.5)"
            >
              <stop offset="0" stop-color="#155D5E"></stop>
              <stop offset=".3" stop-color="#155D5E" stop-opacity=".9"></stop>
              <stop offset=".6" stop-color="#155D5E" stop-opacity=".6"></stop>
              <stop offset=".8" stop-color="#155D5E" stop-opacity=".3"></stop>
              <stop offset="1" stop-color="#155D5E" stop-opacity="0"></stop>
            </radialGradient>
            <circle
              transform-origin="center"
              fill="none"
              stroke="url(#a6)"
              stroke-width="15"
              stroke-linecap="round"
              stroke-dasharray="200 1000"
              stroke-dashoffset="0"
              cx="100"
              cy="100"
              r="70"
            >
              <animateTransform
                type="rotate"
                attributeName="transform"
                calcMode="spline"
                dur="2"
                values="360;0"
                keyTimes="0;1"
                keySplines="0 0 1 1"
                repeatCount="indefinite"
              ></animateTransform>
            </circle>
            <circle
              transform-origin="center"
              fill="none"
              opacity=".2"
              stroke="#155D5E"
              stroke-width="15"
              stroke-linecap="round"
              cx="100"
              cy="100"
              r="70"
            ></circle>
          </svg>
        </div>
      )}

      {/* Контейнер для групп с датами недель */}
      {!isLoading && (
        <div
          data-name="data-groups"
          className="flex flex-col px-5 py-10 min-h-screen gap-10 overflow-y-scroll"
        >
          {groups_of_slots?.map((group) => (
            <DateGroup group={group}></DateGroup>
          ))}
        </div>
      )}
    </>
  );
};

export default Slots;
