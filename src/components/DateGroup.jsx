import React from "react";
import Button from "./Button";
const DateGroup = ({ group }) => {
  function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
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
              <Button hover="no" intent="disabled">
                {slotTime}
              </Button>
            ) : (
              <Button hover="no">{slotTime}</Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DateGroup;
