import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setContactType, setContact } from "../redux/slices/formSlice";
import Radio from "../components/Radio";
import Input from "../components/Input";

const AmountExpectations = () => {
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);
  const dispatch = useDispatch();

  const contactList = ["Телефон", "Whatsapp", "Telegram", "VK"];

  return (
    <div className="flex flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Как с вами связаться?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-10">
        <ul data-name="question-inputs">
          {contactList.map((contactT, index) => (
            <li key={contactT} className="mt-2">
              <Radio
                name="contactType"
                id={`contactType_${index}`}
                onChange={() => dispatch(setContactType(contactT))}
                checked={contactType == contactT ? true : false}
              >
                {contactT}
              </Radio>
            </li>
          ))}
        </ul>

        <Input
          placeholder="Введите ваши контактные данные"
          value={contact}
          onChangeFn={(e) => dispatch(setContact(e))}
        />
      </div>
    </div>
  );
};

export default AmountExpectations;
