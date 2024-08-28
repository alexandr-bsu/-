import React from "react";
import Input from "../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setName } from "../redux/slices/formSlice";

const Name = () => {
  const name = useSelector((state) => state.form.name);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Как вас зовут?
          </h3>
          <p className="text-gray-disabled text-base">
            Вы можете не указывать имя, если пока не готовы
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col">
        <Input
          placeholder="Введите ваше имя"
          value={name}
          onChangeFn={(e) => dispatch(setName(e))}
        />
      </div>
    </div>
  );
};

export default Name;
