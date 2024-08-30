import React from "react";
import Button from "./Button";
import Check from "../assets/check.svg?react";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  pushSlot,
  spliceSlot,
  setStateSlotLoading,
  setStateSlotOk,
} from "../redux/slices/psycoSlotsSlice";

const DateGroupPsycoSlots = ({ group }) => {
  const slotsRedux = useSelector((state) => state.psyco.freeSlots);
  const loadListRedux = useSelector((state) => state.psyco.loadList);
  const dispatch = useDispatch();

  const toogleSlots = (freeSlots, slot) => {
    let index = freeSlots.findIndex((s) => s.slot == slot);
    dispatch(setStateSlotLoading(slot));

    if (index != -1) {
      axios({
        url: "https://n8n.hrani.live/webhook/delete-slot",
        data: {
          slot: slot,
          secret: "ecbb9433-1336-45c4-bb26-999aa194b3b9",
        },
        method: "POST",
      }).then((resp) => {
        dispatch(setStateSlotOk(slot));
        let indexToDelete = freeSlots.findIndex((s) => s.slot == slot);
        console.log(
          index,
          indexToDelete,
          freeSlots[index],
          freeSlots[indexToDelete]
        );
        dispatch(spliceSlot(indexToDelete));
      });
    } else {
      axios({
        url: "https://n8n.hrani.live/webhook/add-slot",
        data: {
          secret: "ecbb9433-1336-45c4-bb26-999aa194b3b9",
          slot: slot,
        },
        method: "POST",
      }).then((resp) => {
        dispatch(setStateSlotOk(slot));
        dispatch(pushSlot(slot));
      });
    }
  };

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
                  toogleSlots(slotsRedux, `${group.pretty_date} ${slotTime}`);
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

                {loadListRedux.includes(`${group.pretty_date} ${slotTime}`) ? (
                  <svg
                    height={24}
                    width={24}
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
                      <stop offset="0" stop-color="#D9B08C"></stop>
                      <stop
                        offset=".3"
                        stop-color="#D9B08C"
                        stop-opacity=".9"
                      ></stop>
                      <stop
                        offset=".6"
                        stop-color="#D9B08C"
                        stop-opacity=".6"
                      ></stop>
                      <stop
                        offset=".8"
                        stop-color="#D9B08C"
                        stop-opacity=".3"
                      ></stop>
                      <stop
                        offset="1"
                        stop-color="#D9B08C"
                        stop-opacity="0"
                      ></stop>
                    </radialGradient>
                    <circle
                      transform-origin="center"
                      fill="none"
                      stroke="url(#a12)"
                      stroke-width="30"
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
                        dur="2.5"
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
                      stroke="#D9B08C"
                      stroke-width="30"
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
                        slotObject?.slot == `${group.pretty_date} ${slotTime}`
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
  );
};

export default DateGroupPsycoSlots;
