import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setContactType, setContact } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";
import Input from "../../components/Input";
import { useEffect } from "react";
import axios from "axios";

const AskContacts = () => {
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);
  const dispatch = useDispatch();
  const ticket_id = useSelector((state) => state.form.ticket_id);

// useEffect(() => {
//     axios({
//       method: "PUT",
//       url: "https://n8n.hrani.live/webhook/update-tracking-step",
//       data: {step: "Заполнение контактов", ticket_id}
//     })
//   }, [])
  // const contactList = ["Whatsapp", "Telegram"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Как с вами связаться?
          </h3>
          <p className="text-gray-disabled text-sm">
            Укажите свой номер телефона или @username в Telegram
          </p>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-10">
        <Input
          placeholder="номер телефона или @username в Telegram"
          value={contact}
          onChangeFn={(e) => dispatch(setContact(e))}
        />
      </div>
    </div>
  );
};

export default AskContacts;
