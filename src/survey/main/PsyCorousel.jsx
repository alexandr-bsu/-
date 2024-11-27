import React from "react";
import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from "@/components/ui/carousel";
import Lottie from "react-lottie";
import errorLottie from "../../assets/lotties/error";
import { CirclePlay } from "lucide-react";
import Button from "@/components/Button";
import { useEffect, useState } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import {
  tooglePsychologists,
  setPsychologists,
  setShownPsychologists,
  setEmptySlots
} from "@/redux/slices/formSlice";
import VideoPlayer from "@/components/VideoPlayer";
import axios from "axios";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

const PsyCarousel = ({ className, ...props }) => {
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const formPsyClientInfo = useSelector((state) => state.formPsyClientInfo);
  const form = useSelector((state) => state.form);
  
  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: {step: "Карточки психологов", ticket_id}
    })
  }, [])

  const dispatch = useDispatch();
  const errorLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: errorLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: { step: "Карточки психологов", ticket_id },
    });

    axios({
      method: "put",
      data: {ticket_id, form, formPsyClientInfo},
      url: "https://n8n.hrani.live/webhook/update-tracker",
    })
  }, []);

  const next = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.next;

  // Флаг показывает загружаются ли психологи или нет
  const [psychoStatus, setPsychoStatus] = useState("loading");

  const isNext = next == 1;
 
  const pNames = useSelector((state) => state.form.selectedPsychologistsNames);
  const psychos = useSelector((state) => state.form.psychos);
  const age = formPsyClientInfo.age;
  const ageMainForm = useSelector((state) => state.form.age);

  function isNameInArray(name, array) {
    for (let a of array) {
      if (a.Имя == name) {
        return true;
      }
    }

    return false;
  }

  function getAgeFilter() {
    if (isNext && !isNaN(age) && age > 0 && age < 100) {
      return age;
    }

    if (
      !isNext &&
      !isNaN(ageMainForm) &&
      ageMainForm > 0 &&
      ageMainForm < 100
    ) {
      return ageMainForm;
    }

    return undefined;
  }
  function loadPsychos() {
    if (JSON.stringify(psychos) != JSON.stringify([])) {
      setPsychoStatus("active");
      return;
    }

    setPsychoStatus("loading");
    axios({
      url: "https://n8n.hrani.live/webhook/get-filtered-psychologists-names-new",
      method: "POST",
      data: {
        ageFilter: getAgeFilter(),
        formPsyClientInfo,
        form,
        ticket_id,
      },
    })
      .then((resp) => {
       
        if (resp.data[0].filteredPsychologists.length <= 3) {
          dispatch(setPsychologists(resp.data[0].filteredPsychologists));
          let randomThree = resp.data[0].filteredPsychologists;
          let names = [];
          for (let p of randomThree) {
            if (p != undefined) {
              names.push(p?.Имя);
            }
          }

          dispatch(setShownPsychologists(names.join("; ")));
        } else {
          let randomThree = [];

          for (let i = 0; i < 3; i++) {
            let r = Math.floor(
              Math.random() * resp.data[0].filteredPsychologists.length
            );
            if (r < 0) {
              r = 0;
            }
            while (
              isNameInArray(
                resp.data[0].filteredPsychologists[r].Имя,
                randomThree
              )
            ) {
              r = Math.floor(
                Math.random() * resp.data[0].filteredPsychologists.length
              );

              if (r < 0) {
                r = 0;
              }
            }
            randomThree.push(resp.data[0].filteredPsychologists[r]);
          }
          dispatch(setPsychologists(randomThree));

          let names = [];
          for (let p of randomThree) {
            if (p != undefined) {
              names.push(p?.Имя);
            }
          }

          dispatch(setShownPsychologists(names.join("; ")));
        }

        if (resp.data[0].filteredPsychologists.length <= 0) {
          setPsychoStatus("empty");
          dispatch(setEmptySlots())
        } else {
          setPsychoStatus("active");
        }
      })
      .catch((err) => {
        setPsychoStatus("error");
        console.log(err);
      });
  }
  useEffect(() => {
    loadPsychos();
  }, []);

  const [videoVisible, setVideoVisible] = useState(false);
  const [videoSrc, setVideoSrc] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [playStatus, setPlayStatus] = useState("paused");

  // Имя психолога у которого проигрывается видео
  const [playingVideoPsychoName, setPlayingVideoPsychoName] = useState("");

  return (
    <>
      <div className="flex grow h-full flex-col">
        {/* Индикатор загрузки */}
        {psychoStatus == "loading" && (
          <div
            data-name="data-groups"
            className="flex flex-col items-center justify-center w-full h-full"
          >
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
          </div>
        )}
        {psychoStatus == "error" && (
          <div
            data-name="data-groups"
            className="flex flex-col items-center justify-center w-full h-full"
          >
            <div className="flex-col gap-4 p-2 max-w-[450px]">
              <Lottie options={errorLottieOptions} height={150} width={150} />
              <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-black text-center font-bold text-lg">
                  Произошла ошибка
                </p>
                <p className="text-black text-center text-base">
                  Мы уже в курсе проблемы и работаем над её устранением.
                  Пожалуйста повторите попытку
                </p>
                <Button
                  intent="cream"
                  hover="primary"
                  onClick={() => {
                    loadPsychos();
                  }}
                >
                  Повторить
                </Button>
              </div>
            </div>
          </div>
        )}
        {psychoStatus == "active" && (
          <div
            data-name="carousel"
            className={cn("flex h-full flex-col relative z-0", className)}
            {...props}
          >
            <div className="w-full flex justify-center items-center gap-2 py-2 font-medium text-[13px] text-dark-green bg-[#d5e2e2] px-5 mb-2">
              <p>
                На основании вашего запроса мы подобрали для вас психологов.
                Выберите одного или несколько из них. Если вам никто не подошёл,
                {/* Мы подобрали для вас психологов. Выберите одного или несколько
                из них или{" "} */}
                <a
                  className="underline"
                  href="https://t.me/hranitel_admin"
                  target="_top"
                >
                  напишите администратору
                </a>
              </p>
            </div>
            <Carousel className="relative w-full tilda-680:justify-center tilda-680:flex h-full items-center">
              {/* Слева к каждому слайду добавляется pl-4 */}
              <CarouselContent className="mr-5 ml-1 flex relative h-[392px]">
                {psychos?.map((psy, index) => {
                  return (
                    <>
                      {psy != undefined && (
                        <CarouselItem className="basis-auto w-[220px] relative">
                          <div
                            className={`h-full w-full rounded-[30px] top-0 left-0 relative ${
                              playingVideoPsychoName != psy?.Имя
                                ? "visible"
                                : "hidden"
                            }`}
                            style={{
                              backgroundPosition: "center",
                              backgroundRepeat: "no-repeat",
                              backgroundSize: "cover",
                              backgroundImage: `${
                                psy["Ссылка на фото психолога"] != undefined &&
                                psy["Ссылка на фото психолога"] != null &&
                                psy["Ссылка на фото психолога"] != ""
                                  ? `url(${psy["Ссылка на фото психолога"]})`
                                  : "#204b4a"
                              }
                          `,
                              backgroundColor: "#204b4a",
                            }}
                          >
                            <div className="w-full h-full bg-gradient-to-t from-[#2C3531] to-transparent rounded-b-[30px] flex flex-col justify-between py-5 px-3 ">
                              <div className="w-full flex justify-end">
                                {psy["Ссылка на видеовизитку"] != undefined &&
                                psy["Ссылка на видеовизитку"] != null &&
                                psy["Ссылка на видеовизитку"] != "" ? (
                                  <div
                                    className="w-[40px] h-[40px] rounded-full bg-cream flex justify-center items-center"
                                    onClick={() => {
                                      setVideoSrc(
                                        psy["Ссылка на видеовизитку"]
                                      );
                                      setPlayingVideoPsychoName(psy.Имя);
                                      setSelectedIndex(index);
                                      setPlayStatus("play");
                                    }}
                                  >
                                    <div className="w-[30px] h-[30px] flex justify-center items-center border border-dashed border-green rounded-full">
                                      <CirclePlay size={16} color="#155d5e" />
                                    </div>
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </div>
                              <div>
                                <p className="text-corp-white font-medium text-[16px] mb-2">
                                  {psy.Имя}
                                </p>
                                <p className="text-corp-white italic font-regular text-[11px] mb-4">
                                  {psy["Краткое описание"] != undefined &&
                                  psy["Краткое описание"] != null &&
                                  psy["Краткое описание"] != ""
                                    ? psy["Краткое описание"]
                                    : ""}
                                </p>

                                <div className="flex gap-2">
                                  <Button
                                    intent={
                                      pNames.includes(psy.Имя)
                                        ? "primary"
                                        : "cream-transparent"
                                    }
                                    hover="click"
                                    className="text-[13px]"
                                    size="small"
                                    onClick={() =>
                                      dispatch(tooglePsychologists(psy.Имя))
                                    }
                                  >
                                    {!pNames.includes(psy.Имя)
                                      ? "Выбрать психолога"
                                      : "Психолог выбран"}

                                    {!pNames.includes(psy.Имя) ? (
                                      ""
                                    ) : (
                                      <Check size={16} color="#fff" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div>
                            <CustomVideoPlayer
                              src={psy["Ссылка на видеовизитку"]}
                              index={index}
                              selectedIndex={selectedIndex}
                              showAllCards={() => setPlayingVideoPsychoName("")}
                              setSelectedIndex={setSelectedIndex}
                              setPlayStatus={setPlayStatus}
                              playStatus={playStatus}
                            ></CustomVideoPlayer>
                          </div>
                        </CarouselItem>
                      )}
                    </>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}
        {psychoStatus == "empty" && (
          <div className="flex justify-start p-5">
            <div className="flex-col items-start gap-4 w-full">
              <div className="flex flex-col items-start justify-start gap-2 ">
                <div>
                  <p className="text-base mb-10 text-black text-base mb-10 p-2 border border-green text-dark-green rounded-[15px]">
                    К сожалению, наши психологи не специализируются на вашей
                    ситуации. Но вы можете обратиться в другие организации, в
                    которых вам непременно помогут.
                  </p>
                </div>

                <div className="w-full md:contact-grid-container-2 lg:contact-grid-container-2 sm:contact-grid-container-2 xs:contact-grid-container-1">
                  <div
                    data-name="extra-contacts"
                    className="flex flex-col mb-5"
                  >
                    <h2 className="text-black font-bold text-base">
                      Универсальные службы:
                    </h2>
                    <p>
                      <ul className="flex flex-col gap-2">
                      <li>Горячая линия Центра экстренной психологической помощи
                      МЧС России <span className="text-nowrap">+7 495 989-50-50</span></li>
                      
                      <li>Телефон экстренной психологической помощи для детей и
                      взрослых Института «Гармония» <span className="text-nowrap">+7 800 500-22-87 </span></li>

                      <li>Горячая линия психологической помощи Московского
                      института психоанализа <span className="text-nowrap">+7 800 500-22-87 </span></li>
                      </ul>
                    </p>
                  </div>

                  <div
                    data-name="extra-contacts"
                    className="flex flex-col mb-5"
                  >
                    <h2 className="text-black font-bold text-base">
                      Помощь женщинам в кризисе:
                    </h2>

                    <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>Центр «Насилию.нет» <span className="text-nowrap">+7 495 916-30-00 </span></li>

                      <li>Телефон доверия для женщин, пострадавших от домашнего насилия кризисного Центра «АННА»: <span className="text-nowrap">8 800 7000 600</span></li>
                    </ul>
                    </p>
                  </div>

                  <div
                    data-name="extra-contacts"
                    className="flex flex-col mb-5"
                  >
                    <h2 className="text-black  font-bold text-base">
                      Помощь людям с тяжёлыми заболеваниями:
                    </h2>
                    <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>Горячая линия Центра экстренной психологической помощи
                      МЧС России <span className="text-nowrap">+7 495 989-50-50</span></li>

                      <li>Горячая линия службы «Ясное утро» <span className="text-nowrap">+7 800 100-01-91</span></li>
                      <li>Горячая линия помощи неизлечимо больным людям <span className="text-nowrap">+7 800 700-84-36</span></li>
                    </ul>
                    </p>
                  </div>

                  <div
                    data-name="extra-contacts"
                    className="flex flex-col mb-5"
                  >
                    <h2 className="text-black  font-bold text-base">
                      Помощь детям и подросткам:
                    </h2>
                    <p className="">
                    <ul className="flex flex-col gap-2">
                      <li>Телефон доверия для детей, подростков и их родителей <span className="text-nowrap">8 800 2000 122</span></li>

                      <li>Проект группы кризисных психологов из Петербурга
                      «Твоя территория.онлайн» <span className="text-nowrap">+7 800 200-01-22</span></li>
                      </ul>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PsyCarousel;
