import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";
import { startOfWeek, endOfWeek } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { toogleSlots, toogleSlotsObject } from "../redux/slices/formSlice";
import { subHours } from "date-fns";
const DateGroup = ({ group }) => {
  const slotsRedux = useSelector((state) => state.form.slots);
  const slotsObjectsRedux = useSelector((state) => state.form.slots_objects);
  const dispatch = useDispatch();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
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
  // let currDate = new Date().toISOString().split("T")[0];
  let currDate = new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
  });

  currDate = currDate.split(", ")[0].split(".");
  currDate = currDate[2] + "-" + currDate[1] + "-" + currDate[0];

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

  const compareDatesISO = (date1, date2) => {
    return (
      new Date(date1) <=
      new Date(new Date(date2).getTime() + 3 * 60 * 60 * 1000)
    );
  };

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

  // Конвертируем текущее время в МСК
  const getMoscowTimeByLocalTime = (datetime) => {
    const userTime = new Date(datetime);
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

  // Преобразуем местное время время слота в московское время
  const convertMskSlotTimeToLocal = (date, time) => {
    const timeDifference = getTimeDifference();
    let local_datetime = new Date(date + "T" + time + ":00");
    let msk_datetime = subHours(local_datetime, getTimeDifference());
    let result = `${msk_datetime.getDate()}.${
      msk_datetime.getMonth() + 1
    } ${msk_datetime.getHours()}:00`;

    return result;
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

  return (
    <>
      {
        <>
          {getDatesBetween(currDate, nextWeekBorders.sunday).includes(
            group.date
          ) && group.date != currDate ? (
            <div
              key={group.pretty_date}
              data-name="date-group"
              className="flex flex-col gap-4 h-fit"
            >
              <h2 className="text-xl font-medium text-green pb-2 border-b border-gray w-full mb-5">
                {group.pretty_date} {capitalize(group.day_name)}
              </h2>

              {!checkDayIsBusy(group) ? (
                <ul className="slot-grid gap-2">
                  {Object.keys(group.slots).map((slotTime, index) => (
                    <>
                      {group.slots[slotTime].length != 0 && (
                        <li key={`${group.slotTime}_${index}`}>
                          {group.slots[slotTime].length == 0 ? (
                            <Button
                              size="small"
                              hover="no"
                              intent="disabled"
                              className="max-w-[140px]"
                            >
                              {slotTime}
                            </Button>
                          ) : (
                            <>
                              {compareDatesISO(
                                makeTimeInIso(group.date, slotTime),
                                getMoscowTime()
                              ) ? (
                                <Button
                                  size="small"
                                  className="max-w-[140px]"
                                  hover="no"
                                  intent="disabled"
                                >
                                  {slotTime}
                                </Button>
                              ) : (
                                <Button
                                  size="small"
                                  className="max-w-[140px]"
                                  onClick={() => {
                                    console.log(
                                      "slot_time_msk",
                                      convertMskSlotTimeToLocal(
                                        group.date,
                                        slotTime
                                      ),
                                      group.slots[slotTime]
                                    );
                                    dispatch(
                                      toogleSlots(
                                        `${convertMskSlotTimeToLocal(
                                          group.date,
                                          slotTime
                                        )}`
                                      )
                                    );

                                    dispatch(
                                      toogleSlotsObject(group.slots[slotTime][0])
                                    );

                                    console.log(slotsObjectsRedux)
                                  }}
                                  hover="no"
                                >
                                  {slotTime}
                                  {/* {slotsRedux.includes(
                                    `${convertMskSlotTimeToLocal(
                                      group.date,
                                      slotTime
                                    )}`
                                  ) ? (
                                    <Check width={20} height={20}></Check>
                                  ) : (
                                    ""
                                  )} */}

                                  {slotsObjectsRedux.findIndex(p => p == group.slots[slotTime][0].id) != -1 ? (
                                    <Check width={20} height={20}></Check>
                                  ) : (
                                    ""
                                  )}
                                </Button>
                              )}
                            </>
                          )}
                        </li>
                      )}
                    </>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-dark-green">
                  Нет окон для записи
                </p>
              )}
            </div>
          ) : (
            ""
          )}
        </>
      }
    </>
  );
};

export default DateGroup;
