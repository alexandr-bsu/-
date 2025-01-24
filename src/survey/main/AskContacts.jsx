import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setContactType, setContact } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";
import Input from "../../components/Input";
import axios from "axios";

const AskContacts = () => {
  const dispatch = useDispatch();
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);
  const ticket_id = useSelector((state) => state.form.ticket_id);

  function checkKey(event){
    var regex = new RegExp("^[a-zA-Z0-9_]+$");
      var key = event.key;
      if (!regex.test(key)) {
         event.preventDefault();
         return false;
        }
      }

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Заполнение контактов", ticket_id },
    });
  }, []);
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
          onKeyPress={(e) => checkKey(e)}
        />
      </div>
    </div>
  );
};

export default AskContacts;
