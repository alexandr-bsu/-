import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";

import { useSelector, useDispatch } from "react-redux";
import { toogleSlots } from "../redux/slices/formSlice";

const DateGroup = ({ group }) => {
  const slotsRedux = useSelector((state) => state.form.slots);
  const dispatch = useDispatch();

  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const compareDates = (date) => {
    let date1 = new Date(new Date().toISOString().split("T")[0]);
    let date2 = new Date(date);
    return date1 <= date2;
  };

  const compareDatesISO = (date1, date2) => {
    return new Date(date1) <= new Date(date2);
  };

  // Конвертируем текущее время в МСК
  const getMoscowTime = () => {
    const userTime = new Date();
    const userTimeZoneOffset = userTime.getTimezoneOffset() * 60 * 1000; // get user's time zone offset in milliseconds
    const moscowOffset = 3 * 60 * 60 * 1000; // Moscow is UTC+3
    const moscowTime = new Date(
      userTime.getTime() + userTimeZoneOffset + moscowOffset
    );
    return moscowTime.toISOString();
  };

  const makeTimeInIso = (date, time) => {
    return new Date(date + "T" + time + ":00").toISOString();
  };

  return (
    <>
      {compareDates(group.date) ? (
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
