import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setSex } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";
import axios from "axios";

const Sex = () => {
  const sex = useSelector((state) => state.formPsyClientInfo.sex);
  const ticket_id = useSelector((state) => state.form.ticket_id);

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Пол клиента", ticket_id },
    });
  }, [])
  const dispatch = useDispatch();

  const sexList = ["Мужчина", "Женщина"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">Ваш пол</h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {sexList.map((sexItem, index) => (
            <li key={sexItem} className="mt-2">
              <Radio
                name="sexClient"
                id={`sex_client_${index}`}
                onChange={() => dispatch(setSex(sexItem))}
                checked={sex == sexItem ? true : false}
              >
                {sexItem}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sex;
