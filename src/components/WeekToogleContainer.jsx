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
      className="px-5 py-3 flex gap-2 border-b border-gray items-center flex-wrap top-0 z-10 sticky w-full bg-white"
    >
      {dates.map((date, index) => (
        <li key={date} className="max-sm:grow max-sm:min-w-40">
          {index == selectedDate ? (
            <Button
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
              intent="primary-transparent"
              hower="primary"
              className="max-sm:grow max-sm:min-w-40"
              onClick={async () => {
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
