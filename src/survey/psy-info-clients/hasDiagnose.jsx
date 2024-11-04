import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setHasDiagnsose } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const hasDiagnsose = () => {
  const hasDiagnsose = useSelector(
    (state) => state.formPsyClientInfo.hasDiagnsose
  );
  const dispatch = useDispatch();

  const diagnoseList = ["Да, было", "Нет, не было"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Было ли диагностировано ли у вас какое-то психологическое
            заболевание?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {diagnoseList.map((d, index) => (
            <li key={d} className="mt-2">
              <Radio
                name="sexClient"
                id={`sex_client_${index}`}
                onChange={() => dispatch(setHasDiagnsose(d))}
                checked={hasDiagnsose == d ? true : false}
              >
                {d}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default hasDiagnsose;
