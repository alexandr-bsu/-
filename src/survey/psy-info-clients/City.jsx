import React from "react";
import Input from "../../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setCity } from "../../redux/slices/formPsyClientInfoSlice";

const City = () => {
  const city = useSelector((state) => state.formPsyClientInfo.city);
  const dispatch = useDispatch();

  return (
    <div className="flex grow flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Из какого вы города?
          </h3>
        </div>
      </div>

      <div className="px-5 flex flex-col">
        <Input
          placeholder="Введите ваш город"
          value={city}
          onChangeFn={(e) => dispatch(setCity(e))}
        />
      </div>
    </div>
  );
};

export default City;
