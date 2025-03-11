import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setHasPsychoExperience } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";
import { eachDayOfInterval } from "date-fns";

const hasDiagnsose = () => {
  const hasPsychoExperience = useSelector(
    (state) => state.formPsyClientInfo.hasPsychoExperience
  );
  const dispatch = useDispatch();

  const expList = [
    "Да, обращался(ась) ранее",
    "Да, сейчас нахожусь в терапии",
    "Нет, но рассматривал(а) такую возможность",
    "Нет"
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
          Обращались ли вы к психологу или к психотерапевту ранее?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {expList.map((e, index) => (
            <li key={e} className="mt-2">
              <Radio
                name="expClient"
                id={`exp_client_${index}`}
                onChange={() => dispatch(setHasPsychoExperience(e))}
                checked={hasPsychoExperience == e ? true : false}
              >
                {e}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default hasDiagnsose;
