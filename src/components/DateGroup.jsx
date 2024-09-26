import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";
import { startOfWeek, endOfWeek } from "date-fns";
import { useSelector, useDispatch } from "react-redux";
import { toogleSlots } from "../redux/slices/formSlice";

const DateGroup = ({ group }) => {
  const slotsRedux = useSelector((state) => state.form.slots);
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

  const makeTimeInIso = (date, time) => {
    return new Date(date + "T" + time + ":00").toISOString();
  };

  console.log("dates", getDatesBetween(currDate, nextWeekBorders.sunday));
  return (
    <>
      {getDatesBetween(currDate, nextWeekBorders.sunday).includes(group.date) &&
      group.date != currDate ? (
        <div
          key={group.pretty_date}
          data-name="date-group"
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl font-medium text-green pb-2 border-b border-gray w-full mb-5">
            {group.pretty_date} {capitalize(group.day_name)}
          </h2>

          <ul className="slot-grid gap-4">
            {Object.keys(group.slots).map((slotTime, index) => (
              <li key={`${group.slotTime}_${index}`}>
                {group.slots[slotTime].length == 0 ? (
                  <Button size="small" hover="no" intent="disabled">
                    {slotTime}
                  </Button>
                ) : (
                  <>
                    {compareDatesISO(
                      makeTimeInIso(group.date, slotTime),
                      getMoscowTime()
                    ) ? (
                      <Button size="small" hover="no" intent="disabled">
                        {slotTime}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        onClick={() => {
                          dispatch(
                            toogleSlots(`${group.pretty_date} ${slotTime}`)
                          );
                        }}
                        hover="no"
                      >
                        {slotTime}
                        {slotsRedux.includes(
                          `${group.pretty_date} ${slotTime}`
                        ) ? (
                          <Check width={20} height={20}></Check>
                        ) : (
                          ""
                        )}
                      </Button>
                    )}
                  </>
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

export default DateGroup;
