import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setAmountExpectations } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";
import { useEffect } from "react";
import axios from "axios";

const AmountExpectations = () => {
  const amountExpectations = useSelector(
    (state) => state.form.amountExpectations
  );
  const dispatch = useDispatch();
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const expectationList = [
    "За 1 сессию",
    "За 2 и более сессии",
    "За несколько месяцев",
  ];

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: {step: "Ожидания клиента", ticket_id}
    })
  }, [])

  return (
    <div className="flex grow flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            За сколько сессий вы ожидаете решить свой запрос?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {expectationList.map((expectation, index) => (
            <li key={expectation} className="mt-2">
              <Radio
                name="expectation"
                id={`expectation_${index}`}
                onChange={() => dispatch(setAmountExpectations(expectation))}
                checked={amountExpectations == expectation ? true : false}
              >
                {expectation}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AmountExpectations;
