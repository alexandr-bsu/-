import React from "react";
import Input from "../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setPromocode } from "../redux/slices/formSlice";

const Promocode = () => {
  const promocode = useSelector((state) => state.form.promocode);
  const dispatch = useDispatch();

  return (
    <div className="flex grow flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Введите промокод или номер подарочного сертификата
          </h3>
          <p className="text-gray-disabled text-base">
            Вы можете не указывать код, если у вас его нет
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col">
        <Input
          placeholder="Промокод или номер подарочного сертификата"
          value={promocode}
          onChangeFn={(e) => dispatch(setPromocode(e))}
        />
      </div>
    </div>
  );
};

export default Promocode;
