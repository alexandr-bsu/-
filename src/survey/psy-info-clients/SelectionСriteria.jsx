import React from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  setSelectionСriteria,
  setCustomCreteria,
} from "../../redux/slices/formPsyClientInfoSlice";
import Input from "../../components/Input";
import Radio from "../../components/Radio";

const SelectionСriteria = () => {
  const criteria = useSelector(
    (state) => state.formPsyClientInfo.selectionСriteria
  );
  const customCriteria = useSelector(
    (state) => state.formPsyClientInfo.custmCreteria
  );
  const dispatch = useDispatch();

  const selectionСriteriaList = [
    "По рекомендациям знакомых",
    "Самостоятельно просматривал(а) анкеты в интернете или читал(а) отзывы",
    "Через сервис, который сам подбирает подходящего специалиста",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Как вы подбирали специалиста?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {selectionСriteriaList.map((s, index) => (
            <li key={s} className="mt-2">
              <Radio
                name="setSelectionCriteriaClient"
                id={`set_selection_criteria_client_${index}`}
                onChange={() => dispatch(setSelectionСriteria(s))}
                checked={criteria == s ? true : false}
              >
                {s}
              </Radio>
            </li>
          ))}
          <li className="mt-2 flex gap-4 h-9">
            <Radio
              name="setSelectionCriteriaClient"
              id={`set_selection_criteria_client_last`}
              onChange={() => dispatch(setSelectionСriteria("Свой вариант"))}
              checked={criteria == "Свой вариант" ? true : false}
            >
              Свой вариант
            </Radio>

            {criteria == "Свой вариант" && (
              <Input
                value={customCriteria}
                onChangeFn={(e) => dispatch(setCustomCreteria(e))}
              ></Input>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SelectionСriteria;
