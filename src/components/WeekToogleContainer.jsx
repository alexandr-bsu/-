import React from "react";
import Button from "./Button";
import { useState } from "react";

// Привести диапазон дат в красивый вид
function prettyDate(date) {
  let splited_dates = date.split(":");
  let startDate = new Date(splited_dates[0]);
  startDate = startDate.toLocaleString("ru-RU").slice(0, 5);
  let endDate = new Date(splited_dates[1]);
  endDate = endDate.toLocaleString("ru-RU").slice(0, 5);
  return `${startDate} - ${endDate}`;
}

const WeekToogleContainer = ({ dates, selectFn }) => {
  const [selectedDate, setSelectedDate] = useState(0);

  function onSelect(index) {
    setSelectedDate(index);
    selectFn(dates[index]);
  }

  return (
    <ul
      data-name="week-toogle-container"
      className="px-5 py-3 flex gap-2 border-b border-gray items-center z-10 sticky top-0 w-full bg-white"
    >
      {dates.map((date, index) => (
        <li key={date} className="max-sm:grow">
          {index == selectedDate ? (
            <Button
              size="small"
              intent="cream"
              hower="primary"
              onClick={() => {
                onSelect(index);
              }}
            >
              {prettyDate(date)}
            </Button>
          ) : (
            <Button
              size="small"
              intent="primary-transparent"
              hower="primary"
              className="max-sm:grow"
              onClick={() => {
                onSelect(index);
              }}
            >
              {prettyDate(date)}
            </Button>
          )}
        </li>
      ))}
    </ul>
  );
};

export default WeekToogleContainer;
