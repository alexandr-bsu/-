import React, { useEffect } from "react";
import FormWithoutPsycologists from "../components/FormWithoutPsycologists";
import Lottie from "react-lottie";
import okLottie from "../assets/lotties/ok";
import errorLottie from "../assets/lotties/error";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import { generateTicketId, setUserTimeZone } from "../redux/slices/formSlice";
import axios from "axios";
import QueryString from "qs";

const FormPage = () => {
  const status = useSelector((state) => state.formStatus.status);
  const form = useSelector((state) => state.form);
  const formPsyClientInfo = useSelector((state) => state.formPsyClientInfo);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  function getFormType() {
    const problemFromQuery = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.problem;
    let formType = problemFromQuery ? "Короткая форма " : "Стандартная форма ";
    formType += "без визиток";

    return formType;
  }
  function initFormTracking() {
    axios({
      method: "POST",
      url: "https://n8n-v2.hrani.live/webhook/init-form-tracking",
      data: { ticket_id, form_type: getFormType(), step: "Начало" },
    });
  }

  useEffect(() => {
    dispatch(generateTicketId());
    dispatch(setUserTimeZone());
  }, []);

  useEffect(() => {
    if (ticket_id) {
      initFormTracking();
    }
  }, [ticket_id]);

  const okLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: okLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const errorLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: errorLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const problemFromQuery = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.problem;

  // Перешёл клиент из исследовательской анкеты
  const next = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.next;

  const rid = form.rid;
  const bid = form.bid;

  const isNext = next == 1;

  // Повторная отправка формы
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

    dispatch(setStatus("sending"));

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
      data = { ...data, formPsyClientInfo };
    }

    axios({
      method: "POST",
      data: data,
      url: "https://n8n-v2.hrani.live/webhook/tilda-zayavka",
    })
      .then(() => {
        dispatch(setStatus("ok"));
        if (rid && bid && rid != 0 && bid != 0) {
          axios({
            method: "PUT",
            data: {
              rid,
              bid,
              contactType: form.contactType,
              contact: form.contact,
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

  return (
    <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden">
      {status == "active" && (
        <>
          <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden p-5 rounded-[30px]">
            <FormWithoutPsycologists
              maxTabsCount={next == 1 ? 9 : 10}
            ></FormWithoutPsycologists>
          </div>
        </>
      )}
      {status != "active" && (
        <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden p-5">
          <div className=" bg-white w-full h-full rounded-[30px]">
            <div
              data-name="result-container"
              className="flex flex-col items-center justify-center w-full h-full"
            >
              {status == "sending" && (
                <svg
                  className="justify-self-center self-center"
                  xmlns="http://www.w3.org/2000/svg"
                  width={150}
                  height={150}
                  viewBox="0 0 200 200"
                >
                  <radialGradient
                    id="a6"
                    cx=".66"
                    fx=".66"
                    cy=".3125"
                    fy=".3125"
                    gradientTransform="scale(1.5)"
                  >
                    <stop offset="0" stop-color="#155D5E"></stop>
                    <stop
                      offset=".3"
                      stop-color="#155D5E"
                      stop-opacity=".9"
                    ></stop>
                    <stop
                      offset=".6"
                      stop-color="#155D5E"
                      stop-opacity=".6"
                    ></stop>
                    <stop
                      offset=".8"
                      stop-color="#155D5E"
                      stop-opacity=".3"
                    ></stop>
                    <stop
                      offset="1"
                      stop-color="#155D5E"
                      stop-opacity="0"
                    ></stop>
                  </radialGradient>
                  <circle
                    transform-origin="center"
                    fill="none"
                    stroke="url(#a6)"
                    stroke-width="15"
                    stroke-linecap="round"
                    stroke-dasharray="200 1000"
                    stroke-dashoffset="0"
                    cx="100"
                    cy="100"
                    r="70"
                  >
                    <animateTransform
                      type="rotate"
                      attributeName="transform"
                      calcMode="spline"
                      dur="2"
                      values="360;0"
                      keyTimes="0;1"
                      keySplines="0 0 1 1"
                      repeatCount="indefinite"
                    ></animateTransform>
                  </circle>
                  <circle
                    transform-origin="center"
                    fill="none"
                    opacity=".2"
                    stroke="#155D5E"
                    stroke-width="15"
                    stroke-linecap="round"
                    cx="100"
                    cy="100"
                    r="70"
                  ></circle>
                </svg>
              )}

              {status == "ok" && (
                <div className="flex flex-col justify-center items-center">
                  <Lottie options={okLottieOptions} height={200} width={200} />
                  <h2 className="font-medium text-center text-green text-3xl">
                    Cпасибо!
                  </h2>
                  <p className="text-black text-base font-medium text-center p-5">
                  Мы получили ваш запрос и чтобы забронировать время запустите телеграм-бот. В боте вы также получите подтверждение записи и ссылку на первую сессию с психологом
                  </p>

                  <a
                    href={`https://t.me/HraniLiveBot?start=${ticket_id}`}
                    target="_top"
                  >
                    <Button intent="cream" hover="primary">
                      Перейти в телеграм-бот
                    </Button>
                  </a>
                </div>
              )}

              {/* Дописать что "Расписание психологов подобранных на основании вашего запроса" */}

              {status == "error" && (
                <div className="flex flex-col justify-center items-center">
                  <Lottie
                    options={errorLottieOptions}
                    height={200}
                    width={200}
                  />
                  <h2 className="font-medium text-center text-red text-xl">
                    Упс! Что-то пошло не так
                  </h2>
                  <p className="text-black font-medium text-center p-5">
                    Мы уже в курсе проблемы и работаем над её устранением.
                    Пожалуйста повторите отправку формы
                  </p>
                  <div className="p-5">
                    <Button
                      intent="cream"
                      hover="primary"
                      onClick={() => sendData()}
                    >
                      Повторить отправку
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPage;
