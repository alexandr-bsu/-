import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { CircleX } from "lucide-react";
import {
  setMark,
  setFirstPaidSessionClients,
  setPaidSessionClients
} from '@/redux/slices/psychologistFeedback'

import Radio from "@/components/Radio";
import Button from "@/components/Button";
import PopupPsyFeedback from "@/components/PopupPsyFeedback";
import TextArea from "@/components/TextArea";
const PsycologistPage = () => {
  const dispatch = useDispatch();
  const anketa = useSelector((state) => state.psyFeedback);
  const psyMarkList = ["1", "2", "3", "4", "5"];
  const checkedPsyMark = anketa.mark;
  const first_paid_clients = anketa.first_paid_session_clients;
  const paid_clients = anketa.paid_session_clients
  

  function isEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : value === "";
  }

  function removeElementAtValue(arr, value) {
    return arr.filter((element, i) => element !== value);
  }

  function getEmptyKeys(obj) {
    /** Возвращает ключи объекта, где значения пустые.
     * Значение считается пустым, если это пустой массив или пустая строка.*/
    return Object.keys(obj).filter((key) => {
      const value = obj[key];
      return isEmpty(value);
    });
  }

  function validateFields(form) {
    let emptyKeys = getEmptyKeys(form);    
    if (emptyKeys.length == 0) {
      return true;
    }

    toast(
      <div className="flex gap-4 items-center">
        <CircleX color="#fff" size={36}></CircleX>
        <div className="flex flex-col text-[#fff]">
          <p className="font-medium">Вы заполнили не все поля</p>
          <p>Пожалуйста, заполните все поля, чтобы отправить анкету</p>
        </div>
      </div>
    );

    return false;
  }

  const [showErrorBorder, setShowErrorBorder] = useState(false);
  function sendForm(form) {
    if (validateFields(form)) {
      setShowPopup(true);
    } else {
      setShowErrorBorder(true);
    }
  }

  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PopupPsyFeedback
        isVisible={showPopup}
        closeFn={() => setShowPopup(false)}
      ></PopupPsyFeedback>
      <div className="bg-dark-green w-full h-full flex flex-col justify-center items-center">
        <Toaster position="top-center"></Toaster>
        <div data-name="container" className="max-w-[800px]">
          <div data-name="header" className="flex flex-col items-center">
            <h1
              data-name="title"
              className="text-regular text-cream text-center max-md:text-left text-5xl font-medium pt-14 pb-16 px-5"
            >
              Ежемесячная обратная связь
            </h1>
            {/* <p
              data-name="description"
              className="text-regular text-corp-white text-center text-[19px] max-w-[680px] pb-16 px-5 max-md:text-left"
            >
              Заполните анкету и мы подарим вам <span className="text-cream font-medium">сертификат на бесплатное первое посещение </span> для близкого человека
            </p> */}
          </div>
          <div data-name="survey" className="flex flex-col gap-14 px-5">
          <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                {/* <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  1
                </div> */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Есть новые клиенты, с которыми вы впервые провели платные сессии в прошедшем месяце? Как их зовут?
                  </h2>
                </div>
              </div>
              <TextArea
                intent="cream"
                className={`${showErrorBorder && isEmpty(first_paid_clients) ? "border-red" : ""}`}
                value={first_paid_clients}
                onChangeFn={(e) => dispatch(setFirstPaidSessionClients(e))}
              ></TextArea>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                {/* <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  2
                </div> */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  С кем из клиентов вы продолжаете работать на платной основе?
                  </h2>
                </div>
              </div>
              <TextArea
                intent="cream"
                className={`${showErrorBorder && isEmpty(paid_clients) ? "border-red" : ""}`}
                value={paid_clients}
                onChangeFn={(e) => dispatch(setPaidSessionClients(e))}
              ></TextArea>
            </div>
          <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                {/* <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  3
                </div> */}
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Оцените по своим ощущениям, насколько вы вовлечены в жизнь сообщества?
                  </h2>
                  <p className="text-corp-white text-sm">
                  По шкале от 1 до 5 (1-вообще не вовлечён, 5-полная вовлечённость)
                  </p>
                </div>
              </div>
              <ul
                className={`flex flex-wrap gap-5 items-center p-2 ${
                  showErrorBorder && isEmpty(checkedPsyMark)
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {psyMarkList.map((mark, index) => (
                  <li>
                    <Radio
                      name="mark"
                      intent="cream"
                      id={`mark_${index}`}
                      onChange={() => dispatch(setMark(mark))}
                      checked={checkedPsyMark == mark ? true : false}
                    >
                      {mark}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
          
          </div>
          <div className="my-20 px-5">
            <Button
              intent={"cream"}
              hover={"primary"}
              onClick={() => sendForm(anketa)}
            >
              Отправить форму
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PsycologistPage;
