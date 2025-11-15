import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";
import SlotInfoPopup from "./SlotInfoPopup";
import EventViewPopup from "./EventViewPopup";
import toast, { Toaster } from "react-hot-toast";

import { startOfWeek, endOfWeek } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  pushSlot,
  spliceSlot,
  setStateSlotLoading,
  setStateSlotOk,
} from "../redux/slices/psycoSlotsSlice";
import QueryString from "qs";

const DateGroupPsycoSlots = ({ group }) => {
  const [slotPopupData, setSlotPopupData] = React.useState({});
  const [isPopupShown, setIsPopupShown] = React.useState(false);
  const [slotPopupDate, setSlotPopupDate] = React.useState("");
  const [slotQueryDate, setSlotQueryDate] = React.useState("");
  const [slotQueryTime, setSlotQueryTime] = React.useState("");
  const [showEventPopup, setShowEventPopup] = React.useState(false);
  const [currentEvent, setCurrentEvent] = React.useState(null);

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

  // Получаем текущую дату
  let currDate = new Date().toISOString().split("T")[0];

  // Даты начала и конца следующей недели
  let next_date = new Date();
  next_date.setDate(next_date.getDate() + 7*3);
  const nextWeekBorders = getWeekStartEnd(next_date);

  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
      dates.push(currentDate.toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  const slotsRedux = useSelector((state) => state.psyco.freeSlots);
  const loadListRedux = useSelector((state) => state.psyco.loadList);
  const dispatch = useDispatch();

  const toogleSlots = (freeSlots, slot, secret) => {
    if (loadListRedux.includes(slot)) {
      return;
    }

    let index = freeSlots.findIndex((s) => s.slot == slot);
    dispatch(setStateSlotLoading(slot));

    if (index != -1) {
      let Tpromise = axios({
        url: "https://n8n-v2.hrani.live/webhook/delete-slot",

        data: {
          slot: slot,
          secret: secret,
        },

        method: "POST",
      })
        .then((resp) => {
          dispatch(setStateSlotOk(slot));
          dispatch(spliceSlot(index));
          toast.success(`Слот ${slot} удалён`);
        })
        .catch((error) => {
          dispatch(setStateSlotOk(slot));
          toast.error(`Ошибка! Слот ${slot} не удалён. Повторите попытку`);
        });
    } else {
      let Tpromise = axios({
        url: "https://n8n-v2.hrani.live/webhook/add-slot",
        // signal: AbortSignal.timeout(500),
        data: {
          secret: secret,
          slot: slot,
        },
        method: "POST",
      })
        .then((resp) => {
          dispatch(setStateSlotOk(slot));
          dispatch(pushSlot(slot));
          toast.success(`Слот ${slot} добавлен`);
        })
        .catch((error) => {
          dispatch(setStateSlotOk(slot));
          toast.error(`Ошибка! Слот ${slot} не добавлен. Повторите попытку`);
        });
    }
  };

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const compareDates = (date) => {
    let date1 = new Date(new Date().toISOString().split("T")[0]);
    let date2 = new Date(date);
    return date1 <= date2;
  };

  function getColorByModality(modality) {
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

  function getSlotStyle(slot) {
    // Проверка на клиента (приоритет 1 - важнее мероприятий)
    // Клиент всегда важнее мероприятия
    if (slot && (slot.client || slot.status == "Забронирован")) {
      return {
        backgroundColor: "#E5D5C3",
        color: "#1F4A4A",
        showCheckmark: false,
        icon: "person",
      };
    }

    // Проверка на мероприятие (приоритет 2)
    // Согласно спецификации: slot.event !== null → МЕРОПРИЯТИЕ
    if (slot && slot.event !== null && slot.event !== undefined) {
      return {
        backgroundColor: getColorByModality(slot.event.modality),
        color: "white",
        showCheckmark: true,
        icon: null,
      };
    }

    // Проверка на выбранный слот психолога
    // Это определяется через Redux state, поэтому здесь возвращаем базовый стиль
    // Логика выбора будет обработана в рендере
    return {
      backgroundColor: "white",
      color: "#1F4A4A",
      showCheckmark: false,
      icon: null,
    };
  }

  const handleCloseEventPopup = () => {
    setShowEventPopup(false);
    setCurrentEvent(null);
  };

  return (
    <>
      {isPopupShown && (
        <SlotInfoPopup
          slotDate={slotPopupDate}
          queryDate={slotQueryDate}
          queryTime={slotQueryTime}
          closeFn={() => setIsPopupShown(false)}
        ></SlotInfoPopup>
      )}

      {showEventPopup && currentEvent && (
        <EventViewPopup
          event={currentEvent}
          isOpen={showEventPopup}
          onClose={handleCloseEventPopup}
        />
      )}

      {getDatesBetween(currDate, nextWeekBorders.sunday).includes(
        group.date
      ) ? (
        <div
          key={group.pretty_date}
          data-date={group.date}
          data-name="date-group"
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl font-medium text-green pb-2 border-b border-gray w-full mb-5">
            {group.pretty_date} {capitalize(group.day_name)}
          </h2>

          <Toaster />

          <ul className="slot-grid gap-4">
            {Object.keys(group.slots).map((slotTime, index) => {
              const slotArray = group.slots[slotTime];
              const slot = slotArray.length > 0 ? slotArray[0] : null;
              
              const slotStyle = slot ? getSlotStyle(slot) : getSlotStyle({});
              const isSelectedSlot = slotsRedux.findIndex(
                (slotObject) =>
                  slotObject?.slot == `${group.pretty_date} ${slotTime}`
              ) != -1;
              const isLoading = loadListRedux.includes(
                `${group.pretty_date} ${slotTime}`
              );

              const clientSlot = slotArray.find(s => {
                if (!s) return false;
                return s.status === "Забронирован" && s.event === null;
              });

              if (clientSlot) {
                return (
                  <li key={`${group.slotTime}_${index}`}>
                    <Button
                      size="small"
                      intent="cream"
                      hover="cream"
                      onClick={() => {
                        setSlotPopupDate(`${group.pretty_date} ${slotTime}`);
                        setSlotQueryDate(group.date);
                        setSlotQueryTime(slotTime);
                        setIsPopupShown(true);
                      }}
                    >
                      {slotTime}
                      <img src="static/user.png" width={20} height={20} alt="Клиент"></img>
                    </Button>
                  </li>
                );
              }

              const eventSlot = slotArray.find(s => {
                if (!s) return false;
                return s.event !== null && s.event !== undefined;
              });
              
              if (eventSlot) {
                return (
                  <li key={`${group.slotTime}_${index}`}>
                    <Button
                      size="small"
                      hover="no"
                      onClick={() => {
                        setCurrentEvent(eventSlot.event);
                        setShowEventPopup(true);
                      }}
                      className="text-white border"
                      style={{
                        backgroundColor: getColorByModality(eventSlot.event.modality || eventSlot.event.event_modal_type),
                        color: "white",
                        borderColor: getColorByModality(eventSlot.event.modality || eventSlot.event.event_modal_type),
                      }}
                    >
                      {slotTime}
                      <Check width={20} height={20}></Check>
                    </Button>
                  </li>
                );
              }

              return (
                <li key={`${group.slotTime}_${index}`}>
                  <Button
                    size="small"
                    onClick={() => {
                      toogleSlots(
                        slotsRedux,
                        `${group.pretty_date} ${slotTime}`,
                        secret
                      );
                    }}
                    intent={
                      isSelectedSlot ? "primary" : "primary-transparent"
                    }
                  >
                    {slotTime}
                    {isLoading ? (
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
                    ) : (
                      <>
                        {isSelectedSlot && (
                          <Check width={20} height={20}></Check>
                        )}
                      </>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DateGroupPsycoSlots;
