import React from "react";
import Input from "../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setAge } from "../redux/slices/formSlice";

const Age = () => {
  const age = useSelector((state) => state.form.age);
  const dispatch = useDispatch();

  return (
    <div className="flex grow flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">Ваш возраст</h3>
        </div>
      </div>

      <div className="px-5 flex flex-col">
        <Input
          placeholder="Введите ваш возраст"
          value={age}
          onChangeFn={(e) => dispatch(setAge(e))}
        />
      </div>
    </div>
  );
};

export default Age;
