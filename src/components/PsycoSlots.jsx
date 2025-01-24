import React from "react";
import { useEffect, useState } from "react";
// Временно удалили переключатель недель
// import WeekToogleContainer from "./WeekToogleContainer";
import DateGroupPsycoSlots from "./DateGroupPsycoSlots";
import axios from "axios";
import { startOfWeek, endOfWeek } from "date-fns";
import Button from "./Button";
import Lottie from "react-lottie";
import errorLottie from "../assets/lotties/error";
import { useSelector, useDispatch } from "react-redux";
import { setFreeSlots } from "../redux/slices/psycoSlotsSlice";
import QueryString from "qs";
import { Link } from "react-router-dom";

const PsycoSlots = () => {
  const dispatch = useDispatch();
  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  const [authState, setAuthState] = useState("");

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
  const nextWeekBorders = getWeekStartEnd(next_date);

  // Даты для поиска слотов по неделям
  // Временно заменяем 2 недели на 14 дней
  // const dates = [
  // `${currWeekBorders.monday}:${currWeekBorders.sunday}`,
  // `${nextWeekBorders.monday}:${nextWeekBorders.sunday}`,
  // ];

  const dates = [`${currWeekBorders.monday}:${nextWeekBorders.sunday}`];
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  //Таймер запроса апи (нужно для получения обновлений только нату дату, которая соответствует дате владки на которой находится пользователь)
  // const [timerRequestScheduleId, setTimerRequestScheduleId] = useState();

  // Флаг показывает загружается ли расписание или нет
  const [slotStatus, setSlotStatus] = useState("loading");

  // Получаем группы слотов и обновляем переменную groups_of_slots
  // Срабатывает когда выбирается дата в WeekToogleContainer
  function selectFn(date, secret) {
    let splited_dates = date.split(":");
    let startDate = splited_dates[0];
    let endDate = splited_dates[1];
    setSlotStatus("loading");
    // setSelectedDate(date);

    axios({
      method: "GET",
      params: {
        startDate,
        endDate,
        secret: secret,
      },
      url: "https://n8n-v2.hrani.live/webhook/get-slot",
    })
      .then((resp) => {
        if (resp.data?.error == "unauthored") {
          setAuthState("unauthored");
        }

        setGroupsOfSlots(resp.data[0].items);
        setSlotStatus("active");
        dispatch(setFreeSlots(resp.data[0].items));
      })
      .catch((thrown) => {
        setSlotStatus("error");
      });
  }

  // Запрашиваем группы слотов при загрузке страницы
  useEffect(() => {
    if (secret) {
      selectFn(selectedDate, secret);
    } else {
      setAuthState("unauthored");
      setSlotStatus("error");
    }
  }, []);

  return (
    <>
      <div className="sticky top-0">
        {/* Контейнер для переключателей недель */}
        {/* <WeekToogleContainer
          dates={dates}
          selectFn={selectFn}
        ></WeekToogleContainer> */}

        <div
          data-name="question-block"
          className="bg-white px-5 rounded-t-lg flex flex-col border-gray border-b z-10 w-full py-4 mb-4"
        >
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-dark-green">
              Внесите слоты в расписание
            </h3>
            <p className="text-gray-disabled text-base">
              Выберите один или несколько вариантов
            </p>
          </div>
        </div>
      </div>

      <div className="flex grow flex-col pb-28">
        {/* Индикатор загрузки */}
        {slotStatus == "loading" && (
          <div className="my-auto">
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
                  <stop
                    offset=".3"
                    stop-color="#155D5E"
                    stop-opacity=".9"
                  ></stop>
                  <stop
                    offset=".6"
                    stop-color="#155D5E"
                    stop-opacity=".6"
                  ></stop>
                  <stop
                    offset=".8"
                    stop-color="#155D5E"
                    stop-opacity=".3"
                  ></stop>
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
                <>
                  {authState == "unauthored" ? (
                    <p className="text-black text-center text-base">
                      Некорректная ссылка для входа. Пожалуйста, свяжитель с
                      администратором
                    </p>
                  ) : (
                    <>
                      <p className="text-black text-center text-base">
                        Мы уже в курсе проблемы и работаем над её устранением.
                        Пожалуйста повторите попытку
                      </p>
                      <Button
                        intent="cream"
                        hover="primary"
                        onClick={() => {
                          selectFn(selectedDate, secret);
                        }}
                      >
                        Повторить
                      </Button>
                    </>
                  )}
                </>
              </div>
            </div>
          </div>
        )}

        {/* Контейнер для групп с датами недель */}
        {slotStatus == "active" && (
          <div
            data-name="data-groups"
            className="slot-grid-container px-5 pt-5 pb-10 min-h-screen gap-10 "
          >
            {groups_of_slots?.map((group) => (
              <DateGroupPsycoSlots group={group}></DateGroupPsycoSlots>
            ))}
          </div>
        )}
      </div>

      {slotStatus != "error" && slotStatus != "loading" && (
        <div className="p-10 fixed bottom-0 bg-[#2c3531] w-full">
          <Link to="/slots-saved">
            <Button intent="cream">Готово</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default PsycoSlots;
