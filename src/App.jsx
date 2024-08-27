import React from "react";
import Form from "./components/Form";
import Lottie from "react-lottie";
import okLottie from "./assets/lotties/ok";
import errorLottie from "./assets/lotties/error";
import Button from "./components/Button";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "./redux/slices/formStatusSlice";
import axios from "axios";

const App = () => {
  const status = useSelector((state) => state.formStatus.status);
  const form = useSelector((state) => state.form);
  const dispatch = useDispatch();
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

  // Повторная отправка формы
  function sendData() {
    dispatch(setStatus("sending"));
    let timer = setTimeout(() => dispatch(setStatus("error")), 10000);

    axios({
      method: "POST",
      data: form,
      url: "https://n8n.hrani.live/webhook/tilda-zayavka",
    })
      .then(() => {
        dispatch(setStatus("ok"));
        clearTimeout(timer);
      })
      .catch((e) => {
        dispatch(setStatus("error"));
      });
  }

  return (
    <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden ">
      {status == "active" && <Form maxTabsCount={8}></Form>}
      {status != "active" && (
        <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden p-5">
          <div className=" bg-white w-full h-full rounded-lg">
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
                    Спасибо! Мы получили ваш запрос и сейчас подбираем
                    специалиста из сообщество психологов "Хранители". Мы
                    свяжемся с вами в течение 20 минут (с 10.00 до 20.00 по
                    Московскому времени, ежедневно)
                  </p>
                </div>
              )}

              {status == "error" && (
                <div className="flex flex-col justify-center items-center">
                  <Lottie
                    options={errorLottieOptions}
                    height={200}
                    width={200}
                  />
                  <h2 className="font-medium text-center text-red text-3xl">
                    Упс! Что-то пошло не так
                  </h2>
                  <p className="text-black text-lg font-medium text-center p-5">
                    Мы уже знаем о проблеме и начили работать над исправлением.
                    Попробуйте отправить форму заново
                  </p>
                  <div className="p-5">
                    <Button onClick={() => sendData()}>
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

export default App;
