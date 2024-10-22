import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setReasonCancel } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const ReasonCancel = () => {
  const reason = useSelector((state) => state.formPsyClientInfo.reasonCancel);
  const dispatch = useDispatch();

  const reasonList = [
    "Помогло, проблема была решена",
    "Не помогло, выбрал(а) нового",
    "Не помогло, вообще прекратил(а)",
    "Дорого",
    "Неудобно по времени/формату/месту",
    "Я всё еще в терапии",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Почему прекратили работать со специалистом?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {reasonList.map((r, index) => (
            <li key={r} className="mt-2">
              <Radio
                name="session_duration"
                id={`session_duration${index}`}
                onChange={() => dispatch(setReasonCancel(r))}
                checked={reason == r ? true : false}
              >
                {r}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReasonCancel;
