import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setPricePsycho } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const PsycoPrice = () => {
  const price = useSelector((state) => state.formPsyClientInfo.pricePsycho);
  const dispatch = useDispatch();

  const priceList = [
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
            В какой ценовой категории специалиста вы искали?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {priceList.map((p, index) => (
            <li key={p} className="mt-2">
              <Radio
                name="priceClient"
                id={`price_client_${index}`}
                onChange={() => dispatch(setPricePsycho(p))}
                checked={price == p ? true : false}
              >
                {p}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PsycoPrice;
