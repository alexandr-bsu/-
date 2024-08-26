import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setAmountExpectations } from "../redux/slices/formSlice";
import Radio from "../components/Radio";

const AmountExpectations = () => {
  const amountExpectations = useSelector(
    (state) => state.form.amountExpectations
  );
  const dispatch = useDispatch();

  const expectationList = [
    "За 1 сессию",
    "За 2 и более сессии",
    "За несколько месяцев",
  ];

  return (
    <div className="flex flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            За сколько сессий вы ожидаете решить свой запрос?
          </h3>
          <p className="text-gray-disabled text-base">
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
