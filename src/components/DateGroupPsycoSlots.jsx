import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";
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
  next_date.setDate(next_date.getDate() + 7);
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

  console.log(
    "dates",
    getDatesBetween(currDate, nextWeekBorders.sunday),
    new Date()
  );

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
        url: "https://n8n.hrani.live/webhook/delete-slot",
        // signal: AbortSignal.timeout(500), //Aborts request after 5 seconds

        data: {
          slot: slot,
          secret: secret,
        },

        method: "POST",
      })
        .then((resp) => {
          dispatch(setStateSlotOk(slot));
          dispatch(spliceSlot(index));
        })
        .catch((error) => {
          dispatch(setStateSlotOk(slot));
        });

      toast.promise(Tpromise, {
        loading: `Удаляем слот ${slot}`,
        success: `Слот ${slot} удалён`,
        error: `Ошибка! Слот ${slot} не удалён. Повторите попытку`,
      });
    } else {
      let Tpromise = axios({
        url: "https://n8n.hrani.live/webhook/add-slot",
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
        })
        .catch((error) => {
          dispatch(setStateSlotOk(slot));
        });

      toast.promise(Tpromise, {
        loading: `Добавляем слот ${slot}`,
        success: `Слот ${slot} добавлен`,
        error: `Ошибка! Слот ${slot} не добавлен. Повторите попытку`,
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

  return (
    <>
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
            {Object.keys(group.slots).map((slotTime, index) => (
              <li key={`${group.slotTime}_${index}`}>
                {group.slots[slotTime].length != 0 &&
                group.slots[slotTime][0]?.status == "Забронирован" ? (
                  <Button size="small" intent="cream" hover="no">
                    {slotTime}
                    <img src="static/user.png" width={20} height={20}></img>
                  </Button>
                ) : (
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
                      slotsRedux.findIndex(
                        (slotObject) =>
                          slotObject?.slot == `${group.pretty_date} ${slotTime}`
                      ) != -1
                        ? "primary"
                        : "primary-transparent"
                    }
                  >
                    {slotTime}
                    {/* Ставим галочку когда пользователь сам нажал на кнопку либо слот свободен */}

                    {loadListRedux.includes(
                      `${group.pretty_date} ${slotTime}`
                    ) ? (
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
                        {slotsRedux.findIndex(
                          (slotObject) =>
                            slotObject?.slot ==
                            `${group.pretty_date} ${slotTime}`
                        ) != -1 ? (
                          <>
                            <Check width={20} height={20}></Check>
                          </>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default DateGroupPsycoSlots;
