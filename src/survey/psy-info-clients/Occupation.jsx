import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setOccupation } from "../../redux/slices/formPsyClientInfoSlice";
import Radio from "../../components/Radio";

const Occupation = () => {
  const occupation = useSelector((state) => state.formPsyClientInfo.occupation);
  const dispatch = useDispatch();

  const occupationList = [
    "Постоянная работа в найме",
    "Фрилансер/самозанятый/работаю на себя",
    "Предприниматель",
    "Сейчас без работы",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Какое в данный момент у вас трудовое положение?
          </h3>
          <p className="text-gray-disabled text-sm">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {occupationList.map((e, index) => (
            <li key={e} className="mt-2">
              <Radio
                name="occupationClient"
                id={`occupation_client_${index}`}
                onChange={() => dispatch(setOccupation(e))}
                checked={occupation == e ? true : false}
              >
                {e}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Occupation;
