import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { CircleX } from "lucide-react";
import {
  setMark,
  setFeelings,
  setQuestions,
  setNeeds,
  setStatus,
  setWantOtherPschologist,
  setSecondSessionTime,
  setClientName,
  setPsychologistName
} from "@/redux/slices/clientFeedback";
import Radio from "@/components/Radio";
import Button from "@/components/Button";
import PopupClientFeedback from "@/components/PopupClientFeedback";
import TextArea from "@/components/TextArea";
import Input from "@/components/Input";
const PsycologistPage = () => {
  const dispatch = useDispatch();
  const anketa = useSelector((state) => state.clientFeedback);
  const clientMarkList = ["1", "2", "3", "4", "5"];
  const clientStatusList = ["Да, готов(а)", "Нет, не готов(а)"];
  const checkedClientMark = anketa.mark;
  const checkedClientStatus = anketa.status;
  const wantsOtherPsychologistList = ['Да, интересно', 'Нет, спасибо'];
  const checkedWantOtherPsychologist = anketa.wantOtherPschologist
  const secondSessionTimeList = ['Готов(а) обсудить сейчас', 'Готов(а) через неделю', 'Готов(а) через месяц', 'Не готов(а) обсуждать сроки'];
  const checkedSecondSessionTime = anketa.secondSessionTime
  const feelings = anketa.feelings;
  const questions = anketa.questions;
  const needs = anketa.needs;
  const status = anketa.status
  const clientName = anketa.clientName
  const psychologistName = anketa.psychologistName

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
    if (form.status == 'Да, готов(а)'){
      emptyKeys = removeElementAtValue(emptyKeys, "wantOtherPschologist");
    } else if(
      form.status == 'Нет, не готов(а)'
    ) {
      emptyKeys = removeElementAtValue(emptyKeys, "secondSessionTime");
    }
    
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
      <PopupClientFeedback
        isVisible={showPopup}
        closeFn={() => setShowPopup(false)}
      ></PopupClientFeedback>
      <div className="bg-dark-green w-full h-full flex flex-col justify-center items-center">
        <Toaster position="top-center"></Toaster>
        <div data-name="container" className="max-w-[800px]">
          <div data-name="header" className="flex flex-col items-center">
            <h1
              data-name="title"
              className="text-regular text-cream text-center max-md:text-left text-5xl font-medium pt-14 pb-8 px-5"
            >
              Анкета обратной связи
            </h1>
            <p
              data-name="description"
              className="text-regular text-corp-white text-center text-[19px] max-w-[680px] pb-16 px-5 max-md:text-left"
            >
              Заполните анкету и мы подарим вам <span className="text-cream font-medium">сертификат на бесплатное первое посещение </span> для близкого человека
            </p>
          </div>
          <div data-name="survey" className="flex flex-col gap-14 px-5">
          <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Как вас зовут?
                  </h2>
                </div>
              </div>
              <Input
                intent="cream"
                className={`${showErrorBorder && isEmpty(clientName) ? "border-red" : ""}`}
                value={clientName}
                onChangeFn={(e) => dispatch(setClientName(e))}
              ></Input>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Как зовут вашего психолога?
                  </h2>
                </div>
              </div>
              <Input
                intent="cream"
                className={`${showErrorBorder && isEmpty(psychologistName) ? "border-red" : ""}`}
                value={psychologistName}
                onChangeFn={(e) => dispatch(setPsychologistName(e))}
              ></Input>
            </div>

          <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  3
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Насколько вы удовлетворены прошедшей сессией?
                  </h2>
                  <p className="text-corp-white text-sm">
                  По шкале от 1 до 5
                  </p>
                </div>
              </div>
              <ul
                className={`flex flex-wrap gap-5 items-center p-2 ${
                  showErrorBorder && isEmpty(checkedClientMark)
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {clientMarkList.map((mark, index) => (
                  <li>
                    <Radio
                      name="mark"
                      intent="cream"
                      id={`mark_${index}`}
                      onChange={() => dispatch(setMark(mark))}
                      checked={checkedClientMark == mark ? true : false}
                    >
                      {mark}
                    </Radio>
                  </li>
                ))}
              </ul>
            
          </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  4
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Насколько во время сессии вы почувствовали контакт с психологом?
                  </h2>
                </div>
              </div>
              <TextArea
                intent="cream"
                className={`${showErrorBorder && isEmpty(feelings) ? "border-red" : ""}`}
                value={feelings}
                onChangeFn={(e) => dispatch(setFeelings(e))}
              ></TextArea>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  5
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Какие действия или вопросы психолога помогли вам продвинуться в вашем запросе?
                  </h2>
                </div>
              </div>
              <TextArea
                intent="cream"
                className={`${showErrorBorder && isEmpty(questions) ? "border-red" : ""}`}
                value={questions}
                onChangeFn={(e) => dispatch(setQuestions(e))}
              ></TextArea>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  6
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Чего во время сессии вам не хватило в действиях и поведении психолога?
                  </h2>
                </div>
              </div>
              <TextArea
                intent="cream"
                className={`${showErrorBorder && isEmpty(needs) ? "border-red" : ""}`}
                value={needs}
                onChangeFn={(e) => dispatch(setNeeds(e))}
              ></TextArea>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  7
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Готовы ли вы посетить следующую сессию с этим психологом?
                  </h2>
                </div>
              </div>
              <ul
                className={`flex gap-[50px] items-center p-2 ${
                  showErrorBorder && isEmpty(status)
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {clientStatusList.map((status, index) => (
                  <li>
                    <Radio
                      name="status"
                      intent="cream"
                      id={`status_${index}`}
                      onChange={() => dispatch(setStatus(status))}
                      checked={checkedClientStatus == status ? true : false}
                    >
                      {status}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
            {checkedClientStatus== "Нет, не готов(а)" &&
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  8
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Интересно ли вам было бы посетить другого психолога из нашего сообщества?
                  </h2>
                </div>
              </div>
              <ul
                className={`flex gap-[50px] items-center p-2 ${
                  showErrorBorder && isEmpty(checkedWantOtherPsychologist) && checkedClientStatus== "Нет, не готов(а)"
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {wantsOtherPsychologistList.map((w, index) => (
                  <li>
                    <Radio
                      name="wants"
                      intent="cream"
                      id={`wants_${index}`}
                      onChange={() => dispatch(setWantOtherPschologist(w))}
                      checked={checkedWantOtherPsychologist == w ? true : false}
                    >
                      {w}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>}
            {checkedClientStatus== "Да, готов(а)" &&
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  8
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                  Когда вам будет удобно обсудить запись на вторую сессию?
                  </h2>
                </div>
              </div>
              <ul
                className={`flex flex-col gap-2 p-2 ${
                  showErrorBorder && isEmpty(checkedSecondSessionTime) && checkedClientStatus== "Да, готов(а)"
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {secondSessionTimeList.map((st, index) => (
                  <li>
                    <Radio
                      name="st"
                      intent="cream"
                      id={`st_${index}`}
                      onChange={() => dispatch(setSecondSessionTime(st))}
                      checked={checkedSecondSessionTime == st ? true : false}
                    >
                      {st}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>}

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
