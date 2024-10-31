import React from "react";
import Button from "../../components/Button";
import QueryString from "qs";
import { Link } from "react-router-dom";
import Lottie from "react-lottie";
import okLottie from "../../assets/lotties/ok";

const AskContacts = ({ nextBtnFn, sendFn }) => {
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

  return (
    <>
      <div className="flex flex-col gap-10 w-full h-full justify-center items-center px-5">
        <div className="flex flex-col justify-center items-center">
          <Lottie options={okLottieOptions} height={200} width={200} />

          <h2 className="font-medium text-center text-green text-3xl">
            Спасибо за заполнение анкеты!
          </h2>
        </div>

        <p className="text-black text-lg font-medium text-center max-w-[1200px]">
          В знак благодарности мы обещали подарить вам бесплатную сессию с нашим
          психологом. Хотели бы вы сейчас сформировать свой запрос психологу и
          записаться на сессию ?
        </p>
        <div className="flex gap-4">
          <Link
            to={`/?utm_client=${utm_client}&utm_tarif=${utm_tarif}&utm_campaign=${utm_campaign}&utm_content=${utm_content}&utm_medium=${utm_medium}&utm_source=${utm_source}&utm_term=${utm_term}&utm_psy=${utm_psy}&next=1`}
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
              sendFn();
            }}
          >
            Нет, спасибо
          </Button>
        </div>
      </div>
    </>
  );
};

export default AskContacts;
