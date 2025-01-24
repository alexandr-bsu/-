import React from "react";
import { useEffect, useState } from "react";
import { ChevronsDown } from "lucide-react";

// Временно удалили переключатель недель
// import WeekToogleContainer from "./WeekToogleContainer";
import DateGroup from "./DateGroup";
import axios from "axios";
import { startOfWeek, endOfWeek } from "date-fns";
import Button from "./Button";
import Lottie from "react-lottie";
import errorLottie from "../assets/lotties/error";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import {
  removeEmptySlots,
  setEmptySlots,
  setFilteredPsychologists,
} from "@/redux/slices/formSlice";

const Slots = () => {
  const dispatch = useDispatch();
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const formPsyClientInfo = useSelector((state) => state.formPsyClientInfo);
  const form = useSelector((state) => state.form);

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Слоты", ticket_id },
    });
  });

  const selectedPsychologistsNames = useSelector(
    (state) => state.form.selectedPsychologistsNames
  );
  // Клиент перешёл из исследовательской анкеты в заявку
  const next = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.next;

  const isNext = next == 1;

  const age = formPsyClientInfo.age;
  const ageMainForm = useSelector((state) => state.form.age);

  const errorLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: errorLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [groups_of_slots, setGroupsOfSlots] = useState([]);

  //Получаем даты начала и конца недели

  function getWeekStartEnd(date) {
    let monday = startOfWeek(date, { weekStartsOn: 1 });
    let month = monday.getMonth() + 1;
    let day = monday.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    monday = `${monday.getFullYear()}-${month}-${day}`;

    let sunday = endOfWeek(date, { weekStartsOn: 1 });
    month = sunday.getMonth() + 1;
    day = sunday.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    sunday = `${sunday.getFullYear()}-${month}-${day}`;

    return {
      monday,
      sunday,
    };
  }

  // Даты начала и конца текущей недели
  const currWeekBorders = getWeekStartEnd(new Date());

  // Даты начала и конца следующей недели
  let next_date = new Date();
  next_date.setDate(next_date.getDate() + 7*3);

  console.log('nextdate', next_date)
  const nextWeekBorders = getWeekStartEnd(next_date);
  console.log('nextWeekBorders', nextWeekBorders)

  const dates = [`${currWeekBorders.monday}:${nextWeekBorders.sunday}`];
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  // Флаг показывает загружается ли расписание или нет
  const [slotStatus, setSlotStatus] = useState("loading");

  function getAgeFilter() {
    if (isNext && !isNaN(age) && age > 0 && age < 100) {
      return age;
    }

    if (
      !isNext &&
      !isNaN(ageMainForm) &&
      ageMainForm > 0 &&
      ageMainForm < 100
    ) {
      return ageMainForm;
    }

    return undefined;
  }

  function checkNoSlots(groups) {
    let noSlots = true;
    for (let group of groups) {
      for (let slot in group.slots) {
        if (group.slots[slot].length != 0) {
          noSlots = false;
          break;
        }
      }
    }
    return noSlots;
  }

  function convertUTCDateToLocalDate(date) {
    let newDate = new Date(
      date.getTime() + date.getTimezoneOffset() * 60 * 1000
    );

    let offset = date.getTimezoneOffset() / 60;
    let hours = date.getHours();

    newDate.setHours(hours - offset);

    return newDate;
  }

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
    const timeDifference = Math.round((userTime - moscowTime) / 1000 / 60 / 60);
    return timeDifference;
  };

  // Получаем группы слотов и обновляем переменную groups_of_slots
  function selectFn(date) {
    let splited_dates = date.split(":");
    let startDate = splited_dates[0];
    let endDate = splited_dates[1];
    setSlotStatus("loading");

    axios({
      method: "POST",
      data: {
        startDate,
        endDate,
        ageFilter: getAgeFilter(),
        formPsyClientInfo,
        form,
        ticket_id,
        userTimeOffsetMsk: getTimeDifference(),
      },

      url: `https://n8n-v2.hrani.live/webhook/get-agregated-schedule-v2`,
    })
      .then((resp) => {
        let filtered_groups = remove_first_n_empty_groups(resp.data[0].items);
        setGroupsOfSlots(filtered_groups);

        if (checkNoSlots(filtered_groups)) {
          setSlotStatus("empty");
          dispatch(setEmptySlots());
        } else {
          setSlotStatus("active");

          let filtered_names = [];
          for (let group of filtered_groups) {
            for (let s in group.slots) {
              for (let p of group.slots[s]) {
                console.log("psy psy psy", p?.psychologist);
                if (!filtered_names.includes(p?.psychologist))
                  filtered_names.push(p?.psychologist);
              }
            }
          }
          dispatch(setFilteredPsychologists(filtered_names));
          dispatch(removeEmptySlots());
        }
      })
      .catch((thrown) => {
        setSlotStatus("error");
        console.log(thrown);
      });
  }

  // Получаем текущую дату
  // let currDate = new Date().toISOString().split("T")[0];
  let currDate = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
  });

  currDate = currDate.split(", ")[0].split(".");
  currDate = currDate[2] + "-" + currDate[1] + "-" + currDate[0];

  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  const compareDatesISO = (date1, date2) => {
    return (
      new Date(date1) <=
      new Date(new Date(date2).getTime() + 3 * 60 * 60 * 1000)
    );
  };

  const makeTimeInIso = (date, time) => {
    return new Date(date + "T" + time + ":00").toISOString();
  };

  // Смотрим можем ли мы записать клиента на дату
  const checkDayIsBusy = (group) => {
    for (let slotTime of Object.keys(group.slots)) {
      if (group.slots[slotTime].length != 0) {
        return false;
      }
    }

    for (let slotTime of Object.keys(group.slots)) {
      if (
        compareDatesISO(makeTimeInIso(group.date, slotTime), getMoscowTime())
      ) {
        return false;
      }
    }

    return true;
  };

  // Удаляем первые пустые группы слотов (В эти даты мы не сможем записать клиентов на приём)
  function remove_first_n_empty_groups(groups) {
    // Группы слотов попадающие под ограничения дней недели
    let filtered_groups = [];
    for (let group of groups) {
      if (
        getDatesBetween(currDate, nextWeekBorders.sunday).includes(
          group.date
        ) &&
        group.date != currDate
      ) {
        filtered_groups.push(group);
      }
    }

    // Группы слотов не попадающие под ограничение (Есть хотя бы один свободный слот)
    let free_groups = [];
    for (let group of filtered_groups) {
      if (!checkDayIsBusy(group)) {
        free_groups.push(group);
      }
    }

    // Индекс группы слотов в исходном массиве прошедший фильтрацию
    let validFirstGroupIndex = groups.findIndex(
      (g) => g.date == free_groups[0]?.date
    );

    // Возвращаем все группы слотов начиная с validFirstGroupIndex индекса
    let result = groups.slice(validFirstGroupIndex);
    return result;
  }

  // Запрашиваем группы слотов при загрузке страницы
  useEffect(() => {
    selectFn(selectedDate);
    axios({
      method: "put",
      data: { ticket_id, form, formPsyClientInfo },
      url: "https://n8n-v2.hrani.live/webhook/update-tracker",
    });
  }, []);

  return (
    <div className="flex grow flex-col">
      <div className="sticky top-0">
        <>
          {slotStatus != "empty" && (
            <div
              data-name="question-block"
              className={`bg-white px-5 ${
                !isNext ? " border-gray border-b" : ""
              } z-10 w-full py-4 `}
            >
              <div className="flex flex-col">
                <h3 className="font-medium text-base text-dark-green">
                  {slotStatus != "empty"
                    ? "Выберите подходящее время сессии."
                    : "Нет слотов"}
                </h3>
                <p className="text-gray-disabled text-base">
                  {slotStatus != "empty"
                    ? "Выберите один или несколько вариантов"
                    : ""}
                </p>
              </div>
            </div>
          )}
        </>
        {/* {isNext && !isNaN(age) && ( */}
        {/* <div className="w-full flex justify-center items-center gap-2 py-2 font-medium text-[13px] text-dark-green bg-[#d5e2e2] px-5">
          На основании вашего запроса мы подобрали для вас психологов. Выберите
          подходящее время сессии.
        </div> */}
        {/* )} */}
      </div>
      {/* Индикатор загрузки */}
      {slotStatus == "loading" && (
        <div
          data-name="data-groups"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <svg
            className="justify-self-center self-center"
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

      {slotStatus == "error" && (
        <div
          data-name="data-groups"
          className="flex flex-col items-center justify-center w-full h-full"
        >
          <div className="flex-col gap-4 p-2 max-w-[450px]">
            <Lottie options={errorLottieOptions} height={150} width={150} />
            <div className="flex flex-col items-center justify-center gap-2">
              <p className="text-black text-center font-bold text-lg">
                Произошла ошибка
              </p>
              <p className="text-black text-center text-base">
                Мы уже в курсе проблемы и работаем над её устранением.
                Пожалуйста повторите попытку
              </p>
              <Button
                intent="cream"
                hover="primary"
                onClick={() => {
                  selectFn(selectedDate);
                }}
              >
                Повторить
              </Button>
            </div>
          </div>
        </div>
      )}

      {slotStatus == "empty" && (
        <div
          data-name="data-groups"
          className="flex flex-col items-start justify-start w-full h-full p-5"
        >
          <div className="flex-col gap-4 w-full">
            <div className="flex flex-col items-start justify-start gap-2">
              <div>
                <p className="text-base mb-10 p-2 border border-green text-dark-green rounded-[15px]">
                  К сожалению, наши психологи не специализируются на вашей
                  ситуации. Но вы можете обратиться в другие организации, в
                  которых вам непременно помогут.
                </p>
              </div>

              <div className="w-full md:contact-grid-container-2 lg:contact-grid-container-2 sm:contact-grid-container-2 xs:contact-grid-container-1">
                <div
                  data-name="extra-contacts"
                  className="flex flex-col mb-5 w-full"
                >
                  <h2 className="text-black font-bold text-base">
                    Универсальные службы:
                  </h2>
                  <p>
                    <ul className="flex flex-col gap-2">
                      <li>
                        Горячая линия Центра экстренной психологической помощи
                        МЧС России{" "}
                        <span className="text-nowrap">+7 495 989-50-50</span>
                      </li>

                      <li>
                        Телефон экстренной психологической помощи для детей и
                        взрослых Института «Гармония»{" "}
                        <span className="text-nowrap">+7 800 500-22-87</span>
                      </li>
                      <li>
                        Горячая линия психологической помощи Московского
                        института психоанализа{" "}
                        <span className="text-nowrap">+7 800 500-22-87</span>
                      </li>
                    </ul>
                  </p>
                </div>

                <div data-name="extra-contacts" className="flex flex-col mb-5">
                  <h2 className="text-black font-bold text-base">
                    Помощь женщинам в кризисе:
                  </h2>

                  <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>
                        Центр «Насилию.нет»{" "}
                        <span className="text-nowrap">+7 495 916-30-00</span>
                      </li>
                      <li>
                        Телефон доверия для женщин, пострадавших от домашнего
                        насилия кризисного Центра «АННА»:
                        <span className="text-nowrap"> 8 800 7000 600 </span>
                      </li>
                    </ul>
                  </p>
                </div>

                <div data-name="extra-contacts" className="flex flex-col mb-5">
                  <h2 className="text-black  font-bold text-base">
                    Помощь людям с тяжёлыми заболеваниями:
                  </h2>
                  <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>
                        Горячая линия Центра экстренной психологической помощи
                        МЧС России +7 495 989-50-50
                      </li>
                      <li>
                        Горячая линия службы «Ясное утро»{" "}
                        <span className="text-nowrap">+7 800 100-01-91</span>
                      </li>

                      <li>
                        Горячая линия помощи неизлечимо больным людям{" "}
                        <span className="text-nowrap">+7 800 700-84-36</span>
                      </li>
                    </ul>
                  </p>
                </div>

                <div data-name="extra-contacts" className="flex flex-col mb-5">
                  <h2 className="text-black  font-bold text-base">
                    Помощь детям и подросткам:
                  </h2>
                  <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>
                        Телефон доверия для детей, подростков и их родителей{" "}
                        <span className="text-nowrap">8 800 2000 122</span>
                      </li>
                      <li>
                        Проект группы кризисных психологов из Петербурга «Твоя
                        территория.онлайн»{" "}
                        <span className="text-nowrap">+7 800 200-01-22</span>
                      </li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Контейнер для групп с датами недель */}
      {slotStatus == "active" && (
        <>
          <div
            id="data-groups"
            data-name="data-groups"
            className="slot-grid-container px-5 pt-5 pb-10 min-h-screen gap-10 overflow-y-scroll"
          > 
            {/* <pre>{JSON.stringify(groups_of_slots)}</pre> */}
            {groups_of_slots?.map((group) => (
              <DateGroup group={group}></DateGroup>
            ))}
          </div>
          <div
            id="scroll"
            className="mx-auto sticky bottom-0 pb-5 flex justify-center items-center"
          >
            <div className="p-2 rounded-full bg-gray">
              <ChevronsDown size={12} color="black" />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Slots;
