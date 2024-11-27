import React from "react";
import { useEffect } from "react";
import Input from "../../components/Input";

import { useSelector, useDispatch } from "react-redux";
import { setName } from "../../redux/slices/formSlice";
import axios from "axios";

const Name = () => {
  const name = useSelector((state) => state.form.name);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: {step: "Имя клиента", ticket_id}
    })
  }, [])

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Как вас зовут?
          </h3>
          <p className="text-gray-disabled text-sm">
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
