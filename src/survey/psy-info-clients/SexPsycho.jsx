import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setSexPsycho } from "../../redux/slices/formPsyClientInfoSlice";
import { useEffect } from "react";
import Radio from "../../components/Radio";
import axios from "axios";

const SexPsycho = () => {
  const sexPsycho = useSelector((state) => state.formPsyClientInfo.sexPsycho);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  
    useEffect(() => {
      axios({
        method: "PUT",
        url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
        data: { step: "Пол психолога", ticket_id },
      });
    }, [])

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
          С психологом какого пола вы готовы работать?
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
