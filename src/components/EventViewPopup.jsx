import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/NewButon";
import Radio from "./Radio";
import { registerForEvent, clearRegistrationStatus, fetchAllEvents, cancelEventRegistration } from "../redux/slices/eventsSlice";
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

  // Состояние для открытия слота над мероприятием
  const [isOpeningSlot, setIsOpeningSlot] = useState(false);

  // Получаем secret из URL
  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  // Получаем актуальное событие из Redux store для реактивного обновления
  const currentEventFromStore = useMemo(() => {
    const eventName = event?.title || event?.name || "";
    return allEvents.find(evt =>
      evt.title === eventName ||
      evt.name === eventName ||
      evt.id === event?.id ||
      evt.slot_id === event?.slot_id
    ) || event;
  }, [allEvents, event]);

  // Мемоизируем значения, чтобы избежать лишних пересчетов
  const eventDate = useMemo(() => currentEventFromStore?.date ? new Date(currentEventFromStore.date) : null, [currentEventFromStore?.date]);
  const formattedDate = useMemo(() =>
    eventDate ? format(eventDate, "d MMMM yyyy", { locale: ru }) : "",
    [eventDate]
  );
  const formattedDateShort = useMemo(() =>
    eventDate ? format(eventDate, "dd.MM.yyyy") : "",
    [eventDate]
  );
  const eventTime = useMemo(() => currentEventFromStore?.time || "", [currentEventFromStore?.time]);
  const formattedDateStr = useMemo(() => eventDate ? format(eventDate, "yyyy-MM-dd") : "", [eventDate]);
  const eventName = useMemo(() => currentEventFromStore?.title || currentEventFromStore?.name || "", [currentEventFromStore?.title, currentEventFromStore?.name]);
  const eventRegistered = useMemo(() => currentEventFromStore?.registered || false, [currentEventFromStore?.registered]);

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
    const modality = currentEventFromStore?.event_modal_type || currentEventFromStore?.modality;
    const result = modality === "пользовательское";

    return result;
  }, [currentEventFromStore]);

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

  const modalityColor = getColorByModalityLocal(currentEventFromStore.event_modal_type || currentEventFromStore.modality);


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
        // Обновляем и локальное состояние, и Redux store
        setIsRegistered(false);
        dispatch(cancelEventRegistration({
          date: formattedDateStr,
          time: eventTime,
          eventName: eventName,
        }));

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

  // Функция для открытия слота над мероприятием
  const handleOpenSlotOverEvent = async () => {
    if (!eventDate || !eventTime || !secret) {
      toast.error("Что-то пошло не так");
      return;
    }

    if (isOpeningSlot) return;

    setIsOpeningSlot(true);

    // Форматируем дату как "dd.MM" и время как "HH:mm"
    const formattedSlotDate = format(eventDate, "dd.MM");
    const formattedSlotTime = eventTime; // Уже в формате "HH:mm"
    const slotString = `${formattedSlotDate} ${formattedSlotTime}`;

    try {
      const response = await axios.post(
        "https://n8n-v2.hrani.live/webhook/add-slot-over-event",
        {
          secret: secret,
          slot: slotString,
        }
      );

      if (response.status === 200) {
        toast.success("Слот успешно открыт для клиентов");

        // Обновляем слоты после успешного создания
        if (onEventCancelled) {
          onEventCancelled();
        }

        // Закрываем попап через небольшую задержку
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Ошибка при открытии слота:", error);
      toast.error("Ошибка при открытии слота. Попробуйте еще раз");
    } finally {
      setIsOpeningSlot(false);
    }
  };

  return (
    <>
      <Toaster />
      <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20 bg-[#000000] bg-opacity-20">
        <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-y-auto">
          <div className="bg-white sticky top-0 p-5 border-b border-b-dark-green w-full flex justify-between items-center">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-green font-bold text-2xl">
                {currentEventFromStore.title || currentEventFromStore.name}
              </h2>
              {!isCustomEvent && (
                <span
                  className="px-3 py-1 rounded-full text-white font-medium text-sm"
                  style={{ backgroundColor: modalityColor }}
                >
                  {currentEventFromStore.event_modal_type || currentEventFromStore.modality}
                </span>
              )}
            </div>
            <img
              src="static/close.png"
              className="cursor-pointer w-5 h-5"
              onClick={handleClose}
              alt="Закрыть"
            />
          </div>

          <div data-name="event-data" className="p-5 flex flex-col gap-4">
            <div data-group="section">
              {/* Дата и время */}
              <div className="flex flex-col gap-1">
                <h3 className="text-green font-bold text-[19px]">
                  {formattedDate} в {eventTime}
                </h3>
              </div>
            </div>


            {/* Описание */}
            {currentEventFromStore.description && (
              <div data-group="section">
                <div className="flex flex-col gap-1">
                  <p className="text-green text-base font-normal">{currentEventFromStore.description}</p>
                </div>
              </div>
            )}

            {!isCustomEvent && (
              <div data-group="section">
                {/* Организатор - скрыто для пользовательских событий */}
                {!isCustomEvent && (
                  <div className="flex flex-wrap">
                    <p className="text-green text-base flex items-center flex-wrap">
                      <span className="font-normal mr-1">{(() => {
                        const eventType = (currentEventFromStore.event_type || currentEventFromStore.type || "").toLowerCase();

                        // Определяем название роли согласно типу мероприятия
                        if (eventType.includes("супервизи")) {
                          return "Супервизор: ";
                        } else if (eventType.includes("интервизи")) {
                          return "Модератор: ";
                        } else {
                          return "Ведущий: ";
                        }
                      })()}</span>

                      {(currentEventFromStore.organizator_link || currentEventFromStore.organizer_tg_link) && (
                        <a
                          href={`https://${currentEventFromStore.organizator_link || currentEventFromStore.organizer_tg_link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green hover:text-green transition-colors inline-flex items-center"
                          title="Перейти на страницу психолога"
                        >
                          <span className="font-bold">{currentEventFromStore.organizator_name || currentEventFromStore.organizer_name}</span>
                          <TelegramPlane width={16} height={16} />
                        </a>
                      )}
                    </p>
                  </div>
                )}


                {/* Текущее количество участников - скрыто для пользовательских событий */}
                {currentEventFromStore.current_participants !== undefined && !isCustomEvent && (
                  <div className="flex flex-col flex-wrap">
                    <p className="text-green text-base">
                      <span className="font-normal">Участников: </span> <span className="font-bold">{currentEventFromStore.current_participants}/{currentEventFromStore.max_participants || 0}</span>
                    </p>
                  </div>
                )}


                {/* Ссылка на встречу - только для зарегистрированных */}
                {(currentEventFromStore.event_link || currentEventFromStore.meeting_link) && isRegistered && (
                  <div className="flex flex-col flex-wrap">
                    <p className="text-green text-base">
                      <span className="font-normal">Ссылка на мероприятие: </span> <a
                        href={currentEventFromStore.event_link || currentEventFromStore.meeting_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green font-bold"
                      >
                        ссылка
                      </a>
                    </p>
                  </div>
                )}

                {/* Папка с кейсами (только для supervision и intervision и только для зарегистрированных) */}
                {currentEventFromStore.event_folder &&
                  isRegistered &&
                  (currentEventFromStore.event_type === "supervision" ||
                    currentEventFromStore.event_type === "интервизия" ||
                    currentEventFromStore.event_type === "супервизия" ||
                    currentEventFromStore.event_type === "intervision") && (
                    <div className="flex flex-wrap">
                      <p className="text-green text-base">
                        <span className="font-normal">Папка с кейсами: </span> <a
                          href={currentEventFromStore.event_folder}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green font-bold"
                        >
                          ссылка
                        </a>
                      </p>
                    </div>
                  )}

              </div>)}





            {/* Период повторения
            {event.repeat_period && !isCustomEvent && (
              <div className="flex flex-col gap-1">
                <p className="text-green">
                  <b>Период повторения:</b> {event.repeat_period}
                </p>
              </div>
            )} */}



            {/* Радиокнопки режима повтора для пользовательских событий */}
            {isCustomEvent && (
              <div data-group="section">
                <div className="flex flex-col gap-3">
                  <h3 className="text-green font-medium">Режим повтора мероприятия</h3>
                  {loadingRepeatPeriod ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dark-green"></div>
                      <span className="text-green text-sm">Загрузка...</span>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-2 p-2">
                      {[
                        { value: "нет", label: "Нет" },
                        { value: "раз в неделю", label: "Раз в неделю" },
                        { value: "раз в 2 недели", label: "Раз в 2 недели" },
                        // { value: "раз в 3 недели", label: "Раз в 3 недели" },
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
                      <span className="text-green text-sm">Обновление...</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Последняя запланированная дата */}
            {/* {event.last_planed_date && (
              <div className="flex flex-col gap-1">
                <p className="text-green">
                  <b>Последняя запланированная дата:</b> {format(new Date(event.last_planed_date), "d MMMM yyyy", { locale: ru })}
                </p>
              </div>
            )} */}


            {/* Следующее мероприятие */}
            {currentEventFromStore.next_event && (
              <div data-group="section">
                <div className="flex flex-col gap-1">
                  <p className="text-green text-base">
                    <span className="font-normal">Следующее мероприятие:</span> <a
                      href="#"
                      className="cursor-pointer hover:text-green transition-colors font-bold"
                      onClick={(e) => {
                        e.preventDefault();
                        handleOpenRelatedEvent(currentEventFromStore.next_event);
                      }}
                    >
                      {currentEventFromStore.next_event}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Статус отмены */}
            {/* {event.is_canceled && (
                <div className="flex flex-col gap-1">
                  <p className="text-red font-bold">
                    <b>Мероприятие отменено</b>
                  </p>
                </div>
              )} */}



            {/* Кнопки действий */}
            <div className="flex flex-col gap-2">
              {(() => {
                console.log('EventViewPopup - button condition:', {
                  isRegistered,
                  'event.registered': event.registered,
                  'event.is_canceled': event.is_canceled,
                  shouldShowButton: !isRegistered && !event.registered && !event.is_canceled
                });
                return null;
              })()}
              {/* Проверка на запрет подключения к супервизии */}
              {!isRegistered && !currentEventFromStore.registered && !currentEventFromStore.is_canceled &&
                currentEventFromStore.allow_connect === false &&
                (currentEventFromStore.event_type || currentEventFromStore.type || "").toLowerCase().includes("супервизи") ? (
                <div className="p-3 rounded-[30px] border-2 border-green text-green">
                  К сожалению ваш тариф не включает в себя посещение супервизий
                </div>
              ) : !isRegistered && !currentEventFromStore.registered && !currentEventFromStore.is_canceled && !(currentEventFromStore.current_participants >= currentEventFromStore.max_participants) ? (
                <Button
                  variant={'primary'}
                  className="rounded-full"

                  onClick={handleRegister}
                  disabled={registering}

                >
                  {registering ? "Записываемся..." : "Записаться"}
                </Button>

              ) : currentEventFromStore.is_canceled ? (
                <div className="p-3 rounded-lg bg-red text-white">
                  Мероприятие отменено
                </div>
              ) : currentEventFromStore.current_participants >= currentEventFromStore.max_participants && !isRegistered && !currentEventFromStore.registered ? (
                <div className="p-3 rounded-[30px] border-2 border-green text-green">
                  <div className="space-y-2">
                    <p>К сожалению вы не можете записаться на это мероприятие, поскольку число желающих его посетить уже достигло максимального количества.</p>
                    {currentEventFromStore.next_event && (
                      <p>Вы можете записаться на аналогичное мероприятие по ссылке выше 🙏</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-[30px] border border-2 border-green text-green">
                  {(() => {
                    const eventType = (currentEventFromStore.event_type || currentEventFromStore.type || "").toLowerCase();
                    const organizatorName = currentEventFromStore.organizator_name || currentEventFromStore.organizer_name || "супервизора";
                    const eventFolder = currentEventFromStore.event_folder;

                    if (eventType.includes("супервизи")) {
                      return (
                        <div className="space-y-2">
                          <p className="font-semibold">Вы успешно записались на супервизию.</p>
                          <p>Ссылка будет доступна в этой карточке. В чат-бот вам придет напоминание о событии за 24 часа и за 1 час 🙏</p>
                          <p>Если вы хотите вынести кейс, то пожалуйста запишитесь в этой таблице (максимум 2 кейса на одной супервизии): <a href="https://docs.google.com/spreadsheets/d/1Brg-cz6OAp7Li3X3IrrwYPbNPGvckXRMk5fYUSbSH-E/" target="_blank" rel="noopener noreferrer" className="underline">Расписание мероприятий Сообщества Хранители</a>.</p>
                          {eventFolder && (
                            <p>Кейсы можете загрузить в папку по ссылке выше</p>
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
                            <p>Кейсы можете загрузить в папку по ссылке выше</p>
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
              {(isRegistered || currentEventFromStore.registered) && !currentEventFromStore.is_canceled && (
                <Button
                  variant={'primary'}
                  className="rounded-full"

                  onClick={handleCancelRegistration}
                  disabled={isCancelling}
                >
                  {isCancelling ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg
                        width={24}
                        height={24}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 200"
                      >
                        <radialGradient
                          id="a12"
                          cx=".66"
                          fx=".66"
                          cy=".3125"
                          fy=".3125"
                          gradientTransform="scale(1.5)"
                        >
                          <stop offset="0" stop-color="#D1A987"></stop>
                          <stop
                            offset=".3"
                            stop-color="#D1A987"
                            stop-opacity=".9"
                          ></stop>
                          <stop
                            offset=".6"
                            stop-color="#D1A987"
                            stop-opacity=".6"
                          ></stop>
                          <stop
                            offset=".8"
                            stop-color="#D1A987"
                            stop-opacity=".3"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#D1A987"
                            stop-opacity="0"
                          ></stop>
                        </radialGradient>
                        <circle
                          transform-origin="center"
                          fill="none"
                          stroke="url(#a12)"
                          stroke-width="16"
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
                          stroke="#D1A987"
                          stroke-width="16"
                          stroke-linecap="round"
                          cx="100"
                          cy="100"
                          r="70"
                        ></circle>
                      </svg>
                      Отменяем...
                    </div>
                  ) : (
                    "Отменить запись"
                  )}
                </Button>
              )}

              <Button variant="outline" className="rounded-full" onClick={handleClose}>
                Закрыть
              </Button>

              {/* Кнопка "Открыть слот для клиентов" - только для психологов */}
              {secret && !isCustomEvent && (
                <div className="flex w-full items-center p-2 justify-center">
                  <p

                    className="text-green underline cursor-pointer"
                    onClick={handleOpenSlotOverEvent}
                    disabled={isOpeningSlot}
                  >
                    {isOpeningSlot ? (

                      "Открываем..."

                    ) : (
                      "Открыть слот для клиентов"
                    )}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventViewPopup;
