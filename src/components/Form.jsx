import React from "react";
import Slots from "./Slots";
import Button from "./Button";
import WelcomePage from "../survey/WelcomePage";
import QuestionToPsycologist from "../survey/QuestionToPsycologist";
import AmountExpectations from "../survey/AmountExpectations";
import LastExperience from "../survey/LastExperience";
import Age from "../survey/Age";
import Name from "../survey/Name";
import AskContacts from "../survey/AskContacts";
import axios from "axios";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
const Form = ({ maxTabsCount }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.form);
  const checkedAnxieties = useSelector((state) => state.form.anxieties);
  const questionToPsycologist = useSelector(
    (state) => state.form.questionToPsycologist
  );
  const lastExperience = useSelector((state) => state.form.lastExperience);
  const amountExpectations = useSelector(
    (state) => state.form.amountExpectations
  );
  const age = useSelector((state) => state.form.age);
  const slots = useSelector((state) => state.form.slots);
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);

  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = [
    'Заполните анкету чтобы мы могли подобрать вам психолога из сообщества "Хранители"',
  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if (tabIndex == 0 && checkedAnxieties.length == 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 1 && questionToPsycologist.length == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 2 && lastExperience == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 3 && amountExpectations == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 4 && age == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 5 && slots.length == 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 6 && (contactType == "" || contact == "")) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setActiveTabIndex(tabIndex + 1);
      setShowError(false);
    }
  }

  function sendData() {
    if (activeTabIndex == 6 && (contactType == "" || contact == "")) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      dispatch(setStatus("sending"));
      axios({
        method: "POST",
        data: form,
        url: "https://n8n.hrani.live/webhook/tilda-zayavka",
      })
        .then(() => {
          dispatch(setStatus("ok"));
        })
        .catch((e) => {
          dispatch(setStatus("error"));
        });
    }
  }
  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}

      <div className="bg-white h-full rounded-lg flex flex-col relative w-full">
        <div
          data-name="header-block relative"
          className="p-5 bg-[#2c3531] sticky top-0 z-20"
        >
          <h2 className="text-[#d1e8e2] font-medium text-lg">{headers[0]}</h2>
        </div>

        <div
          data-name="error-message"
          className={`px-5 h-0 flex justify-center items-center text-white font-medium bg-[#ff2f2f] height-transition-4 ${
            showError ? "h-20" : "h-0"
          }`}
        >
          Вы не заполнили обязательное поле
        </div>

        <div className="relative h-full flex flex-col overflow-y-scroll">
          {/* Здесь размещаются вкладки */}
          {activeTabIndex == 0 && <WelcomePage></WelcomePage>}
          {activeTabIndex == 1 && (
            <QuestionToPsycologist></QuestionToPsycologist>
          )}
          {activeTabIndex == 2 && <LastExperience></LastExperience>}
          {activeTabIndex == 3 && <AmountExpectations></AmountExpectations>}
          {activeTabIndex == 4 && <Age></Age>}
          {activeTabIndex == 5 && <Slots></Slots>}
          {activeTabIndex == 6 && <AskContacts></AskContacts>}
          {activeTabIndex == 7 && <Name></Name>}

          {/* Control buttons sticky bottom-0*/}
          <div
            data-name="control-block"
            className="p-5 flex items-center flex-wrap max-sm:grow gap-4 bg-[#2c3531]   w-full z-30"
          >
            {activeTabIndex != 0 ? (
              <Button
                intent="cream-transparent"
                hower="primary"
                className="sm:max-w-64 max-sm:min-w-40 mr-auto"
                onClick={() => {
                  setActiveTabIndex(activeTabIndex - 1);
                }}
              >
                Назад
              </Button>
            ) : (
              ""
            )}
            {activeTabIndex != maxTabsCount - 1 ? (
              <Button
                intent="cream"
                hower="primary"
                className="sm:max-w-64 max-sm:min-w-40 ml-auto"
                onClick={() => {
                  showNextTab(activeTabIndex);
                }}
              >
                Вперёд
              </Button>
            ) : (
              ""
            )}

            {activeTabIndex == maxTabsCount - 1 ? (
              <Button
                intent="cream"
                hower="primary"
                className="sm:max-w-64 max-sm:min-w-40 ml-auto"
                onClick={() => {
                  sendData();
                }}
              >
                Отправить форму
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Form;
