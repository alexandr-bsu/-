import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";

import { useSelector, useDispatch } from "react-redux";
import { toogleSlots } from "../redux/slices/psycoSlotsSlice";

const DateGroupPsycoSlots = ({ group }) => {
  const slotsRedux = useSelector((state) => state.psyco.freeSlots);
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
                  dispatch(toogleSlots(`${group.pretty_date} ${slotTime}`));
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
                {slotsRedux.findIndex(
                  (slotObject) =>
                    slotObject?.slot == `${group.pretty_date} ${slotTime}`
                ) != -1 ? (
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

export default DateGroupPsycoSlots;
