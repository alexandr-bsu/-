import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setPriceLastSession } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const sessionPrice = () => {
  const sessionPrice = useSelector(
    (state) => state.formPsyClientInfo.priceLastSession
  );
  const dispatch = useDispatch();

  const sessionPriceList = [
    "Бесплатно",
    "Меньше 1000 руб.",
    "Меньше 3000 руб.",
    "Меньше 5000 руб.",
    "5000 руб. и более",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Сколько стоила одна сессия?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {sessionPriceList.map((sp, index) => (
            <li key={sp} className="mt-2">
              <Radio
                name="session_price"
                id={`session_price${index}`}
                onChange={() => dispatch(setPriceLastSession(sp))}
                checked={sessionPrice == sp ? true : false}
              >
                {sp}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default sessionPrice;
