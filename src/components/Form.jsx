import React from "react";
import Slots from "./Slots";
import Button from "./Button";
import WelcomePage from "../survey/main/WelcomePage";
import QuestionToPsycologist from "../survey/main/QuestionToPsycologist";
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
      tabIndex == 0 &&
      checkedAnxieties.length == 0 &&
      problemFromQuery === undefined &&
      !isNext
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 1 &&
        questionToPsycologist.length == "" &&
        problemFromQuery === undefined) ||
      (isNext && tabIndex == 0 && questionToPsycologist.length == "")
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 2 || (problemFromQuery !== undefined && tabIndex == 0)) &&
      lastExperience == "" &&
      !isNext
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 3 ||
        (problemFromQuery !== undefined && tabIndex == 1) ||
        (isNext && tabIndex == 1)) &&
      amountExpectations == ""
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 5 || (problemFromQuery !== undefined && tabIndex == 3)) &&
      !isNext &&
      age == ""
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 6 ||
        (problemFromQuery !== undefined && tabIndex == 4) ||
        (isNext && tabIndex == 2)) &&
      slots.length == 0
    ) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if (
      (tabIndex == 7 ||
        (problemFromQuery !== undefined && tabIndex == 5) ||
        (isNext && tabIndex == 3)) &&
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
      (activeTabIndex == 7 ||
        (problemFromQuery !== undefined && activeTabIndex == 5) ||
        (isNext && activeTabIndex == 3)) &&
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
      };
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
        url: "https://n8n.hrani.live/webhook/tilda-zayavka-test",
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
              url: "https://n8n.hrani.live/webhook/update-contacts-stb",
            });
          }
        })
        .catch((e) => {
          dispatch(setStatus("error"));
        });

      // if (isNext) {
      //   let data = {
      //     ...formPsyClientInfo,
      //     utm_client,
      //     utm_tarif,
      //     utm_campaign,
      //     utm_content,
      //     utm_medium,
      //     utm_source,
      //     utm_term,
      //     utm_psy,
      //   };

      //   console.log("test", data, isNext);
      //   axios({
      //     method: "POST",
      //     data: data,
      //     url: "https://n8n.hrani.live/webhook/research-tilda-zayavka",
      //   })
      //     .then(() => {
      //       dispatch(setStatus("ok"));
      //       if (rid && bid) {
      //         axios({
      //           method: "PUT",
      //           data: {
      //             rid,
      //             bid,
      //             contactType,
      //             contact,
      //           },
      //           url: "https://n8n.hrani.live/webhook-test/update-contacts-stb",
      //         });
      //       }
      //     })
      //     .catch((e) => {
      //       dispatch(setStatus("error"));
      //     });
      // }
    }
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
          {activeTabIndex == 6 ||
          (problemFromQuery !== undefined && activeTabIndex == 4) ||
          (isNext && activeTabIndex == 2)
            ? "Вы не выбрали время"
            : "Вы не заполнили обязательное поле"}
        </div>
        {/* <FormPager></FormPager> */}

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
          {problemFromQuery === undefined && !isNext && (
            <>
              {activeTabIndex == 0 && <WelcomePage></WelcomePage>}
              {activeTabIndex == 1 && (
                <QuestionToPsycologist></QuestionToPsycologist>
              )}
              {activeTabIndex == 2 && <LastExperience></LastExperience>}
              {activeTabIndex == 3 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 4 && <Promocode></Promocode>}
              {activeTabIndex == 5 && <Age></Age>}
              {activeTabIndex == 6 && <Slots></Slots>}
              {activeTabIndex == 7 && <AskContacts></AskContacts>}
              {activeTabIndex == 8 && <Name></Name>}
            </>
          )}
          {problemFromQuery !== undefined && !isNext && (
            <>
              {activeTabIndex == 0 && <LastExperience></LastExperience>}
              {activeTabIndex == 1 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 2 && <Promocode></Promocode>}
              {activeTabIndex == 3 && <Age></Age>}
              {activeTabIndex == 4 && <Slots></Slots>}
              {activeTabIndex == 5 && <AskContacts></AskContacts>}
              {activeTabIndex == 6 && <Name></Name>}
            </>
          )}

          {isNext && problemFromQuery == undefined && (
            <>
              {activeTabIndex == 0 && (
                <QuestionToPsycologist></QuestionToPsycologist>
              )}
              {activeTabIndex == 1 && <AmountExpectations></AmountExpectations>}
              {activeTabIndex == 2 && <Slots></Slots>}
              {activeTabIndex == 3 && <AskContacts></AskContacts>}
              {activeTabIndex == 4 && <Name></Name>}
            </>
          )}
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

export default Form;
