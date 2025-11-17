import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
// Временно удалили переключатель недель
// import WeekToogleContainer from "./WeekToogleContainer";
import DateGroupPsycoSlots from "./DateGroupPsycoSlots";
import CreateEventPopup from "./CreateEventPopup";
import axios from "axios";
import { startOfWeek, endOfWeek } from "date-fns";
import Button from "./Button";
import Lottie from "react-lottie";
import errorLottie from "../assets/lotties/error";
import { useSelector, useDispatch } from "react-redux";
import { setFreeSlots } from "../redux/slices/psycoSlotsSlice";
import { fetchAllEvents } from "../redux/slices/eventsSlice";
import { formatDateForGroup } from "../api/eventsApi";
import { store } from "../redux/store";
import QueryString from "qs";
import { Link } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";

const PsycoSlots = () => {
  const dispatch = useDispatch();
  const allEvents = useSelector((state) => state.events.allEvents);
  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  const fromGroup = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.fromGroup;

  const [authState, setAuthState] = useState("");
  const [showCreateEventPopup, setShowCreateEventPopup] = useState(false);

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
  next_date.setDate(next_date.getDate() + 7 * 3);
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
  // Используем ref для предотвращения повторных вызовов без лишних зависимостей
  const isLoadingSlotsRef = useRef(false);
  const lastRequestKeyRef = useRef(null);
  const lastEventsCountRef = useRef(0);

  // Получаем группы слотов и обновляем переменную groups_of_slots
  // Срабатывает когда выбирается дата в WeekToogleContainer
  const selectFn = useCallback((date, secret) => {
    let splited_dates = date.split(":");
    let startDate = splited_dates[0];
    let endDate = splited_dates[1];

    // Создаем уникальный ключ для запроса
    const requestKey = `${startDate}_${endDate}_${secret}`;

    // Получаем текущее количество событий
    const state = store.getState();
    const currentEventsCount = state.events.allEvents.length;

    // Предотвращаем повторные вызовы с одинаковыми параметрами
    // НО разрешаем повторный вызов если события загрузились (количество изменилось)
    const eventsJustLoaded = currentEventsCount > 0 && lastEventsCountRef.current === 0;

    if (isLoadingSlotsRef.current && lastRequestKeyRef.current === requestKey && !eventsJustLoaded) {
      return;
    }

    lastEventsCountRef.current = currentEventsCount;
    isLoadingSlotsRef.current = true;
    lastRequestKeyRef.current = requestKey;
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
      .then((slotsResp) => {
        // Получаем актуальные события из Redux state напрямую (не из замыкания)
        const state = store.getState();
        const currentEvents = state.events.allEvents || [];
        console.log('Events loaded from store:', currentEvents.length, 'events');
        if (slotsResp.data?.error == "unauthored") {
          setAuthState("unauthored");
        }

        let groupsOfSlots = slotsResp.data[0].items;
        console.log('Slots loaded:', groupsOfSlots.length, 'date groups');

        if (currentEvents && currentEvents.length > 0) {
          console.log('Processing', currentEvents.length, 'events for slots...');
          const eventDates = [...new Set(currentEvents.map(event => {
            return event.date ? new Date(event.date).toISOString().split('T')[0] : null;
          }).filter(Boolean))];

          const existingDates = new Set(groupsOfSlots.map(g => g.date));
          const newGroups = [];

          eventDates.forEach(eventDate => {
            if (!existingDates.has(eventDate)) {
              const { pretty_date, day_name } = formatDateForGroup(eventDate);
              newGroups.push({
                date: eventDate,
                pretty_date: pretty_date,
                day_name: day_name,
                slots: {}
              });
            }
          });

          groupsOfSlots = [...groupsOfSlots, ...newGroups];

          groupsOfSlots = groupsOfSlots.map(group => {
            const updatedSlots = { ...group.slots };

            const eventsForThisDate = currentEvents.filter(event => {
              const eventDate = event.date ? new Date(event.date).toISOString().split('T')[0] : null;
              return eventDate === group.date;
            });

            if (eventsForThisDate.length > 0) {
              console.log(`Found ${eventsForThisDate.length} events for date ${group.date}`);
            }

            eventsForThisDate.forEach(matchingEvent => {
              const eventTime = matchingEvent.time || '';
              if (!eventTime) return;

              const slotArray = updatedSlots[eventTime] || [];

              // Проверяем, есть ли клиент в этом слоте
              // ЛОГИКА: Status = "Забронирован" и event = null → это клиент
              const hasClient = slotArray.some(s => {
                if (!s) return false;
                return s.status === "Забронирован" && s.event === null;
              });

              // Если есть клиент, не добавляем мероприятие (клиент важнее)
              if (hasClient) {
                return;
              }

              // Если массив слотов пустой, создаем новый слот с мероприятием
              if (slotArray.length === 0) {
                updatedSlots[eventTime] = [{
                  event: matchingEvent,
                  status: "Свободен",
                  date: group.date,
                  time: eventTime
                }];
              } else {
                updatedSlots[eventTime] = slotArray.map(slot => {
                  if (slot.status === "Забронирован" && slot.event === null) {
                    return slot;
                  }
                  return {
                    ...slot,
                    event: matchingEvent
                  };
                });
              }
            });

            return {
              ...group,
              slots: updatedSlots
            };
          });
        }

        setGroupsOfSlots(groupsOfSlots);
        setSlotStatus("active");
        dispatch(setFreeSlots(groupsOfSlots));
        isLoadingSlotsRef.current = false;
      })
      .catch((thrown) => {
        setSlotStatus("error");
        isLoadingSlotsRef.current = false;
      });
  }, [dispatch]); // allEvents больше не нужен, получаем из store напрямую

  // Загружаем события один раз при монтировании компонента
  useEffect(() => {
    // Redux thunk сам проверит, нужно ли загружать события
    // Вызываем только один раз при монтировании
    const loadEvents = async () => {
      await dispatch(fetchAllEvents());
    };
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей - выполнится только один раз

  // Запрашиваем группы слотов при загрузке страницы и после загрузки событий
  useEffect(() => {
    if (secret) {
      selectFn(selectedDate, secret);
    } else {
      setAuthState("unauthored");
      setSlotStatus("error");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allEvents.length]); // Перезапускаем когда события загрузятся

  function send_on_board_message() {
    axios({
      method: "POST",
      params: { secret },
      url: fromGroup == "rp" ? "https://n8n-v2.hrani.live/webhook/send-onboarding-message-after-slot-setup-rp" : fromGroup == "true" ? "https://n8n-v2.hrani.live/webhook/send-onboarding-message-after-slot-setup-supervisii" : "https://n8n-v2.hrani.live/webhook/send-onboarding-message-after-slot-setup"
    })
  }

  function send_on_fill_slots_message() {
    axios({
      method: "POST",
      params: { secret },
      url: "https://n8n-v2.hrani.live/webhook/send-slot-change-notifications"
    })
  }

  const handleCreateEvent = async (eventData) => {
    console.log("Создание мероприятия:", eventData);

    // Добавляем событие в Redux store для моментального отображения
    if (eventData.isCustomEvent) {
      // Обновляем события в Redux
      await dispatch(fetchAllEvents());

      // Перезагружаем слоты для отображения нового мероприятия
      if (secret) {
        selectFn(selectedDate, secret);
      }
    }

    setShowCreateEventPopup(false);
  };

  return (
    <>
      <Toaster position="top-center" />
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
              <DateGroupPsycoSlots key={group.date || group.pretty_date} group={group}></DateGroupPsycoSlots>
            ))}
          </div>
        )}
      </div>

      {slotStatus != "error" && slotStatus != "loading" && (
        <div className="p-5 fixed bottom-0 bg-[#2c3531] w-full">
          <div className="flex gap-3">
            <Button
              intent="primary-transparent"
              onClick={() => setShowCreateEventPopup(true)}
              className="flex-1 bg-white text-[#2c3531] border-white hover:bg-gray-100"
            >
              Создать мероприятие
            </Button>
            <Link to="/slots-saved" onClick={() => { send_on_board_message(); send_on_fill_slots_message() }} className="flex-1">
              <Button intent="cream" className="w-full">Готово</Button>
            </Link>
          </div>
        </div>
      )}

      <CreateEventPopup
        isOpen={showCreateEventPopup}
        onClose={() => setShowCreateEventPopup(false)}
        onSave={handleCreateEvent}
      />
    </>
  );
};

export default PsycoSlots;
