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
              <Button size="small" hover="no" intent="disabled">
                {slotTime}
              </Button>
            ) : (
              <Button
                size="small"
                onClick={() => {
                  dispatch(toogleSlots(`${group.pretty_date} ${slotTime}`));
                }}
                hover="no"
              >
                {slotTime}
                {slotsRedux.includes(`${group.pretty_date} ${slotTime}`) ? (
                  <Check width={20} height={20}></Check>
                ) : (
                  ""
                )}
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DateGroup;
