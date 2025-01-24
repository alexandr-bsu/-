import React from "react";
import Slots from "./Slots";
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
import PsyCarousel from "@/survey/main/PsyCorousel";
import Diagnoses from "../survey/main/Diagnoses";
import ClientSatate from "../survey/main/ClientsStates";
import TraumaticEvents from "../survey/main/TraumaticEvents";
import Questions from "../survey/main/Questions";
import { removeEmptySlots } from "@/redux/slices/formSlice";
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

  // const rid = QueryString.parse(window.location.search, {
  //   ignoreQueryPrefix: true,
  // })?.rid;

  // const bid = QueryString.parse(window.location.search, {
  //   ignoreQueryPrefix: true,
  // })?.bid;
  const form = useSelector((state) => state.form);
  const bid = form.bid;
  const rid = form.rid;
  const formPsyClientInfo = useSelector((state) => state.formPsyClientInfo);
  const ticket_id = useSelector((state) => state.form.ticket_id);

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

  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = ["Заявка на подбор психолога из сообщества Хранители"];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

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

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if (
      (tabIndex == 3 && JSON.stringify(questions) == JSON.stringify([])) ||
      (tabIndex == 3 &&
        questions.includes("Свой вариант") &&
        customQuestion == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 4 || (problemFromQuery !== undefined && tabIndex == 4)) &&
      lastExperience == "" &&
      !isNext
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 5 ||
        (problemFromQuery !== undefined && tabIndex == 5) ||
        (isNext && tabIndex == 4)) &&
      amountExpectations == ""
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 7 || (problemFromQuery !== undefined && tabIndex == 7)) &&
      !isNext &&
      age == ""
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 8 ||
        (problemFromQuery !== undefined && tabIndex == 8) ||
        (isNext && tabIndex == 5)) &&
      selectedPsychologistsNames.length == 0
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 9 ||
        (problemFromQuery !== undefined && tabIndex == 9) ||
        (isNext && tabIndex == 6)) &&
      slots.length == 0
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 10 ||
        (problemFromQuery !== undefined && tabIndex == 10) ||
        (isNext && tabIndex == 7)) &&
      (contactType == "" || contact == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      setGoalReached(tabIndex);
      setActiveTabIndex(tabIndex + 1);
      setShowError(false);
    }
  }

  const areSlotsEmpty = useSelector((state) => state.form.emptySlots);
  function showForwardBtn() {
    if (
      (activeTabIndex == 8 ||
        (problemFromQuery !== undefined && activeTabIndex == 8) ||
        (isNext && activeTabIndex == 5)) &&
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

    if (
      (activeTabIndex == 10 ||
        (problemFromQuery !== undefined && activeTabIndex == 10) ||
        (isNext && activeTabIndex == 7)) &&
      (contactType == "" || contact == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
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

        data = { ...data, formPsyClientInfo };
      }
      dispatch(setStatus("sending"));
      axios({
        method: "POST",
        data: data,
        url: "https://n8n-v2.hrani.live/webhook/tilda-zayavka",
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
        });
    }
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
            {headers[0]}
          </h2>
        </div>

        <div
          data-name="error-message"
          className={`px-5 h-0 flex justify-center items-center text-white font-medium bg-[#ff2f2f] height-transition-4 ${
            showError ? "h-20" : "h-0"
          }`}
        >
          {activeTabIndex == 9 ||
          (problemFromQuery !== undefined && activeTabIndex == 9) ||
          (isNext && activeTabIndex == 6)
            ? "Вы не выбрали время"
            : activeTabIndex == 8 ||
              (problemFromQuery !== undefined && activeTabIndex == 8) ||
              (isNext && activeTabIndex == 5)
            ? "Вы не выбрали психолога(ов)"
            : "Вы не заполнили обязательное поле"}
        </div>
        {/* <FormPager></FormPager> */}

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
          {problemFromQuery === undefined && !isNext && (
            <>
              {activeTabIndex == 0 && <Diagnoses></Diagnoses>}
              {activeTabIndex == 1 && <ClientSatate></ClientSatate>}
              {activeTabIndex == 2 && <TraumaticEvents></TraumaticEvents>}
              {activeTabIndex == 3 && <Questions />}
              {activeTabIndex == 4 && <LastExperience></LastExperience>}
              {activeTabIndex == 5 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 6 && <Promocode></Promocode>}
              {activeTabIndex == 7 && <Age></Age>}
              {activeTabIndex == 8 && <PsyCarousel></PsyCarousel>}
              {activeTabIndex == 9 && <Slots></Slots>}
              {activeTabIndex == 10 && <AskContacts></AskContacts>}
              {activeTabIndex == 11 && <Name></Name>}
            </>
          )}
          {problemFromQuery !== undefined && !isNext && (
            <>
              {activeTabIndex == 0 && <Diagnoses></Diagnoses>}
              {activeTabIndex == 1 && <ClientSatate></ClientSatate>}
              {activeTabIndex == 2 && <TraumaticEvents></TraumaticEvents>}
              {activeTabIndex == 3 && <Questions />}
              {activeTabIndex == 4 && <LastExperience></LastExperience>}
              {activeTabIndex == 5 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 6 && <Promocode></Promocode>}
              {activeTabIndex == 7 && <Age></Age>}
              {activeTabIndex == 8 && <PsyCarousel></PsyCarousel>}
              {activeTabIndex == 9 && <Slots></Slots>}
              {activeTabIndex == 10 && <AskContacts></AskContacts>}
              {activeTabIndex == 11 && <Name></Name>}
            </>
          )}

          {isNext && problemFromQuery == undefined && (
            <>
              {activeTabIndex == 0 && <Diagnoses></Diagnoses>}
              {activeTabIndex == 1 && <ClientSatate></ClientSatate>}
              {activeTabIndex == 2 && <TraumaticEvents></TraumaticEvents>}
              {activeTabIndex == 3 && <Questions />}
              {activeTabIndex == 4 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 5 && <PsyCarousel></PsyCarousel>}
              {activeTabIndex == 6 && <Slots></Slots>}
              {activeTabIndex == 7 && <AskContacts></AskContacts>}
              {activeTabIndex == 8 && <Name></Name>}
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

export default Form;
