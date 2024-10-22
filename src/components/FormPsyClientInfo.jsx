import React from "react";
import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import Age from "../survey/psy-info-clients/Age";
import City from "../survey/psy-info-clients/City";
import Sex from "../survey/psy-info-clients/Sex";
import PsycoEducated from "../survey/psy-info-clients/PsycoEducated";
import Anxieties from "../survey/psy-info-clients/Anxieties";
import HasDiagnsose from "../survey/psy-info-clients/hasDiagnose";
import HasPsychoExperience from "../survey/psy-info-clients/HasPsychoExperience";
import MeetTypeComponent from "../survey/psy-info-clients/MeetType";
import SelectionСriteria from "../survey/psy-info-clients/SelectionСriteria";
import Importance from "../survey/psy-info-clients/Importance";
import PsycoPrice from "../survey/psy-info-clients/PsycoPrice";
import ReasonNonApplication from "../survey/psy-info-clients/ReasonNonApplication";
import AskContacts from "../survey/psy-info-clients/AskContacts";
import AgePsycho from "../survey/psy-info-clients/AgePsycho";
import SexPsycho from "../survey/psy-info-clients/SexPsycho";
import SessionPrice from "../survey/psy-info-clients/SessionPrice";
import TherapyDuring from "../survey/psy-info-clients/TherapyDuring";
import ReasonCancel from "../survey/psy-info-clients/ReasonCancel";
const FormPsyClientInfo = ({ maxTabsCount }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.formPsyClientInfo);
  const isHasPsychoExperience =
    form.hasPsychoExperience == "Да, я работал(а) с психологом/психотерапевтом";
  const age = form.age;
  const city = form.city;
  const sex = form.sex;
  const psychoEducated = form.psychoEducated;
  const hasDiagnsose = form.hasDiagnsose;
  const hasPsychoExperience = form.hasPsychoExperience;
  const meetType = form.meetType;
  const selectionСriteria = form.selectionСriteria;
  const custmCreteria = form.custmCreteria;
  const importancePsycho = form.importancePsycho;
  const customImportance = form.customImportance;
  const agePsycho = form.agePsycho;
  const sexPsyco = form.sexPsyco;
  const priceLastSession = form.priceLastSession;
  const durationSession = form.durationSession;
  const reasonCancel = form.reasonCancel;
  const pricePsycho = form.pricePsycho;
  const reasonNonApplication = form.reasonNonApplication;
  const contactType = form.contactType;
  const contact = form.contact;
  const name = form.name;
  const checkedAnxieties = form.anxieties;
  const customAnexiety = form.customAnexiety;

  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = ["Анкета для исследования опыта работы с психологами"];
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if (tabIndex == 0 && age == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 1 && city == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 2 && sex == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 3 && psychoEducated == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 4 &&
        JSON.stringify(checkedAnxieties) == JSON.stringify([])) ||
      (tabIndex == 4 &&
        checkedAnxieties.includes("Свой вариант") &&
        customAnexiety == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 5 && hasDiagnsose == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 6 && hasPsychoExperience == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 7 && meetType == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 8 && selectionСriteria == "") ||
      (tabIndex == 8 &&
        custmCreteria == "" &&
        selectionСriteria == "Свой вариант")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 9 &&
        JSON.stringify(importancePsycho) == JSON.stringify([])) ||
      (tabIndex == 9 &&
        importancePsycho.includes("Свой вариант") &&
        customImportance == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 10 && pricePsycho == "" && !isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 10 && agePsycho == "" && isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      tabIndex == 11 &&
      reasonNonApplication == "" &&
      !isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 11 && sexPsyco == "" && isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      tabIndex == 12 &&
      priceLastSession == "" &&
      isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      tabIndex == 13 &&
      durationSession == "" &&
      isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 14 && reasonCancel == "" && isHasPsychoExperience) {
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
    // Парсим utm метки
    const utm_client = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_client;

    const utm_tarif = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_tarif;

    const utm_campaign = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_campaign;

    const utm_content = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_content;

    const utm_medium = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_medium;

    const utm_source = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_source;

    const utm_term = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_term;

    const utm_psy = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_psy;

    let data = {
      ...form,
      utm_client,
      utm_tarif,
      utm_campaign,
      utm_content,
      utm_medium,
      utm_source,
      utm_term,
      utm_psy,
    };
    if (!isHasPsychoExperience) {
      data["anxieties"] = [];
    }
    dispatch(setStatus("sending"));
    axios({
      method: "POST",
      data: data,
      url: "https://n8n.hrani.live/webhook/research-tilda-zayavka",
    })
      .then(() => {
        dispatch(setStatus("ok"));
      })
      .catch((e) => {
        dispatch(setStatus("error"));
      });
  }

  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}

      <div className="bg-white h-full flex flex-col relative w-full">
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

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
          {activeTabIndex == 0 && <Age />}
          {activeTabIndex == 1 && <City />}
          {activeTabIndex == 2 && <Sex />}
          {activeTabIndex == 3 && <PsycoEducated />}
          {activeTabIndex == 4 && <Anxieties />}
          {activeTabIndex == 5 && <HasDiagnsose />}
          {activeTabIndex == 6 && <HasPsychoExperience />}
          {activeTabIndex == 7 && <MeetTypeComponent />}
          {activeTabIndex == 8 && <SelectionСriteria />}
          {activeTabIndex == 9 && <Importance />}
          {!isHasPsychoExperience && activeTabIndex == 10 && <PsycoPrice />}
          {isHasPsychoExperience && activeTabIndex == 10 && <AgePsycho />}
          {!isHasPsychoExperience && activeTabIndex == 11 && (
            <ReasonNonApplication />
          )}
          {isHasPsychoExperience && activeTabIndex == 11 && <SexPsycho />}
          {!isHasPsychoExperience && activeTabIndex == 12 && <AskContacts />}
          {isHasPsychoExperience && activeTabIndex == 12 && <SessionPrice />}
          {isHasPsychoExperience && activeTabIndex == 13 && <TherapyDuring />}
          {isHasPsychoExperience && activeTabIndex == 14 && <ReasonCancel />}
          {isHasPsychoExperience && activeTabIndex == 15 && <AskContacts />}
        </div>

        {/* Control buttons  */}
        <div
          data-name="control-block"
          className="p-5 flex items-center sticky bottom-0 flex-wrap-reverse gap-4 bg-[#2c3531] w-full z-30"
        >
          {activeTabIndex != 0 ? (
            <Button
              size="small"
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
              size="small"
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
              size="small"
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
    </>
  );
};

export default FormPsyClientInfo;
