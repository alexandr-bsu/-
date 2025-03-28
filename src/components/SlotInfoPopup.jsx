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
      url: "https://n8n-v2.hrani.live/webhook/get-ticket-for-slot",
      method: "GET",
      params: { date: queryDate, time: queryTime, secret: secret },
    })
      .then((resp) => {
        console.log("resp", resp.data);
        if (JSON.stringify(resp.data) == JSON.stringify({})) {
          setStatus("empty");
        } else {


          resp.data['traumatic_events'] = resp.data['traumatic_events'] == null ? '' : resp.data['traumatic_events']
          
          if (
            "client_state" in resp.data &&
            resp.data["client_state"]
          ) 
          { 
            resp.data["client_state"] = JSON.parse(resp.data["client_state"])
            if(!Array.isArray(resp.data["client_state"])){
              resp.data["client_state"] = resp.data["client_state"].split(";");
            }
            
            if (
              resp.data["client_state"][0] == "" &&
              resp.data["client_state"].length == 1
            ) {
              resp.data["client_state"] = [];
            }
          }

          if (
            "traumatic_events" in resp.data &&
            resp.data["traumatic_events"]
          ) {
            resp.data["traumatic_events"] = JSON.parse(resp.data["traumatic_events"])
            if(!Array.isArray(resp.data["traumatic_events"])){
              resp.data["traumatic_events"] = resp.data["traumatic_events"].split(";");
            }

            if (
              resp.data["traumatic_events"][0] == "" &&
              resp.data["traumatic_events"].length == 1
            ) {
              resp.data["traumatic_events"] = [];
            }
          }

          if (
            "important_in_psychologist" in resp.data &&
            resp.data["important_in_psychologist"]
          ) {
            resp.data["important_in_psychologist"] = JSON.parse(resp.data["important_in_psychologist"])
            if(!Array.isArray(resp.data["important_in_psychologist"])){
              resp.data["important_in_psychologist"] = resp.data["important_in_psychologist"].split(";");
            }

            if (
              resp.data["important_in_psychologist"][0] == "" &&
              resp.data["important_in_psychologist"].length == 1
            ) {
              resp.data["important_in_psychologist"] = [];
            }
          }

         
          console.log("data", resp.data);

          setData(resp.data);
          setStatus("ok");
        }
      })
      .catch((error) => {
        setStatus("error");
        console.log(error);
      });
  }
  useEffect(() => {
    loadSlotData();
  }, []);

  return (
    <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20">
      <div className="bg-[#eed5bf] rounded-lg h-full w-full overflow-y-scroll">
        <div className="bg-[#eed5bf] sticky top-0 p-5 border-b border-b-dark-green mb-10 w-full flex justify-between items-center">
          <div>
          <h2 className="text-dark-green font-medium text-3xl ">
            Слот на {slotDate}
          </h2>
          <p className="text-dark-green text-xl">{data['is_helpful_hand'] ? "Заявка из Руки помощи " : ''}</p>
          </div>
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
            <div className="flex flex-col gap-1">
            <p className="text-dark-green flex gap-2">
              <b>Имя: </b> {data["client_name"]}
            </p>

            <p className="text-dark-green flex gap-2">
              <b>Возраст: </b> {data["client_age"]}
            </p>

            <p className="text-dark-green flex gap-2">
              <b>Часовой пояс клиента: </b> {data["client_timezone"]}
            </p>

            <p className="text-dark-green flex gap-2">
              <b>Опыт клиента: </b> {data["is_helpful_hand"] ? data["past_session_experience"] : data["experience"]}
            </p>

            {data["is_helpful_hand"] && <p className="text-dark-green flex gap-2">
              <b>Оплата: </b> {data["is_helpful_hand"] ? data["psychologist_price"] : ''}
            </p>}

            </div>

            {data["important_in_psychologist"]?.length != 0 && (
              <p className="text-dark-green">
                <b>В психологе важно: </b>{" "}
                {data["important_in_psychologist"]?.map((a) => {
                  return <li>{a}</li>;
                })}
              </p>
            )}

            {data["questions_to_psychologist"]?.length != 0 && (
              <p className="text-dark-green">
                <b>Клиент хочет обсудить: </b>
                <p className="text-dark-green">{data["questions_to_psychologist"]}</p>
              </p>
            )}

            {data["has_mental_illness"]?.length != 0 && (
              <p className="text-dark-green">
                <b>Псих. заболевание: </b>{" "}
                {data["has_mental_illness"]}. {data["diagnose_medicaments"] ? 'Принимает медикаменты? '+ data['diagnose_medicaments'] : ''}
              </p>
            )}

            

            {data["client_state"]?.length != 0 && (
              
              <p className="text-dark-green">
                <b>Состояние клиента: </b>{" "}
                {data["client_state"]?.map((a) => {
                  return <li>{a}</li>;
                })}
              </p>
            )}

            {data["traumatic_events"]?.length != 0 && (
              <p className="text-dark-green">
                <b>Травмирующие события: </b>{" "}
                {data["traumatic_events"]?.map((a) => {
                  return <li>{a}</li>;
                })}
              </p>
            )}

            {/* 
            <p className="text-dark-green max-w-2xl">
              <b>Вопрос психологу:</b>
              <br />
              {data["Вопрос писхологу"]}
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
