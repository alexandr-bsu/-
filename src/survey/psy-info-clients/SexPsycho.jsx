import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setSexPsycho } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const SexPsycho = () => {
  const sexPsycho = useSelector((state) => state.formPsyClientInfo.sexPsycho);
  const dispatch = useDispatch();

  const sexPsychoList = ["Мужчина", "Женщина", "Не имеет значения"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Какие предпочтения у вас были относительно пола психолога?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {sexPsychoList.map((s, index) => (
            <li key={s} className="mt-2">
              <Radio
                name="sexPsyco"
                id={`sex_psyco_${index}`}
                onChange={() => dispatch(setSexPsycho(s))}
                checked={sexPsycho == s ? true : false}
              >
                {s}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SexPsycho;
