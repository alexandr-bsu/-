import React from "react";
import Checkbox from "../components/Checkbox";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { toogleAnexieties } from "../redux/slices/formSlice";

const AmountExpectations = () => {
  const checkedAnxieties = useSelector((state) => state.form.anxieties);
  const dispatch = useDispatch();

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
            Выберите один вариант ответа (радио-кнопки)
          </p>
        </div>
      </div>

      <div className="px-5"></div>
    </div>
  );
};

export default AmountExpectations;
