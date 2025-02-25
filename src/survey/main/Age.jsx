import React from "react";
import { useEffect } from "react";
import Input from "../../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setAge } from "../../redux/slices/formSlice";
import axios from "axios";

const Age = () => {
  const age = useSelector((state) => state.form.age);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Возраст клиента", ticket_id },
    });
  }, []);

  return (
    <div className="flex grow flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">Сколько вам лет?</h3>
          <p className="text-gray-disabled text-sm">
            Мы учитываем ваш возраст при подборе психолога
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col">
        <Input
          type="number"
          placeholder="Введите ваш возраст"
          value={age}
          onChangeFn={(e) => dispatch(setAge(e))}
        />
      </div>
    </div>
  );
};

export default Age;
