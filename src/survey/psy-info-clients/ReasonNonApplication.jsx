import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setReasonNonApplication } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const ReasonNonApplication = () => {
  const reason = useSelector(
    (state) => state.formPsyClientInfo.reasonNonApplication
  );
  const dispatch = useDispatch();

  const reasonList = [
    "Проблемы сами разрешились",
    "Не было доверия",
    "Дорого",
    "Другая причина",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Почему решили не обращаться?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {reasonList.map((r, index) => (
            <li key={r} className="mt-2">
              <Radio
                name="reasonNonApplicationClient"
                id={`reason_non_application_client_${index}`}
                onChange={() => dispatch(setReasonNonApplication(r))}
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

export default ReasonNonApplication;
