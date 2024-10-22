import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setPsychoEducated } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const PsycoEducated = () => {
  const education = useSelector(
    (state) => state.formPsyClientInfo.psychoEducated
  );
  const dispatch = useDispatch();

  const eduList = [
    "Да, я практикующий специалист",
    "Да, но работаю в другой сфере",
    "В процессе получения",
    "Нет",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">Ваш пол</h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {eduList.map((edu, index) => (
            <li key={edu} className="mt-2">
              <Radio
                name="sexClient"
                id={`sex_client_${index}`}
                onChange={() => dispatch(setPsychoEducated(edu))}
                checked={education == edu ? true : false}
              >
                {edu}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PsycoEducated;
