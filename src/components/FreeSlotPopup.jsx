import React, { useState, useEffect } from "react";
import { Button } from "./ui/NewButon";
import Radio from "./Radio";
import QueryString from "qs";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { spliceSlot, setStateSlotLoading, setStateSlotOk, notifySlotCleared, pushSlot } from "../redux/slices/psycoSlotsSlice";
import { format } from "date-fns";

const FreeSlotPopup = ({ slotDate, slotId, queryDate, queryTime, closeFn, onSlotDeleted }) => {
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
    // { value: "раз в 3 недели", label: "Раз в 3 недели" },
    { value: "раз в месяц", label: "Раз в месяц" }
  ];

  // Загружаем текущий статус планирования при открытии попапа
  useEffect(() => {
    const fetchPlanningStatus = async () => {
      try {
        const slotParam = slotId || slotDate;

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

  // Функция для правильного склонения слова "создан/созданы"
  const getCreatedWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'Созданы';
    }
    
    if (lastDigit === 1) {
      return 'Создан';
    }
    
    return 'Созданы';
  };

  // Функция для правильного склонения слова "слот"
  const getSlotWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'слотов';
    }
    
    if (lastDigit === 1) {
      return 'слот';
    }
    
    if (lastDigit >= 2 && lastDigit <= 4) {
      return 'слота';
    }
    
    return 'слотов';
  };

  // Функция для правильного склонения "повторяющийся/повторяющихся"
  const getRepeatWord = (count) => {
    const lastDigit = count % 10;
    const lastTwoDigits = count % 100;
    
    if (lastTwoDigits >= 11 && lastTwoDigits <= 19) {
      return 'повторяющихся';
    }
    
    if (lastDigit === 1) {
      return 'повторяющийся';
    }
    
    return 'повторяющихся';
  };

  // Функция для вычисления дат повторяющихся слотов
  const calculateRepeatDates = (slotDateStr, repeatPeriod) => {
    if (repeatPeriod === "нет") return [];

    // Парсим дату из формата "dd.MM HH:mm" (например, "09.12 20:00")
    const [datePart, timePart] = slotDateStr.split(' ');
    const [day, month] = datePart.split('.');
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // 1-12
    
    // Определяем год для начальной даты
    // Если месяц слота уже прошел в текущем году, используем следующий год
    let year = currentYear;
    if (parseInt(month) < currentMonth || (parseInt(month) === currentMonth && parseInt(day) < now.getDate())) {
      // Если дата в прошлом, используем следующий год
      year = currentYear + 1;
    }
    
    // Создаем начальную дату
    const startDate = new Date(year, parseInt(month) - 1, parseInt(day));
    
    // Определяем интервал и количество повторений
    let daysInterval = 0;
    let maxRepeats = 0;
    
    switch (repeatPeriod) {
      case "раз в неделю":
        daysInterval = 7;
        maxRepeats = 4; // 4 дня 
        break;
      case "раз в 2 недели":
        daysInterval = 14;
        maxRepeats = 2; // 2 дня
        break;
      case "раз в месяц":
        daysInterval = 30; // Приблизительно месяц
        maxRepeats = 1; // 2 месяца
        break;
      default:
        return [];
    }

    const dates = [];
    for (let i = 1; i <= maxRepeats; i++) {
      const nextDate = new Date(startDate);
      
      if (repeatPeriod === "раз в месяц") {
        // Для месяца добавляем месяц
        nextDate.setMonth(nextDate.getMonth() + i);
      } else {
        // Для недель добавляем дни
        nextDate.setDate(nextDate.getDate() + (daysInterval * i));
      }
      
      // Проверяем, что дата не в прошлом
      if (nextDate < now) {
        continue;
      }
      
      // Форматируем дату в формат "dd.MM HH:mm"
      const formattedDate = format(nextDate, "dd.MM");
      dates.push(`${formattedDate} ${timePart}`);
    }
    
    return dates;
  };

  const handlePlanningChange = async (newPeriod) => {
    if (isSavingPlan || newPeriod === repeatPeriod) return;

    setIsSavingPlan(true);

    try {
      const slotParam = slotId || slotDate;

      // Сначала сохраняем настройки повторения
      const response = await axios.post("https://n8n-v2.hrani.live/webhook/plan-free-slots", {
        secret: secret,
        slot: slotParam,
        repeat_period: newPeriod
      });

      setRepeatPeriod(newPeriod);

      // Если выбрано повторение, создаем слоты для будущих дат
      if (newPeriod !== "нет" && slotDate) {
        const repeatDates = calculateRepeatDates(slotDate, newPeriod);

        // Показываем toast о начале создания слотов
        const creatingRepeatWord = repeatDates.length === 1 ? 'повторяющегося' : 'повторяющихся';
        const creatingSlotWord = repeatDates.length === 1 ? 'слота' : 'слотов';
        toast.loading(`Создание ${repeatDates.length} ${creatingRepeatWord} ${creatingSlotWord}...`, { id: 'creating-slots' });

        // Создаем слоты последовательно с задержкой между каждым
        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < repeatDates.length; i++) {
          const slotString = repeatDates[i];
          
          // Добавляем задержку перед каждым созданием слота (кроме первого)
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
          }

          try {
            const slotResponse = await axios.post("https://n8n-v2.hrani.live/webhook/add-slot", {
              secret: secret,
              slot: slotString
            });

            // Добавляем слот в Redux
            if (slotResponse.data && slotResponse.data.id) {
              dispatch(pushSlot({
                slot: slotString,
                id: slotResponse.data.id
              }));
            } else {
              dispatch(pushSlot(slotString));
            }
            
            successCount++;
          } catch (error) {
            console.error(`FreeSlotPopup: Ошибка при создании слота ${slotString}:`, error);
            failCount++;
          }
        }

        // Закрываем toast загрузки и показываем результат
        toast.dismiss('creating-slots');
        
        if (successCount > 0) {
          const createdWord = getCreatedWord(successCount);
          const successRepeatWord = getRepeatWord(successCount);
          const successSlotWord = getSlotWord(successCount);
          const errorText = failCount > 0 ? ` (${failCount} ${failCount === 1 ? 'ошибка' : failCount <= 4 ? 'ошибки' : 'ошибок'})` : '';
          toast.success(`${createdWord} ${successCount} ${successRepeatWord} ${successSlotWord}${errorText}`);
        } else {
          toast.error("Не удалось создать повторяющиеся слоты");
        }
      } else {
        toast.success("Настройки планирования сохранены");
      }

      // Перезагружаем слоты после создания
      if (onSlotDeleted) {
        setTimeout(() => {
          onSlotDeleted();
        }, 500);
      }
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

        // Парсим дату и время из строки слота для уведомления о сбросе
        const slotParts = slotKey.split(' ');
        if (slotParts.length >= 2) {
          const slotDatePart = slotParts[0]; // "dd.MM"
          const slotTime = slotParts[1]; // "HH:mm"

          // Преобразуем дату в формат yyyy-MM-dd
          const currentYear = new Date().getFullYear();
          const [day, month] = slotDatePart.split('.');
          const slotDate = `${currentYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

          // Отправляем уведомление о сбросе слота
          dispatch(notifySlotCleared({
            date: slotDate,
            time: slotTime
          }));
        }

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
      <div className="bg-white rounded-[30px] w-full max-w-[660px] mx-5 max-h-[650px] overflow-y-auto">
        <div className="bg-white p-5 border-b border-b-dark-green w-full flex justify-between items-center">
          <h2 className="text-green font-bold text-2xl">
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
            <h3 className="text-green font-bold text-[19px] mb-3">Повторить слот</h3>

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
            {/* <p className="text-green text-center mb-4">
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
                variant={'primary'}
                className="rounded-full flex-1"
                onClick={handleDeleteSlot}
                disabled={isDeleting}

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