import React, { useState, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale/ru";
import { useDispatch, useSelector } from "react-redux";
import Button from "./Button";
import { registerForEvent, clearRegistrationStatus } from "../redux/slices/eventsSlice";
import toast, { Toaster } from "react-hot-toast";

// Функция для получения цвета модальности
function getColorByModalityLocal(modality) {
  const modalityColors = {
    jungian: "#8B5CF6",
    "юнгианство": "#8B5CF6",
    cbt: "#FCD34D",
    gestalt: "#10B981",
    psychoanalysis: "#3B82F6",
    general: "#10B981",
    "общие": "#10B981",
    other: "#6B7280",
  };
  const normalizedModality = modality?.toLowerCase();
  return modalityColors[normalizedModality] || modalityColors[modality] || "#10B981";
}

const EventViewPopup = ({ event, isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { registering, registrationSuccess, error, registeredEvents } = useSelector((state) => state.events);

  // Мемоизируем значения, чтобы избежать лишних пересчетов
  const eventDate = useMemo(() => event?.date ? new Date(event.date) : null, [event?.date]);
  const formattedDate = useMemo(() =>
    eventDate ? format(eventDate, "d MMMM yyyy", { locale: ru }) : "",
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

  return (
    <>
      <Toaster />
      <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20">
        <div className="bg-[#eed5bf] rounded-lg h-full w-full overflow-y-scroll">
          <div className="bg-[#eed5bf] sticky top-0 p-5 border-b border-b-dark-green mb-10 w-full flex justify-between items-center">
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

            {/* Тип мероприятия */}
            <div className="flex flex-col gap-1">
              <p className="text-dark-green flex gap-2">
                <b>Тип:</b> {event.event_type || event.type}
              </p>
            </div>

            {/* Модальность */}
            {event.event_modal_type && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Модальность:</b> {event.event_modal_type}
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

            {/* Организатор */}
            <div className="flex flex-col gap-1">
              <p className="text-dark-green">
                <b>{(() => {
                  const organizerType = event.organizator_type || event.organizer_role || "Организатор";
                  return organizerType.charAt(0).toUpperCase() + organizerType.slice(1);
                })()}:</b> {event.organizator_name || event.organizer_name}
              </p>
              {(event.organizator_link || event.organizer_tg_link) && (
                <a
                  href={`https://${event.organizator_link || event.organizer_tg_link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green underline"
                >
                  Telegram
                </a>
              )}
            </div>

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

            {/* Максимальное количество участников */}
            {event.max_participants && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Максимальное количество участников:</b> {event.max_participants}
                </p>
              </div>
            )}

            {/* Текущее количество участников */}
            {event.current_participants !== undefined && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Участники:</b> {event.current_participants}/{event.max_participants || 0}
                </p>
              </div>
            )}

            {/* Период повторения */}
            {event.repeat_period && (
              <div className="flex flex-col gap-1">
                <p className="text-dark-green">
                  <b>Период повторения:</b> {event.repeat_period}
                </p>
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
                  <b>Следующее аналогичное мероприятие:</b> {event.next_event}
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

            {/* Кнопка записи */}
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
              {!isRegistered && !event.registered && !event.is_canceled ? (
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
                <div className="p-3 rounded-lg bg-red text-white text-center">
                  Мероприятие отменено
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-green text-white text-center">
                  Вы записаны на это мероприятие
                </div>
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
