import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setMeetType } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const MeetType = () => {
  const meetType = useSelector((state) => state.formPsyClientInfo.meetType);
  const hasPsychoExperience = useSelector(
    (state) => state.formPsyClientInfo.hasPsychoExperience
  );
  const dispatch = useDispatch();

  const meetTypeList = ["Онлайн", "Оффлайн", "И так и так"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            {hasPsychoExperience ==
            "Да, я работал(а) с психологом/психотерапевтом"
              ? "Это были оффлайн или онлайн встречи?"
              : "Вы рассматривали возможность работы с психологом онлайн или оффлайн?"}
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {meetTypeList.map((m, index) => (
            <li key={m} className="mt-2">
              <Radio
                name="meetTypeClient"
                id={`meet_type_client_${index}`}
                onChange={() => dispatch(setMeetType(m))}
                checked={meetType == m ? true : false}
              >
                {m}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MeetType;
