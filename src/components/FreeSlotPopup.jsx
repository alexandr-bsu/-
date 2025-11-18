import React, { useState, useEffect } from "react";
import Button from "./Button";
import Radio from "./Radio";
import QueryString from "qs";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { spliceSlot, setStateSlotLoading, setStateSlotOk } from "../redux/slices/psycoSlotsSlice";

const FreeSlotPopup = ({ slotDate, slotId, queryDate, queryTime, closeFn }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [repeatPeriod, setRepeatPeriod] = useState("нет");
  const [isLoadingPlan, setIsLoadingPlan] = useState(true);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  const slotsRedux = useSelector((state) => state.psyco.freeSlots);
  const dispatch = useDispatch();

  const secret = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.secret;

  const planningOptions = [
    { value: "нет", label: "Нет" },
    { value: "раз в неделю", label: "Раз в неделю" },
    { value: "раз в 2 недели", label: "Раз в 2 недели" },
    { value: "раз в 3 недели", label: "Раз в 3 недели" },
    { value: "раз в месяц", label: "Раз в месяц" }
  ];

  // Загружаем текущий статус планирования при открытии попапа
  useEffect(() => {
    const fetchPlanningStatus = async () => {
      try {
        const slotParam = slotId || slotDate;
        console.log("FreeSlotPopup: Загружаем планирование для слота:", slotParam, "slotId:", slotId, "slotDate:", slotDate);

        const response = await axios.get("https://n8n-v2.hrani.live/webhook/get-root-planned-free-slot", {
          params: {
            secret: secret,
            slot: slotParam // Используем UUID слота, если есть, иначе fallback на дату слота
          }
        });

        if (response.data && response.data.repeat_period) {
          setRepeatPeriod(response.data.repeat_period);
        }
      } catch (error) {
        console.error("Ошибка при загрузке статуса планирования:", error);
        // Если ошибка, оставляем значение по умолчанию "нет"
      } finally {
        setIsLoadingPlan(false);
      }
    };

    if (secret && (slotId || slotDate)) {
      fetchPlanningStatus();
    } else {
      setIsLoadingPlan(false);
    }
  }, [secret, slotId, slotDate]);

  const handlePlanningChange = async (newPeriod) => {
    if (isSavingPlan || newPeriod === repeatPeriod) return;

    setIsSavingPlan(true);

    try {
      const slotParam = slotId || slotDate;
      console.log("FreeSlotPopup: Сохраняем планирование для слота:", slotParam, "slotId:", slotId, "slotDate:", slotDate);

      await axios.post("https://n8n-v2.hrani.live/webhook/plan-free-slots", {
        secret: secret,
        slot: slotParam, // Используем UUID слота, если есть, иначе fallback на дату слота
        repeat_period: newPeriod
      });

      setRepeatPeriod(newPeriod);
      toast.success("Настройки планирования сохранены");
    } catch (error) {
      console.error("Ошибка при сохранении планирования:", error);
      toast.error("Ошибка при сохранении настроек планирования");
    } finally {
      setIsSavingPlan(false);
    }
  };

  const handleDeleteSlot = () => {
    if (isDeleting) return;

    setIsDeleting(true);
    const slotKey = slotDate;

    // Находим индекс слота для удаления
    const index = slotsRedux.findIndex((s) => s.slot === slotKey);

    if (index === -1) {
      toast.error("Слот не найден");
      setIsDeleting(false);
      return;
    }

    dispatch(setStateSlotLoading(slotKey));

    axios({
      url: "https://n8n-v2.hrani.live/webhook/delete-slot",
      data: {
        slot: slotKey,
        secret: secret,
      },
      method: "POST",
    })
      .then(() => {
        dispatch(setStateSlotOk(slotKey));
        dispatch(spliceSlot(index));
        toast.success(`Слот ${slotKey} удалён`);
        closeFn();
      })
      .catch(() => {
        dispatch(setStateSlotOk(slotKey));
        toast.error(`Ошибка! Слот ${slotKey} не удалён. Повторите попытку`);
        setIsDeleting(false);
      });
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-full flex justify-center items-center p-5 z-20 bg-[#000000] bg-opacity-20">
      <div className="bg-white rounded-[30px] w-full max-w-[960px] mx-5 max-h-[650px] overflow-y-auto">
        <div className="bg-white p-5 border-b border-b-dark-green w-full flex justify-between items-center">
          <h2 className="text-dark-green font-medium text-xl">
            Свободный слот - {slotDate}
          </h2>
          <img
            src="static/close.png"
            className="cursor-pointer w-5 h-5"
            onClick={closeFn}
            alt="Закрыть"
          />
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Секция планирования */}
          <div className="border-b border-b-dark-green pb-4">
            <h3 className="text-dark-green font-medium mb-3">Планирование слота</h3>

            {isLoadingPlan ? (
              <div className="flex items-center justify-center py-4">
                <svg
                  width={20}
                  height={20}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 200 200"
                >
                  <radialGradient
                    id="a13"
                    cx=".66"
                    fx=".66"
                    cy=".3125"
                    fy=".3125"
                    gradientTransform="scale(1.5)"
                  >
                    <stop offset="0" stopColor="#4a5d23"></stop>
                    <stop offset=".3" stopColor="#4a5d23" stopOpacity=".9"></stop>
                    <stop offset=".6" stopColor="#4a5d23" stopOpacity=".6"></stop>
                    <stop offset=".8" stopColor="#4a5d23" stopOpacity=".3"></stop>
                    <stop offset="1" stopColor="#4a5d23" stopOpacity="0"></stop>
                  </radialGradient>
                  <circle
                    transformOrigin="center"
                    fill="none"
                    stroke="url(#a13)"
                    strokeWidth="16"
                    strokeLinecap="round"
                    strokeDasharray="200 1000"
                    strokeDashoffset="0"
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
                    />
                  </circle>
                </svg>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 p-2">
                {planningOptions.map((option, index) => (
                  <li key={option.value}>
                    <Radio
                      name="planning"
                      intent="primary"
                      id={`planning_${index}`}
                      value={option.value}
                      onChange={(e) => handlePlanningChange(e.target.value)}
                      checked={repeatPeriod === option.value}
                    // disabled={isSavingPlan}
                    >
                      {option.label}
                    </Radio>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Секция удаления */}
          <div>
            {/* <p className="text-dark-green text-center mb-4">
              Вы уверены, что хотите удалить этот слот?
            </p> */}

            <div className="flex gap-3">
              {/* <Button
                intent="primary-transparent"
                hover="primary"
                onClick={closeFn}
                className="flex-1"
              >
                Отмена
              </Button> */}

              <Button
                intent="primary"
                hover="primary"
                onClick={handleDeleteSlot}
                disabled={isDeleting}
                className="flex-1"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      width={16}
                      height={16}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 200"
                    >
                      <radialGradient
                        id="a12"
                        cx=".66"
                        fx=".66"
                        cy=".3125"
                        fy=".3125"
                        gradientTransform="scale(1.5)"
                      >
                        <stop offset="0" stopColor="#ffffff"></stop>
                        <stop offset=".3" stopColor="#ffffff" stopOpacity=".9"></stop>
                        <stop offset=".6" stopColor="#ffffff" stopOpacity=".6"></stop>
                        <stop offset=".8" stopColor="#ffffff" stopOpacity=".3"></stop>
                        <stop offset="1" stopColor="#ffffff" stopOpacity="0"></stop>
                      </radialGradient>
                      <circle
                        transformOrigin="center"
                        fill="none"
                        stroke="url(#a12)"
                        strokeWidth="16"
                        strokeLinecap="round"
                        strokeDasharray="200 1000"
                        strokeDashoffset="0"
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
                        />
                      </circle>
                    </svg>
                    Удаление...
                  </div>
                ) : (
                  "Удалить слот"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeSlotPopup;