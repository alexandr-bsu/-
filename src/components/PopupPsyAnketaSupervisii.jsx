import React, { useEffect } from "react";
import Button from "./Button";
import Lottie from "react-lottie";
import okLottie from "../assets/lotties/ok";
import errorLottie from "../assets/lotties/error";
import { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import QueryString from "qs";

const PopupPsyAnketaSupervisii = ({ isVisible = true, closeFn }) => {
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

  const [status, setStatus] = useState("loading");
  const anketa = useSelector((state) => state.psyAnketa);
  const psychologist_id = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.psychologist_id;

  function sendData() {
    axios({
      method: "post",
      url: "https://n8n-v2.hrani.live/webhook/send-psy-anketa-info-to-admin-supervisii",
      data: { anketa, psychologist_id },
    })

    setStatus("loading");
    if (
      psychologist_id == undefined ||
      psychologist_id == "null" ||
      psychologist_id == "undefined"
    ) {
      setStatus("error");
      return;
    }

    axios({
      method: "post",
      url: "https://n8n-v2.hrani.live/webhook/update-psychologists-supervisii",
      data: { anketa, psychologist_id },
    })
      .then((resp) => {
        axios({
          method: "post",
          url: "https://n8n-v2.hrani.live/webhook/set-education",
          data: { education: anketa.education, psychologist_id},
        }).then(resp => {
          setStatus("ok");
        }).catch((error) => {
          setStatus("error");
        })
        
      })
      .catch((error) => {
        setStatus("error");
      });
  }

  useEffect(() => {
    if (!isVisible) return;
    sendData();
  }, [isVisible]);

  return (
    <>
      {isVisible && (
        <div className="w-screen h-screen flex justify-center items-center p-20 fixed top-0 left-0">
          <div className="flex flex-col justify-center items-center bg-white rounded-[30px] p-5 w-[600px]">
            {status == "loading" && (
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
                    Спасибо!
                  </h2>
                </div>

                <p className="text-black text-sm font-medium text-center max-w-[1200px]">
                Спасибо! Ваша информация успешно загружена в систему и будет обновлена после подтверждения администратором
                </p>
                <div />
                <Button
                  size={"small"}
                  className="mt-5"
                  onClick={() => {
                    closeFn();
                  }}
                >
                  Закрыть
                </Button>
              </>
            )}
            {status == "error" && (
              <>
                <div className="flex flex-col justify-center items-center">
                  <Lottie
                    options={errorLottieOptions}
                    height={150}
                    width={150}
                  />

                  <h2 className="font-medium text-center text-green text-xl">
                    {psychologist_id == undefined ||
                    psychologist_id == undefined ||
                    psychologist_id == "null" ||
                    psychologist_id == "undefined"
                      ? "Вы перешли по неправильной ссылке"
                      : "Произошла ошибка"}
                  </h2>
                </div>

                <p className="text-black text-sm font-medium text-center max-w-[1200px]">
                  {psychologist_id == undefined ||
                  psychologist_id == undefined ||
                  psychologist_id == "null" ||
                  psychologist_id == "undefined"
                    ? "В ссылке не указан идентификатор психолога. Пожалуйста, запросите новую ссылку у администратора"
                    : "Мы уже в курсе проблемы и работаем над её устранением.Пожалуйста повторите попытку"}
                </p>
                <div />
                <Button size={"small"} className="mt-5" onClick={sendData}>
                  Повторить отправку
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupPsyAnketaSupervisii;
