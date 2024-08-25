import React from "react";
import Form from "./components/Form";
import Lottie from "react-lottie";
import okLottie from "./assets/lotties/ok";

import { useSelector } from "react-redux";

const App = () => {
  const status = useSelector((state) => state.formStatus.status);
  const okLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: okLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="bg-dark-green h-screen w-screen flex flex-col items-center justify-center overflow-y-hidden ">
      {status == "active" && <Form maxTabsCount={7}></Form>}
      {status != "active" && (
        <div className=" bg-white w-[450px] h-[450px] rounded-lg">
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
              <div className="flex flex-col justify-center items-center">
                <Lottie options={okLottieOptions} height={200} width={200} />
                <h2 className="font-medium text-center text-green text-3xl">
                  Cпасибо!
                </h2>
                <p className="text-black text-lg font-medium text-center p-5">
                  Мы уже начали подбирать психолога и вернемся к вам чтобы
                  назначить встречу как можно скорее!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
