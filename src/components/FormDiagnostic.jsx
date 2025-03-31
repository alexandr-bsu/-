import React from "react";
import SlotsDiagnostic from "./SlotsDiagnostic";
import Button from "./Button";
import AmountExpectations from "../survey/main/AmountExpectations";
import LastExperience from "../survey/main/LastExperience";
import Age from "../survey/main/Age";
import Name from "../survey/main/Name";
import Promocode from "../survey/main/Promocode";
import AskContacts from "../survey/main/AskContacts";
import axios from "axios";
import { useState } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import { setPromocode } from "@/redux/slices/formSlice";
import Diagnoses from "../survey/main/Diagnoses";
import ClientSatate from "../survey/main/ClientsStates";
import TraumaticEvents from "../survey/main/TraumaticEvents";
import Questions from "../survey/main/Questions";
import PsychologistCategory from '../survey/main/PsychologistCategory'
import QuestionToPsychologist from "@/survey/main/QuestionToPsycologist";
import Sex from "@/survey/psy-info-clients/Sex";
import SexPsycho from "@/survey/psy-info-clients/SexPsycho";
import Importance from "@/survey/psy-info-clients/Importance";

const Form = ({ maxTabsCount }) => {
  const dispatch = useDispatch();
  const problemFromQuery = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.problem;

  // Клиент перешёл из исследовательской анкеты в заявку
  const next = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.next;

  const isNext = next == 1;

  const form = useSelector((state) => state.form);
  const bid = form.bid;
  const rid = form.rid;
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const formPsyClientInfo = useSelector((state) => state.formPsyClientInfo);
  
  const lastExperience = useSelector((state) => state.form.lastExperience);
  const amountExpectations = useSelector(
    (state) => state.form.amountExpectations
  );
  const age = useSelector((state) => state.form.age);
  const slots = useSelector((state) => state.form.slots);
  const selectedPsychologistsNames = useSelector(
    (state) => state.form.selectedPsychologistsNames
  );
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);

  const questions = form.questions;
  const customQuestion = form.customQuestion;
  const categoryType = form.categoryType

  const questionToPsychologist = form.question_to_psychologist
  const diagnoseMedicaments = form.diagnoseMedicaments
  const diagnose = form.diagnoses

  const client_sex = formPsyClientInfo.sex
  const psychologist_sex = formPsyClientInfo.sexPsycho

  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = ["Независимая диагностика запроса от Хранителей", "Независимая диагностика запроса от Хранителей"];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const areSlotsEmpty = useSelector((state) => state.form.emptySlots);

  function setGoalReached(tabIndex) {
    let counter_number = 96890969;
    if (tabIndex == 1 && problemFromQuery === undefined) {
      ym(counter_number, "reachGoal", "prichina");
      // alert("prichina long");
    } else if (tabIndex == 4 && problemFromQuery == undefined) {
      ym(counter_number, "reachGoal", "promo");
      // alert("promo short");
    } else if (tabIndex == 7 && problemFromQuery == undefined) {
      // alert("svyaz long");
      ym(counter_number, "reachGoal", "svyaz");
    } else if (problemFromQuery != undefined && tabIndex == 5) {
      // alert("svyaz short");
      ym(counter_number, "reachGoal", "svyazshort");
    } else if (problemFromQuery !== undefined && tabIndex == 1) {
      ym(counter_number, "reachGoal", "skolko");
      // alert("skolko short");
    } else if (problemFromQuery !== undefined && tabIndex == 3) {
      ym(counter_number, "reachGoal", "age");
      // alert("age short");
    }
  }

  // function showNextTab(tabIndex) {
  //   // Валидация перед переходом на следущую вкладку
  //   if(tabIndex == 0 && (diagnose.length == 0 || (diagnose[0] != "Нет" && diagnoseMedicaments == ''))){
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   }
  //   else if (tabIndex == 3 && questionToPsychologist == "") {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } else if (
  //     (tabIndex == 4 || (problemFromQuery !== undefined && tabIndex == 4)) &&
  //     lastExperience == "" &&
  //     !isNext
  //   ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } 
  //   // else if (
  //   //   (tabIndex == 5 ||
  //   //     (problemFromQuery !== undefined && tabIndex == 5) ||
  //   //     (isNext && tabIndex == 4)) &&
  //   //   amountExpectations == ""
  //   // ) {
  //   //   setShowError(true);
  //   //   setTimeout(() => {
  //   //     setShowError(false);
  //   //   }, 3000);
  //   // }
  //    else if (
  //     (tabIndex == 6 || (problemFromQuery !== undefined && tabIndex == 6)) &&
  //     !isNext &&
  //     age == ""
  //   ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);

  //   }
  //   else if (
  //     (tabIndex == 7 ||
  //       (problemFromQuery !== undefined && tabIndex == 7) ||
  //       (isNext && tabIndex == 4)) &&
  //       categoryType == ''
  //   ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   }

  //   else if (
  //     (tabIndex == 8 ||
  //       (problemFromQuery !== undefined && tabIndex == 8) ||
  //       (isNext && tabIndex == 5)) &&
  //     slots.length == 0
  //   ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } else if (
  //     (tabIndex == 9 ||
  //       (problemFromQuery !== undefined && tabIndex == 9) ||
  //       (isNext && tabIndex == 6)) &&
  //     (contactType == "" || contact.length <= 1 || !checkUsername(contact))
  //   ) {
  //     setShowError(true);
  //     setTimeout(() => {
  //       setShowError(false);
  //     }, 3000);
  //   } else {
  //     setGoalReached(tabIndex);
  //     setActiveTabIndex(tabIndex + 1);
  //     console.log('test')
  //     setShowError(false);
  //   }
  // }

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if(tabIndex == 1 && age == ''){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    else if(tabIndex == 2 && client_sex == ''){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    else if(tabIndex == 4 && psychologist_sex == ''){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    else if(tabIndex == 8 && (diagnose.length == 0  || (diagnose[0] != 'Нет' && diagnoseMedicaments == ''))){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    else if(((activeTabIndex == 10 && next != 1) || (next==1 && activeTabIndex==9)) && slots.length == 0){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }

    else if (
      ((activeTabIndex == 11 && next != 1) || (next==1 && activeTabIndex==10))  &&
      (contactType == "" || contact.length <= 2 || !checkUsername(contact))
    ){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  
     else {
      setGoalReached(tabIndex);
      setActiveTabIndex(tabIndex + 1);
      console.log('test')
      setShowError(false);
    }
  }

  function checkUsername(username){
    var regex = new RegExp("^[a-zA-Z0-9_@+-]+$");
      if (!regex.test(username)){
        return false
      }

      return true
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

    const next = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.next;

    if (
      (activeTabIndex == 11 || (next==1 && activeTabIndex == 10))  &&
      (contactType == "" || contact.length <= 2 || !checkUsername(contact))
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {

      if(next == 1){
        setPromocode('Клиент перешёл из исследовательской анкеты')
      }  

      let data = {
        ...form,
        formPsyClientInfo,
        utm_client,
        utm_tarif,
        utm_campaign,
        utm_content,
        utm_medium,
        utm_source,
        utm_term,
        utm_psy,
        ticket_id,
      };
      delete data["psychos"];
      if (problemFromQuery) {
        data["anxieties"] = [problemFromQuery];
      }
      if (isNext) {
        if (
          formPsyClientInfo.hasPsychoExperience ==
          "Нет, но рассматривал(а) такую возможность"
        ) {
          data["lastExperience"] = "Нет, это первый опыт";
        } else {
          data["lastExperience"] =
            "Да, было.  " + formPsyClientInfo.durationSession;
        }

        data["promocode"] = "Клиент перешёл из исследовательской анкеты";
      }
      
      data = { ...data, formPsyClientInfo };
      dispatch(setStatus("sending"));
      axios({
        method: "POST",
        data: data,
        url: "https://n8n-v2.hrani.live/webhook/tilda-zayavka-diagnostic",
      })
        .then(() => {
          if (problemFromQuery) {
            ym(96890969, "reachGoal", "otpravkashort");
          } else {
            ym(96890969, "reachGoal", "otpravka");
          }

          dispatch(setStatus("ok"));
          if (rid && bid && rid != 0 && bid != 0) {
            axios({
              method: "PUT",
              data: {
                rid,
                bid,
                contactType: form.contactType,
                contact: form.contact,
                name: form.name,
                form,
                formPsyClientInfo
              },
              url: "https://n8n-v2.hrani.live/webhook/update-contacts-stb",
            });
          }
          axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Заявка отправлена", ticket_id },
          });
        })
        .catch((e) => {
          dispatch(setStatus("error"));
          console.log("Ошибка [отправка формы]", e);
        });
    }
  }

  function showForwardBtn() {
    if (
      ((activeTabIndex == 10 && next != 1) || (next == 1 && activeTabIndex == 9)) &&
      areSlotsEmpty
    ) {
      return false;
    } else if (activeTabIndex != maxTabsCount - 1) {
      return true;
    } else if (activeTabIndex == maxTabsCount - 1) {
      return false;
    }

    return true;
  }
  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}

      <div className="bg-white h-full flex flex-col relative w-full rounded-[30px]">
        <div
          data-name="header-block relative "
          className="px-5 py-3 bg-[#2c3531] sticky top-0 z-20 rounded-t-[30px]"
        >
          <h2 className="text-[#d1e8e2] font-medium text-base ">
            {!((activeTabIndex == 10 && next != 1) || (activeTabIndex == 9 && next == 1)) ? headers[0] : headers[1]}
          </h2>
        </div>

        <div
          data-name="error-message"
          className={`px-5 h-0 flex justify-center items-center text-white font-medium bg-[#ff2f2f] height-transition-4 ${
            showError ? "h-20" : "h-0"
          }`}
        >
          
        {((activeTabIndex == 10 && next != 1) || (activeTabIndex == 9 && next == 1)) ? "Вы не выбрали время" : (activeTabIndex == 11 && next !=1 ) || (activeTabIndex == 10 && next==1) ? "Введите корректный номер телефона для связи" : "Вы не заполнили обязательное поле"}
        </div>
        {/* <FormPager></FormPager> */}

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
          {!isNext && (
            <>
              {activeTabIndex == 0 && <Name></Name>}
              {activeTabIndex == 1 && <Age></Age>}
              {activeTabIndex == 2 && <Sex></Sex>}
              {activeTabIndex == 3 && <Importance/>}
              {activeTabIndex == 4 && <SexPsycho></SexPsycho>}
              {activeTabIndex == 5 && <QuestionToPsychologist/>}
              {activeTabIndex == 6 && <ClientSatate></ClientSatate>}
              {activeTabIndex == 7 && <TraumaticEvents></TraumaticEvents>}
              {activeTabIndex == 8 && <Diagnoses></Diagnoses>}
              {activeTabIndex == 9 && <Promocode></Promocode>}        
                    
              {activeTabIndex == 10 && (
                <SlotsDiagnostic></SlotsDiagnostic>
              )}
              {activeTabIndex == 11 && <AskContacts></AskContacts>}
            </>
          )}

          {isNext && (
            <>
              {activeTabIndex == 0 && <Name></Name>}
              {activeTabIndex == 1 && <Age></Age>}
              {activeTabIndex == 2 && <Sex></Sex>}
              {activeTabIndex == 3 && <Importance/>}
              {activeTabIndex == 4 && <SexPsycho></SexPsycho>}
              {activeTabIndex == 5 && <QuestionToPsychologist/>}
              {activeTabIndex == 6 && <ClientSatate></ClientSatate>}
              {activeTabIndex == 7 && <TraumaticEvents></TraumaticEvents>}
              {activeTabIndex == 8 && <Diagnoses></Diagnoses>}
              {activeTabIndex == 9 && (
                <SlotsDiagnostic></SlotsDiagnostic>
              )}
              {activeTabIndex == 10 && <AskContacts></AskContacts>}

            </>
          )}

        </div>

        {/* Control buttons  */}
        <div
          data-name="control-block"
          className="px-5 py-3 flex items-center sticky bottom-0  gap-4 bg-[#2c3531] w-full z-30 rounded-b-[30px]"
        >
          {activeTabIndex != 0 ? (
            <Button
              size="small"
              intent="cream-transparent"
              hower="primary"
              className="sm:max-w-40 max-sm:max-w-fit mr-auto text-sm"
              onClick={() => {
                setActiveTabIndex(activeTabIndex - 1);
                dispatch(removeEmptySlots());
              }}
            >
              Назад
            </Button>
          ) : (
            ""
          )}
          {showForwardBtn() ? (
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

          {activeTabIndex == maxTabsCount - 1 ? (
            <Button
              size="small"
              intent="cream"
              hower="primary"
              className="max-w-fit ml-auto text-nowrap text-sm"
              onClick={() => {
                sendData();
              }}
            >
              Отправить заявку
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
