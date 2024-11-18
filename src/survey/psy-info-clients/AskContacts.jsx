import React from "react";
import Button from "../../components/Button";
import QueryString from "qs";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import okLottie from "../../assets/lotties/ok";
import errorLottie from "../../assets/lotties/error";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setRid, setBid } from "../../redux/slices/formSlice";
import axios from "axios";

const AskContacts = ({ sendFn, showOkFn }) => {
  const dispatch = useDispatch();
  const form = useSelector((state) => state.formPsyClientInfo);
  const formMainanxieties = useSelector((state) => state.form.anxieties);
  const rid = useSelector((state) => state.form.rid);
  const bid = useSelector((state) => state.form.bid);
  const [rowId, setRowId] = React.useState(0);
  const [baserowId, setBaserowId] = React.useState(0);
  const [status, setStatus] = React.useState("sending");

  const errorLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: errorLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const okLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: okLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

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

  // p - psychologists - если 1, то показываем страницу с психологами
  const p = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.p;

  const isP = p == 1;

  function getRowId() {
    axios
      .get("https://n8n.hrani.live/webhook/get-sheets-row-number")
      .then((response) => {
        dispatch(setRid(response.data.rowId));
        dispatch(setBid(response.data.baserowId));
      });
  }

  function _sendData() {
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
    setStatus("sending");

    axios({
      method: "POST",
      data: data,
      url: "https://n8n.hrani.live/webhook/research-tilda-zayavka",
    })
      .then(() => {
        setStatus("ok");
        getRowId();
      })
      .catch((e) => {
        setStatus("error");
      });
  }

  useEffect(() => {
    _sendData();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 w-full h-full justify-center items-center px-5">
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
              <stop offset=".3" stop-color="#155D5E" stop-opacity=".9"></stop>
              <stop offset=".6" stop-color="#155D5E" stop-opacity=".6"></stop>
              <stop offset=".8" stop-color="#155D5E" stop-opacity=".3"></stop>
              <stop offset="1" stop-color="#155D5E" stop-opacity="0"></stop>
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
          <>
            <div className="flex flex-col justify-center items-center">
              <Lottie options={okLottieOptions} height={150} width={150} />

              <h2 className="font-medium text-center text-green text-xl">
                Спасибо за заполнение анкеты!
              </h2>
            </div>

            <p className="text-black text-sm font-medium text-center max-w-[1200px]">
              В знак благодарности мы обещали подарить бесплатную сессию .
              Готовы сейчас подобрать психолога и выбрать время?
            </p>
            <div className="flex gap-4">
              <Link
                to={`${
                  isP ? "/form-with-psychologists/" : "/"
                }?utm_client=${utm_client}&utm_tarif=${utm_tarif}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&utm_medium=${utm_medium}&utm_source=${utm_source}&utm_term=${utm_term}&utm_psy=${utm_psy}&next=1`}
              >
                <Button
                  size="medium"
                  intent="primary"
                  hover="cream"
                  className="w-[150px]"
                >
                  Да
                </Button>
              </Link>

              <Button
                size="medium"
                intent="primary-transparent"
                hover="cream"
                className="w-[150px]"
                onClick={() => {
                  showOkFn();
                }}
              >
                Нет, спасибо
              </Button>
            </div>
          </>
        )}

        {status == "error" && (
          <>
            <div className="flex flex-col justify-center items-center">
              <Lottie options={errorLottieOptions} height={100} width={100} />
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
                  onClick={() => _sendData()}
                >
                  Повторить отправку
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AskContacts;
