import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setDurationSession } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const TherapyDuring = () => {
  const durationSession = useSelector(
    (state) => state.formPsyClientInfo.durationSession
  );
  const dispatch = useDispatch();

  const sessionDurationList = [
    "До месяца",
    "2-3 месяца",
    "До года",
    "Более года",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Сколько длилась терапия?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {sessionDurationList.map((sd, index) => (
            <li key={sd} className="mt-2">
              <Radio
                name="session_duration"
                id={`session_duration${index}`}
                onChange={() => dispatch(setDurationSession(sd))}
                checked={durationSession == sd ? true : false}
              >
                {sd}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TherapyDuring;
