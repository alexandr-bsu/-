import { React, useState, useEffect } from "react";
import QueryString from "qs";
import axios from "axios";
import errorLottie from "../assets/lotties/error";
import Lottie from "react-lottie";
import Button from "./Button";

// TODO: Отправить в телеграм в сообщении псчихологам инфу с заявки
// в гугл таблицах, в колонке baserow_id добавить лилдирующие нули + bs в переди

const SlotInfoPopup = ({ slotDate, closeFn, queryDate, queryTime }) => {
  const errorLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: errorLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const [data, setData] = useState({});
  const [status, setStatus] = useState("loading");

  function loadSlotData() {
    setStatus("loading");

    const secret = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.secret;

    axios({
      url: "https://n8n.hrani.live/webhook/get-ticket-for-slot",
      method: "GET",
      params: { date: queryDate, time: queryTime, secret: secret },
    })
      .then((resp) => {
        if (JSON.stringify(resp.data) == JSON.stringify({})) {
          setStatus("empty");
        } else {
          console.log(
            "data",
            resp.data["Время выбранного слота"][0]?.value,
            resp.data["Дата  выбранного слота"][0]?.value,
            queryDate
          );

          if ("Что беспокоит" in resp.data) {
            resp.data["Что беспокоит"] = resp.data["Что беспокоит"].split(";");
          }

          if (queryDate == resp.data["Дата  выбранного слота"][0]?.value) {
            setData(resp.data);
            setStatus("ok");
          }
        }
      })
      .catch((error) => {
        setStatus("error");
      });
  }
  useEffect(() => {
    loadSlotData();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20">
      <div className="bg-[#eed5bf] rounded-lg h-full w-full overflow-y-scroll">
        <div className="bg-[#eed5bf] sticky top-0 p-5 border-b border-b-dark-green mb-10 w-full flex justify-between items-center">
          <h2 className="text-dark-green font-medium text-3xl ">
            Слот на {slotDate}
          </h2>

          <img
            src="static/close.png"
            className="cursor-pointer w-5 h-5"
            onClick={closeFn}
          ></img>
        </div>

        {status == "loading" && (
          <svg
            className="m-auto"
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
          <div data-name="slot-data" className="p-5 flex flex-col gap-8">
            <p className="text-dark-green flex gap-2">
              <b>Имя: </b> {data["Имя"]}
            </p>

            <p className="text-dark-green flex gap-2">
              <b>Возраст: </b> {data["Возраст"]}
            </p>

            <p className="text-dark-green">
              <b>Что беспокоит клиента: </b>{" "}
              {data["Что беспокоит"]?.map((a) => {
                return <li>{a}</li>;
              })}
            </p>

            <p className="text-dark-green max-w-2xl">
              <b>Вопрос психологу:</b>
              <br />
              {data["Вопрос писхологу"]}
            </p>

            <p className="text-dark-green">
              <b>Клиент обращался к психологу ранее?:</b>
              <br />
              {data["Прошлый опыт"]?.value}
            </p>

            {/* <p className="text-dark-green">
              <b>За сколько сессий клиент собирается решить проблему?:</b>
              <br />
              {data["Ожидания"]?.value}
            </p> */}
          </div>
        )}

        {status == "empty" && (
          <div className="p-5 m-auto text-center flex flex-col gap-4">
            <p className="text-dark-green font-medium text-3xl">Нет данных</p>
            <p className="text-black font-medium">
              Для получения подробной информации обратитесь к администратору
            </p>
          </div>
        )}

        {status == "error" && (
          <div className="flex flex-col justify-center items-center">
            <Lottie options={errorLottieOptions} height={200} width={200} />
            <h2 className="font-medium text-center text-red text-xl">
              Упс! Что-то пошло не так
            </h2>
            <p className="text-black font-medium text-center p-5">
              Мы уже в курсе проблемы и работаем над её устранением. Пожалуйста
              повторите попытку
            </p>
            <div className="p-5">
              <Button
                intent="cream"
                hover="primary"
                onClick={() => loadSlotData()}
              >
                Повторить
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SlotInfoPopup;
