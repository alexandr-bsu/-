import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import Radio from "./Radio";
import { registerForEvent, clearRegistrationStatus, fetchAllEvents } from "../redux/slices/eventsSlice";
import toast, { Toaster } from "react-hot-toast";
import { toast as sonnerToast } from "sonner";
import QueryString from "qs";
import TelegramPlane from "../assets/telegram-plane.svg?react";
import axios from "axios";

// Функция для получения цвета модальности
function getColorByModalityLocal(modality) {
  const modalityColors = {
    jungian: "#8B5CF6",
    "юнгианство": "#8B5CF6",
    cbt: "#FCD34D",
    "кпт": "#FCD34D",
    gestalt: "#10B981",
    "гештальт": "#1c9140",
    "психоанализ": "#3B82F6",
    psychoanalysis: "#3B82F6",
    general: "#10B981",
    "общие": "#10B981",
    "пользовательское": "#000000",
    other: "#6B7280",
  };
  const normalizedModality = modality?.toLowerCase();
  return modalityColors[normalizedModality] || modalityColors[modality] || "#10B981";
}

const EventViewPopup = ({ event, isOpen, onClose, onOpenRelatedEvent, onEventCancelled }) => {
  const dispatch = useDispatch();
  const { registering, registrationSuccess, error, registeredEvents, allEvents } = useSelector((state) => state.events);

  // Состояние для режима повтора пользовательских событий
  const [repeatPeriod, setRepeatPeriod] = useState("нет");
  const [loadingRepeatPeriod, setLoadingRepeatPeriod] = useState(false);
  const [updatingRepeatPeriod, setUpdatingRepeatPeriod] = useState(false);

  // Состояние для отмены записи
  const [isCancelling, setIsCancelling] = useState(false);

  // Получаем secret из URL
  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  // Мемоизируем значения, чтобы избежать лишних пересчетов
  const eventDate = useMemo(() => event?.date ? new Date(event.date) : null, [event?.date]);
  const formattedDate = useMemo(() =>
    eventDate ? format(eventDate, "d MMMM yyyy", { locale: ru }) : "",
    [eventDate]
  );
  const formattedDateShort = useMemo(() =>
    eventDate ? format(eventDate, "dd.MM.yyyy") : "",
    [eventDate]
  );
  const eventTime = useMemo(() => event?.time || "", [event?.time]);
  const formattedDateStr = useMemo(() => eventDate ? format(eventDate, "yyyy-MM-dd") : "", [eventDate]);
  const eventName = useMemo(() => event?.title || event?.name || "", [event?.title, event?.name]);
  const eventRegistered = useMemo(() => event?.registered || false, [event?.registered]);

  // Проверяем регистрацию в Redux
  const checkIsRegistered = useMemo(() => {
    console.log('EventViewPopup - checking registration:', {
      eventRegistered,
      'event?.registered': event?.registered,
      eventName,
      formattedDateStr,
      eventTime,
      registeredEventsCount: registeredEvents.length
    });

    if (eventRegistered) return true;
    // Проверяем, если событие уже помечено как зарегистрированное
    if (event?.registered) return true;

    const foundInRedux = registeredEvents.some(
      (reg) =>
        reg.date === formattedDateStr &&
        reg.time === eventTime &&
        reg.eventName === eventName
    );

    console.log('EventViewPopup - registration result:', foundInRedux);
    return foundInRedux;
  }, [eventRegistered, registeredEvents, formattedDateStr, eventTime, eventName, event?.registered]);

  const [isRegistered, setIsRegistered] = useState(() => checkIsRegistered);

  // Обновляем состояние при изменении регистрации
  useEffect(() => {
    setIsRegistered(checkIsRegistered);
  }, [checkIsRegistered]);

  // Проверяем, является ли событие пользовательским
  const isCustomEvent = useMemo(() => {
    // Пользовательские события определяются по модальности "пользовательское"
    const modality = event?.event_modal_type || event?.modality;
    const result = modality === "пользовательское";



    return result;
  }, [event]);

  // Получаем актуальное состояние режима повтора для пользовательских событий
  useEffect(() => {
    const fetchRepeatPeriod = async () => {
      // Получаем ID события из различных возможных полей
      const eventId = event?.id || event?.slot_id || event?.event_id;

      if (!isCustomEvent || !eventId || !secret) return;

      setLoadingRepeatPeriod(true);
      try {
        const response = await fetch(`https://n8n-v2.hrani.live/webhook/get-root-planned-custom-event?slot=${eventId}`);
        if (response.ok) {
          const data = await response.json();
          setRepeatPeriod(data.repeat_period || "нет");

        } else {

          // Если API не поддерживает это событие, устанавливаем значение по умолчанию
          setRepeatPeriod("нет");
        }
      } catch (error) {
        console.error("Ошибка при получении режима повтора:", error);
        setRepeatPeriod("нет");
      } finally {
        setLoadingRepeatPeriod(false);
      }
    };

    if (isOpen && isCustomEvent) {
      fetchRepeatPeriod();
    }
  }, [isOpen, isCustomEvent, event?.id, event?.slot_id, event?.event_id, secret]);

  // Обработчик изменения режима повтора
  const handleRepeatPeriodChange = async (newRepeatPeriod) => {
    // Получаем ID слота для API вызовов
    const eventId = event?.id || event?.slot_id || event?.event_id;;

    if (!isCustomEvent || !eventId || !secret || updatingRepeatPeriod) return;

    setUpdatingRepeatPeriod(true);
    try {
      const response = await fetch("https://n8n-v2.hrani.live/webhook/update-plan-custom-slots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: secret,
          slot: eventId,
          repeat_period: newRepeatPeriod
        }),
      });

      if (response.ok) {
        setRepeatPeriod(newRepeatPeriod);
        sonnerToast.success(
          `Режим повтора изменен на "${newRepeatPeriod}"`,
          {
            duration: 3000,
            style: {
              background: '#10B981',
              color: 'white',
            },
          }
        );

      } else {

        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при обновлении режима повтора:", error);
      sonnerToast.error("Ошибка при изменении режима повтора. Попробуйте еще раз.");
    } finally {
      setUpdatingRepeatPeriod(false);
    }
  };

  if (!isOpen || !event) return null;

  const modalityColor = getColorByModalityLocal(event.event_modal_type || event.modality);


  const handleRegister = async () => {
    if (!eventDate || !eventTime) {
      toast.error("Не удалось определить дату или время мероприятия");
      return;
    }

    try {
      await dispatch(
        registerForEvent({
          date: formattedDateStr,
          time: eventTime,
          eventName: eventName,
        })
      ).unwrap();

      setIsRegistered(true);
      toast.success("Вы успешно записались на мероприятие!");
    } catch (err) {
      toast.error(err || "Не удалось записаться на мероприятие");
    }
  };

  const handleClose = () => {
    dispatch(clearRegistrationStatus());
    onClose();
  };

  // Функция для отмены записи на мероприятие
  const handleCancelRegistration = async () => {
    console.log("handleCancelRegistration вызвана");
    console.log("isCancelling:", isCancelling);

    if (isCancelling) return;

    // Получаем ID слота из различных возможных полей
    const slotId = event?.slot_id || event?.id || event?.event_id;

    console.log("Отладка отмены записи:", {
      slotId,
      secret,
      event,
      "event.slot_id": event?.slot_id,
      "event.id": event?.id,
      "event.event_id": event?.event_id
    });

    if (!slotId) {
      console.error("slotId не найден");
      toast.error("Не удалось определить ID слота для отмены");
      return;
    }

    if (!secret) {
      console.error("secret не найден");
      toast.error("Не найден секретный ключ");
      return;
    }

    setIsCancelling(true);

    const apiUrl = `https://n8n-v2.hrani.live/webhook/cancel-slot?slot=${slotId}&secret=${secret}`;
    console.log("Вызываем API:", apiUrl);

    try {
      const response = await axios.get(apiUrl);
      console.log("Ответ API:", response);

      if (response.status === 200) {
        // Обновляем только локальное состояние
        setIsRegistered(false);

        toast.success("Запись на мероприятие отменена", {
          duration: 4000, // 4 секунды
        });

        // Закрываем попап через небольшую задержку
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при отмене записи:", error);
      toast.error("Ошибка при отмене записи. Попробуйте еще раз");
    } finally {
      setIsCancelling(false);
    }
  };

  // Функция для поиска и открытия связанного события
  const handleOpenRelatedEvent = (eventTitle) => {
    if (!onOpenRelatedEvent) return;

    // Ищем событие в allEvents по названию
    const relatedEvent = allEvents.find(evt =>
      evt.title === eventTitle ||
      evt.name === eventTitle ||
      evt.title?.includes(eventTitle) ||
      evt.name?.includes(eventTitle)
    );

    if (relatedEvent) {
      onOpenRelatedEvent(relatedEvent);
    } else {
      // Если событие не найдено в загруженных данных, создаем базовый объект
      const basicEvent = {
        title: eventTitle,
        name: eventTitle,
        description: "Информация о событии загружается...",
        date: null,
        time: null
      };
      onOpenRelatedEvent(basicEvent);
    }
  };

  return (
    <>
      <Toaster />
      <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20 bg-[#000000] bg-opacity-20">
        <div className="bg-white rounded-[30px] w-full max-w-[960px] mx-5 max-h-[650px] overflow-y-auto">
          <div className="bg-white sticky top-0 p-5 border-b border-b-dark-green w-full flex justify-between items-center">
            <div>
              <h2 className="text-dark-green font-medium text-3xl">
                Слот на {formattedDate} {eventTime}
              </h2>
            </div>
            <img
              src="static/close.png"
              className="cursor-pointer w-5 h-5"
              onClick={handleClose}
              alt="Закрыть"
            />
          </div>

          <div data-name="event-data" className="p-5 flex flex-col gap-4">
            {/* Название мероприятия - как у пациента */}
            <div className="flex flex-col gap-1">
              <p className="text-dark-green flex gap-2">
                <b>Название:</b> {event.title || event.name}
              </p>
            </div>

            {/* Тип мероприятия - скрыто для пользовательских событий */}
            {!isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green flex gap-2">
                  <b>Мероприятие:</b> {event.event_type || event.type}
                </p>
              </div>
            )}

            {/* Модальность - скрыто для пользовательских событий */}
            {event.event_modal_type && !isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Модальность:</b>
                  <span
                    className="ml-2 px-3 py-1 rounded-full text-white font-medium text-sm"
                    style={{ backgroundColor: modalityColor }}
                  >
                    {event.event_modal_type}
                  </span>
                </p>
              </div>
            )}

            {/* Описание */}
            {event.description && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Описание:</b>
                </p>
                <p className="text-dark-green">{event.description}</p>
              </div>
            )}

            {/* Организатор - скрыто для пользовательских событий */}
            {!isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green flex items-center gap-2">
                  <b>{(() => {
                    const eventType = (event.event_type || event.type || "").toLowerCase();

                    // Определяем название роли согласно типу мероприятия
                    if (eventType.includes("супервизи")) {
                      return "Супервизор";
                    } else if (eventType.includes("интервизи")) {
                      return "Модератор";
                    } else {
                      return "Ведущий";
                    }
                  })()}:</b>

                  {(event.organizator_link || event.organizer_tg_link) && (
                    <a
                      href={`https://${event.organizator_link || event.organizer_tg_link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green hover:text-dark-green transition-colors inline-flex items-center"
                      title="Перейти на страницу психолога"
                    >
                      <span className="underline">{event.organizator_name || event.organizer_name}</span>
                      <TelegramPlane width={16} height={16} />
                    </a>
                  )}
                </p>
              </div>
            )}

            {/* Ссылка на встречу - только для зарегистрированных */}
            {(event.event_link || event.meeting_link) && isRegistered && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Ссылка на встречу:</b>
                </p>
                <a
                  href={event.event_link || event.meeting_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green underline"
                >
                  {event.event_link || event.meeting_link}
                </a>
              </div>
            )}



            {/* Текущее количество участников - скрыто для пользовательских событий */}
            {event.current_participants !== undefined && !isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Участники:</b> {event.current_participants}/{event.max_participants || 0}
                </p>
              </div>
            )}

            {/* Период повторения */}
            {event.repeat_period && !isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Период повторения:</b> {event.repeat_period}
                </p>
              </div>
            )}



            {/* Радиокнопки режима повтора для пользовательских событий */}
            {isCustomEvent && (
              <div className="flex flex-col gap-3">
                <h3 className="text-dark-green font-medium">Режим повтора мероприятия</h3>
                {loadingRepeatPeriod ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green"></div>
                    <span className="text-dark-green text-sm">Загрузка...</span>
                  </div>
                ) : (
                  <ul className="flex flex-col gap-2 p-2">
                    {[
                      { value: "нет", label: "Нет" },
                      { value: "раз в неделю", label: "Раз в неделю" },
                      { value: "раз в 2 недели", label: "Раз в 2 недели" },
                      { value: "раз в 3 недели", label: "Раз в 3 недели" },
                      { value: "раз в месяц", label: "Раз в месяц" }
                    ].map((option, index) => (
                      <li key={option.value}>
                        <Radio
                          name="repeatPeriod"
                          intent="primary"
                          id={`repeat_period_${index}`}
                          value={option.value}
                          onChange={(e) => handleRepeatPeriodChange(e.target.value)}
                          checked={repeatPeriod === option.value}
                          disabled={updatingRepeatPeriod}
                        >
                          {option.label}
                        </Radio>
                      </li>
                    ))}
                  </ul>
                )}
                {updatingRepeatPeriod && (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green"></div>
                    <span className="text-dark-green text-sm">Обновление...</span>
                  </div>
                )}
              </div>
            )}

            {/* Последняя запланированная дата */}
            {event.last_planed_date && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Последняя запланированная дата:</b> {format(new Date(event.last_planed_date), "d MMMM yyyy", { locale: ru })}
                </p>
              </div>
            )}

            {/* Папка с кейсами (только для supervision и intervision и только для зарегистрированных) */}
            {event.event_folder &&
              isRegistered &&
              (event.event_type === "supervision" ||
                event.event_type === "интервизия" ||
                event.event_type === "супервизия" ||
                event.event_type === "intervision") && (
                <div className="flex flex-col gap-1">
                  <a
                    href={event.event_folder}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green underline"
                  >
                    Папка с кейсами
                  </a>
                </div>
              )}

            {/* Следующее мероприятие */}
            {event.next_event && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Следующее аналогичное мероприятие:</b> <a
                    href="#"
                    className="underline cursor-pointer hover:text-green transition-colors"
                    onClick={(e) => {
                      e.preventDefault();
                      handleOpenRelatedEvent(event.next_event);
                    }}
                  >
                    {event.next_event}
                  </a>
                </p>
              </div>
            )}

            {/* Статус отмены */}
            {event.is_canceled && (
              <div className="flex flex-col gap-1">
                <p className="text-red font-bold">
                  <b>Мероприятие отменено</b>
                </p>
              </div>
            )}

            {/* Кнопки действий */}
            <div className="mt-4 flex flex-col gap-2">
              {(() => {
                console.log('EventViewPopup - button condition:', {
                  isRegistered,
                  'event.registered': event.registered,
                  'event.is_canceled': event.is_canceled,
                  shouldShowButton: !isRegistered && !event.registered && !event.is_canceled
                });
                return null;
              })()}
              {!isRegistered && !event.registered && !event.is_canceled && !(event.current_participants >= event.max_participants) ? (
                <Button
                  intent="primary"
                  onClick={handleRegister}
                  disabled={registering}
                  style={{
                    backgroundColor: "#204b4a",
                    borderColor: "#204b4a",
                  }}
                >
                  {registering ? "Записываемся..." : "Записаться"}
                </Button>
              ) : event.is_canceled ? (
                <div className="p-3 rounded-lg bg-red text-white">
                  Мероприятие отменено
                </div>
              ) : event.current_participants >= event.max_participants && !isRegistered && !event.registered ? (
                <div className="p-3 rounded-lg bg-green text-white">
                  <div className="space-y-2">
                    <p>К сожалению вы не можете записаться на это мероприятие, поскольку число желающих его посетить уже достигло максимального количества.</p>
                    {event.next_event && (
                      <p>Следующее аналогичное мероприятие состоится <a
                        href="#"
                        className="underline cursor-pointer hover:text-white/80 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          handleOpenRelatedEvent(event.next_event);
                        }}
                      >
                        {event.next_event}
                      </a> 🙏</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-green text-white">
                  {(() => {
                    const eventType = (event.event_type || event.type || "").toLowerCase();
                    const organizatorName = event.organizator_name || event.organizer_name || "супервизора";
                    const eventFolder = event.event_folder;

                    if (eventType.includes("супервизи")) {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold">Вы успешно записались на супервизию.</p>
                          <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                          <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества Хранители</a>.</p>
                          {eventFolder && (
                            <p>Кейсы можете загрузить в эту папку: <a href={eventFolder} target="_blank" rel="noopener noreferrer" className="underline">Супервизия_{organizatorName}_{formattedDateShort}</a></p>
                          )}
                        </div>
                      );
                    } else if (eventType.includes("интервизи")) {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold">Вы успешно записались на интервизию.</p>
                          <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                          <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества Хранители</a>.</p>
                          {eventFolder && (
                            <p>Кейсы можете загрузить в эту папку: <a href={eventFolder} target="_blank" rel="noopener noreferrer" className="underline">Интервизия_{organizatorName}_{formattedDateShort}</a></p>
                          )}
                        </div>
                      );
                    } else {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold">Вы успешно записались на мероприятие: {eventName}, которое состоится {formattedDate}.</p>
                          <p>Ссылка на мероприятие доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                        </div>
                      );
                    }
                  })()}
                </div>
              )}

              {/* Кнопка отмены записи - показывается только если пользователь записан */}
              {(() => {
                console.log('Условия для кнопки отмены:', {
                  isRegistered,
                  'event.registered': event.registered,
                  'event.is_canceled': event.is_canceled,
                  shouldShowCancelButton: (isRegistered || event.registered) && !event.is_canceled
                });
                return null;
              })()}
              {(isRegistered || event.registered) && !event.is_canceled && (
                <Button
                  intent="primary-transparent"
                  hover="primary"
                  onClick={handleCancelRegistration}
                  disabled={isCancelling}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  {isCancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        width={16}
                        height={16}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                      >
                        <radialGradient
                          id="cancelSpinner"
                          cx=".66"
                          fx=".66"
                          cy=".3125"
                          fy=".3125"
                          gradientTransform="scale(1.5)"
                        >
                          <stop offset="0" stopColor="#ef4444"></stop>
                          <stop offset=".3" stopColor="#ef4444" stopOpacity=".9"></stop>
                          <stop offset=".6" stopColor="#ef4444" stopOpacity=".6"></stop>
                          <stop offset=".8" stopColor="#ef4444" stopOpacity=".3"></stop>
                          <stop offset="1" stopColor="#ef4444" stopOpacity="0"></stop>
                        </radialGradient>
                        <circle
                          transformOrigin="center"
                          fill="none"
                          stroke="url(#cancelSpinner)"
                          strokeWidth="16"
                          strokeLinecap="round"
                          strokeDasharray="200 1000"
                          strokeDashoffset="0"
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
                          />
                        </circle>
                      </svg>
                      Отменяем...
                    </div>
                  ) : (
                    "Отменить запись"
                  )}
                </Button>
              )}

              <Button intent="cream" hover="primary" onClick={handleClose}>
                Закрыть
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventViewPopup;
