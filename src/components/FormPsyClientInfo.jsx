import React from "react";
import Button from "./Button";
import axios from "axios";
import { useState } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import { setRid, setBid } from "../redux/slices/formSlice";
import Age from "../survey/psy-info-clients/Age";
import City from "../survey/psy-info-clients/City";
import Sex from "../survey/psy-info-clients/Sex";
import PsycoEducated from "../survey/psy-info-clients/PsycoEducated";
// import Anxieties from "../survey/psy-info-clients/Anxieties";
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
import Occupation from "@/survey/psy-info-clients/Occupation";
const FormPsyClientInfo = ({ maxTabsCount }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.formPsyClientInfo);
  const formMainanxieties = useSelector((state) => state.form.anxieties);
  const isHasPsychoExperience =
    form.hasPsychoExperience == "Да, я работал(а) с психологом/психотерапевтом";
  const age = form.age;
  const is_adult = form.is_adult;
  const city = form.city;
  const sex = form.sex;
  const psychoEducated = form.psychoEducated;
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
  // const contactType = form.contactType;
  // const contact = form.contact;
  // const name = form.name;
  // const checkedAnxieties = form.anxieties;
  // const customAnexiety = form.customAnexiety;
  // const is_last_page = form.is_last_page;
  const occupation = form.occupation;
  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = ["Анкета для исследования опыта работы с психологами"];
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
  if (tabIndex == 0 && city == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    
    } else if (tabIndex == 1 && psychoEducated == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 2 && hasPsychoExperience == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 3 && meetType == "") {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 4 && selectionСriteria == "") ||
      (tabIndex == 4 &&
        custmCreteria == "" &&
        selectionСriteria == "Свой вариант")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    
    } else if (tabIndex == 5 && pricePsycho == "" && !isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      tabIndex == 6 &&
      reasonNonApplication == "" &&
      !isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 7 && occupation == "" && !isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }  else if (
      tabIndex == 5 &&
      priceLastSession == "" &&
      isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      tabIndex == 6 &&
      durationSession == "" &&
      isHasPsychoExperience
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 7 && reasonCancel == "" && isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (tabIndex == 8 && occupation == "" && isHasPsychoExperience) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setActiveTabIndex(tabIndex + 1);
      setShowError(false);
    }
  }

  // function showNextTab(tabIndex) {
  //   // Валидация перед переходом на следущую вкладку
  //   if (tabIndex == 0 && hasPsychoExperience == "") {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
    
  //   } else if ((tabIndex == 1 && importancePsycho.length == 0) || (importancePsycho.includes('Свой вариант') && customImportance == '') ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } else if (tabIndex == 2 && occupation == "") {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } 
  //   else {
  //     // alert(activeTabIndex)
  //     setActiveTabIndex(tabIndex + 1);
  //     setShowError(false);
  //   }
  // }

  function getRowId() {
    axios
      .get("https://n8n-v2.hrani.live/webhook/get-sheets-row-number")
      .then((response) => {
        dispatch(setRid(response.data.rowId));
        dispatch(setBid(response.data.baserowId));
      });
  }
  function _sendData() {
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

    const referer = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.referer;

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
      referer,
    };

    data["anxieties"] = formMainanxieties;

    // if (!is_adult) {
      // dispatch(setStatus("sending"));
    // }

    axios({
      method: "POST",
      data: data,
      url: "https://n8n-v2.hrani.live/webhook/research-tilda-zayavka",
    })
      .then(() => {
        if (!is_adult) {
          dispatch(setStatus("ok"));
          getRowId();
        }
      })
      .catch((e) => {
        dispatch(setStatus("error"));
      });
  }

  function sendData() {
    if ((activeTabIndex == 8 && occupation == "" && isHasPsychoExperience) || (activeTabIndex == 7 && occupation == "" && !isHasPsychoExperience)) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      _sendData();
    }
  }

  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}
  
      <div className="bg-white  rounded-[30px] h-full flex flex-col relative w-full">
        <div
          data-name="header-block relative"
          className="p-5 bg-[#2c3531] sticky top-0 z-20 rounded-t-[30px]"
        >
          <h2 className="text-[#d1e8e2] font-medium text-base">{headers[0]}</h2>
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
          {activeTabIndex == 0 && <City />}
          {activeTabIndex == 1 && <PsycoEducated />}
          {activeTabIndex == 2 && <HasPsychoExperience />}
          {activeTabIndex == 3 && <MeetTypeComponent />}
          {activeTabIndex == 4 && <SelectionСriteria />}
          {/* {activeTabIndex == 7 && <Importance />} */}
          {!isHasPsychoExperience && activeTabIndex == 5 && <PsycoPrice />}
          {/* {isHasPsychoExperience && activeTabIndex == 6 && <AgePsycho />} */}
          {!isHasPsychoExperience && activeTabIndex == 6 && (
            <ReasonNonApplication />
          )}
          {/* {isHasPsychoExperience && activeTabIndex == 9 && <SexPsycho />} */}
          {!isHasPsychoExperience && activeTabIndex == 7 && <Occupation />}
          {!isHasPsychoExperience && activeTabIndex == 8 && (
            <AskContacts
              sendFn={() => _sendData()}
              showOkFn={() => dispatch(setStatus("ok"))}
            />
          )}
          {isHasPsychoExperience && activeTabIndex == 5 && <SessionPrice />}
          {isHasPsychoExperience && activeTabIndex == 6 && <TherapyDuring />}
          {isHasPsychoExperience && activeTabIndex == 7 && <ReasonCancel />}
          {isHasPsychoExperience && activeTabIndex == 8 && <Occupation />}
          {isHasPsychoExperience && activeTabIndex == 9 && (
            <AskContacts
              sendFn={() => _sendData()}
              showOkFn={() => dispatch(setStatus("ok"))}
            />
          )}
          {/* {activeTabIndex == 0 && <HasPsychoExperience />}
          {activeTabIndex == 1 && <Importance/>}
          {activeTabIndex == 2 && <Occupation />}
          {activeTabIndex == 3 && (
            <AskContacts
              sendFn={() => _sendData()}
              showOkFn={() => dispatch(setStatus("ok"))}
            />
          )}  */}
        </div>

        {/* Control buttons  */}
        <div
          data-name="control-block"
          className="p-5 flex items-center sticky bottom-0 gap-4 bg-[#2c3531] w-full z-30 rounded-b-[30px]"
        >
          {activeTabIndex != 0 ? (
            <Button
              size="small"
              intent="cream-transparent"
              hower="primary"
              className="sm:max-w-40 max-sm:max-w-fit mr-auto text-sm"
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
              className="sm:max-w-40 max-sm:max-w-fit ml-auto text-sm"
              onClick={() => {
                showNextTab(activeTabIndex);
              }}
            >
              Вперёд
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