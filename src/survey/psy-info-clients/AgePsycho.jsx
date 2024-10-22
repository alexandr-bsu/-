import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setAgePsycho } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const AgePsycho = () => {
  const agePsycho = useSelector((state) => state.formPsyClientInfo.agePsycho);
  const dispatch = useDispatch();

  const agePsychoList = [
    "Младше меня",
    "Ровесник",
    "Незначительно старше меня",
    "Значительно старше меня",
    "Не имеет значения",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Какие предпочтения у вас относительно возраста психолога?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {agePsychoList.map((a, index) => (
            <li key={a} className="mt-2">
              <Radio
                name="ageClient"
                id={`age_client_${index}`}
                onChange={() => dispatch(setAgePsycho(a))}
                checked={agePsycho == a ? true : false}
              >
                {a}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AgePsycho;
