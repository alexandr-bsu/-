import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";
import okLottie from "../assets/lotties/ok";
import errorLottie from "../assets/lotties/error";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import axios from "axios";
import QueryString from "qs";

const FormHelpfulHandPage= () => {
  const status = useSelector((state) => state.formStatus.status);
  const dispatch = useDispatch();
  const [errorText, setErrorText] = useState("")

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

  const telegram_id = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.telegram_id;

  const link_id = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.link_id;



 
  // бронируем клиента
  function sendData() {
    setErrorText("")
    dispatch(setStatus("sending"));
    console.log(window.location.search, telegram_id, link_id)
    
    axios({
      method: "POST",
      data: {telegram_id, link_id},
      url: "https://n8n-v2.hrani.live/webhook/confirm-help-hand-by-psychologist",
    })
      .then((response) => {
        console.log(response.data)
        if('error' in response.data){
          dispatch(setStatus("error"));
          setErrorText(response.data['error'])
        } else {
          dispatch(setStatus("ok"));
        }
      
      })
      .catch((e) => {
        dispatch(setStatus("error"));
        console.log("Ошибка [отправка формы]", e);
      });
  }

  useEffect(() => {
    sendData()
  }, [])

  return (
    <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden">
      {status == "active" && (
        <>
          <div className="bg-dark-green h-screen w-screen max-w-[1024px]  max-h-[600px] flex flex-col items-center justify-center overflow-y-hidden p-5 rounded-[30px]">
            {/* TODO: Вставить форму отправки */}
            <div className=" bg-white w-full h-full rounded-[30px] flex flex-col items-center justify-center ">
            <div className="flex flex-col justify-center items-center">
                  <Lottie options={okLottieOptions} height={200} width={200} />
                  <h2 className="font-medium text-center text-green text-3xl">
                    Готово!
                  </h2>
                  <p className="text-black text-base font-medium text-center p-5">
                    Отлично 🙂 Клиент забронирован за вами и сейчас он получит ссылку на ваши слоты чтобы записаться на сессию
                  </p>
                </div>
            </div>
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
                <>

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
                </>
              )}

              {status == "ok" && (
                <div className="flex flex-col justify-center items-center">
                  <Lottie options={okLottieOptions} height={200} width={200} />
                  <h2 className="font-medium text-center text-green text-3xl">
                    Готово!
                  </h2>
                  <p className="text-black text-base font-medium text-center p-5">
                    Отлично 🙂 Клиент забронирован за вами и сейчас он получит ссылку на ваши слоты чтобы записаться на сессию
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
                  <h2 className="font-medium text-center text-red text-xl">
                    Упс! Что-то пошло не так
                  </h2>
                  <p className="text-black font-medium text-center p-5">
                    {errorText == "" && "Мы уже в курсе проблемы и работаем над её устранением. Пожалуйста повторите отправку формы"}
                    {errorText != "" && errorText}
                  </p>
                  {errorText == "" && <div className="p-5">
                    <Button
                      intent="cream"
                      hover="primary"
                      onClick={() => sendData()}
                    >
                      Повторить отправку
                    </Button>
                  </div>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormHelpfulHandPage;