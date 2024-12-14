import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { CircleX } from "lucide-react";
import {
  setName,
  setAge,
  setSexClient,
  setMinClientAge,
  setMaxClientAge,
  setPsychologistExperience,
  toogleSkills,
  toogleQueries,
} from "@/redux/slices/psy";
import Input from "@/components/Input";
import Radio from "@/components/Radio";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import PopupPsyAnketa from "@/components/PopupPsyAnketa";
const PsycologistPage = () => {
  const dispatch = useDispatch();
  const anketa = useSelector((state) => state.psyAnketa);
  const sexClientList = ["Мужчины", "Женщины", "Не имеет значения"];
  const name = anketa.name;
  const age = anketa.age;
  const checkedSexClient = anketa.sexClient;
  const ageClientList = ["Не имеет значения", "Указать возраст (от и до)"];
  const [checkedClientAge, setCheckedClientAge] = useState("");
  const maxClientAge = anketa.maxClientAge;
  const minClientAge = anketa.minClientAge;
  const psyExperience = anketa.psychologistExperience;
  const checkedSkills = anketa.skills;
  const skillsList = [
    "Есть диагностированное психическое заболевание (РПП, СДВГ и прочее)",
    "Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР, депрессивное расстройство и прочее)",
    "Прохожу/назначено медикаментозное лечение от невролога/психиатра",
    "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет",
    "Абьюзивные отношения, домашнее насилие",
    "Алкогольные и химические зависимости",
    "Состояние ужаса, панические атаки",
    "Намерения или попытки суицида",
    "Утрата близкого",
    "Диагностированное смертельное заболевание",
    "Сексуальное насилие во взрослом возрасте",
    "Сексуальное насилие в детстве",
    "Раскрытие женственности и сексуальности",
  ];
  const checkedQueries = anketa.queries;
  const queriesList = [
    "Физические недомогания: постоянная усталость, бессоница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
    "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность",
    "Странные, кошмарные, повторяющиеся сны",
    "Страх будущего и неопределенности",
    "Психологические зависимости: игровые, любовные, виртуальные и прочие",
    "Травматическое событие в настоящем: переезд в другой город, другую страну, потеря работы, смена работы, перенесённая болезнь и прочее",
    "Развод, расставание, измена",
    "Построение близких отношений с противоположным полом",
    "Болезни близкого",
    "Вопросы сексуальной сферы",
    "Построение отношений с родителями, взрослыми детьми",
    "Детские травмы, воспитание, которые влияют на взрослую жизнь",
    "Построение отношений в рабочем коллективе, с друзьями",
    "Недоверие к людям, болезненное одиночество, социофобия",
    "Проблема с выстраиваем собственных границ, их удержанием",
    "Сложности в понимании своих и чужих чувств",
    "Повышенная эмоциональность, эмоциональные всплески, приступы агрессии, поступки под действием эмоций, частые смены настроения",
    "Чувства, которые мешают в жизни: тревожность, навязчивые мысли, стыд, вина, и прочие",
    "Проблемы с самоопределением и самореализацией, поиск своего места в жизни, выгорание",
    "Работа с собой, самооценка, любовь, уважение и ценность себя",
  ];

  function isEmpty(value) {
    return Array.isArray(value) ? value.length === 0 : value === "";
  }

  function removeElementAtValue(arr, value) {
    return arr.filter((element, i) => element !== value);
  }

  function getEmptyKeys(obj) {
    /** Возвращает ключи объекта, где значения пустые.
     * Значение считается пустым, если это пустой массив или пустая строка.*/
    return Object.keys(obj).filter((key) => {
      const value = obj[key];
      return isEmpty(value);
    });
  }

  function validateFields(form) {
    let emptyKeys = getEmptyKeys(form);
    emptyKeys = removeElementAtValue(emptyKeys, "skills");

    if (checkedClientAge == "Не имеет значения") {
      dispatch(setMinClientAge("18"));
      dispatch(setMaxClientAge("100"));
      if (isEmpty(form.minClientAge)) {
        emptyKeys = removeElementAtValue(emptyKeys, "minClientAge");
      }
      if (isEmpty(form.maxClientAge)) {
        emptyKeys = removeElementAtValue(emptyKeys, "maxClientAge");
      }
    } else {
      if (Number(form.maxClientAge) < Number(form.minClientAge)) {
        toast(
          <div className="flex gap-4 items-center">
            <CircleX color="#fff" size={36}></CircleX>
            <div className="flex flex-col text-[#fff]">
              <p className="font-medium">Некорректный возраст клиента</p>
            </div>
          </div>
        );
        return false;
      }

      if (Number(form.maxClientAge) <= 0 || Number(form.minClientAge) <= 0) {
        toast(
          <div className="flex gap-4 items-center">
            <CircleX color="#fff" size={36}></CircleX>
            <div className="flex flex-col text-[#fff]">
              <p className="font-medium">Некорректный возраст клиента</p>
            </div>
          </div>
        );
        return false;
      }
    }
    if (emptyKeys.length == 0) {
      return true;
    }

    toast(
      <div className="flex gap-4 items-center">
        <CircleX color="#fff" size={36}></CircleX>
        <div className="flex flex-col text-[#fff]">
          <p className="font-medium">Вы заполнили не все поля</p>
          <p>Пожалуйста, заполните все поля, чтобы отправить анкету</p>
        </div>
      </div>
    );

    return false;
  }

  const [showErrorBorder, setShowErrorBorder] = useState(false);
  function sendForm(form) {
    if (validateFields(form)) {
      setShowPopup(true);
    } else {
      setShowErrorBorder(true);
    }
  }

  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <PopupPsyAnketa
        isVisible={showPopup}
        closeFn={() => setShowPopup(false)}
      ></PopupPsyAnketa>
      <div className="bg-dark-green w-full h-full flex flex-col justify-center items-center">
        <Toaster position="top-center"></Toaster>
        <div data-name="container" className="max-w-[800px]">
          <div data-name="header" className="flex flex-col items-center">
            <h1
              data-name="title"
              className="text-regular text-cream text-center max-md:text-left text-5xl font-medium pt-14 pb-8 px-5"
            >
              Анкета психолога-Хранителя
            </h1>
            <p
              data-name="description"
              className="text-regular text-corp-white text-center text-[19px] max-w-[680px] pb-16 px-5 max-md:text-left"
            >
              ВНИМАНИЕ! Анкета только для психологов из сообщества "Хранители".
              Если вы хотите подать заявку в сообщество, то пожалуйста
              воспользуйтесь{" "}
              <a
                target="_top"
                href="https://hrani.live/community"
                className="border-b-[3px] border-cream"
              >
                формой на сайте
              </a>
            </p>
          </div>
          <div data-name="survey" className="flex flex-col gap-14 px-5">
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl  items-center justify-center rounded-full hidden md:flex md:-ml-[56px]">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Как вас зовут?
                  </h2>
                </div>
              </div>
              <Input
                placeholder="Введите ваше имя"
                intent="cream"
                value={name}
                className={showErrorBorder && isEmpty(name) ? "border-red" : ""}
                onChangeFn={(e) => dispatch(setName(e))}
              ></Input>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Сколько вам лет?
                  </h2>
                </div>
              </div>
              <Input
                placeholder="Введите цифру"
                intent="cream"
                type="number"
                className={showErrorBorder && isEmpty(age) ? "border-red" : ""}
                value={age}
                onChangeFn={(e) => dispatch(setAge(e))}
              ></Input>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  3
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Есть ли у вас опыт личной терапии? Сколько лет?
                  </h2>
                </div>
              </div>
              <Input
                placeholder="Введите информацию"
                intent="cream"
                className={
                  showErrorBorder && isEmpty(psyExperience) ? "border-red" : ""
                }
                value={psyExperience}
                onChangeFn={(e) => dispatch(setPsychologistExperience(e))}
              ></Input>
            </div>
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  4
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    С клиентами какого пола вы готовы работать?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Мы будем предлагать вам клиентов только этого пола
                  </p>
                </div>
              </div>
              <ul
                className={`flex flex-col gap-2 p-2 ${
                  showErrorBorder && isEmpty(checkedSexClient)
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {sexClientList.map((sex, index) => (
                  <li>
                    <Radio
                      name="sex"
                      intent="cream"
                      id={`sex_${index}`}
                      onChange={() => dispatch(setSexClient(sex))}
                      checked={checkedSexClient == sex ? true : false}
                    >
                      {sex}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  5
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    С клиентами какого возраста вы готовы работать?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Постарайтесь указать широкий диапазон. Мы не будем
                    предлагать вам клиента, если он не будет попадать в
                    указанные рамки.
                  </p>
                </div>
              </div>
              <div>
                <ul
                  className={`flex flex-col gap-2 p-2 ${
                    showErrorBorder && isEmpty(checkedClientAge)
                      ? "border-red border rounded-[15px]"
                      : ""
                  }`}
                >
                  {ageClientList.map((age, index) => (
                    <li>
                      <Radio
                        name="age"
                        intent="cream"
                        id={`age_${index}`}
                        onChange={() => setCheckedClientAge(age)}
                        checked={checkedClientAge == age ? true : false}
                      >
                        {age}
                      </Radio>
                    </li>
                  ))}
                </ul>
                {checkedClientAge == "Указать возраст (от и до)" && (
                  <div className="flex flex-wrap gap-4 items-center mt-4">
                    <Input
                      intent="cream"
                      type="number"
                      placeholder="От"
                      min={0}
                      className={`grow ${
                        showErrorBorder && isEmpty(minClientAge)
                          ? "border-red"
                          : ""
                      }`}
                      onChangeFn={(e) => dispatch(setMinClientAge(e))}
                      value={minClientAge}
                    ></Input>
                    <Input
                      intent="cream"
                      type="number"
                      min={0}
                      placeholder="До"
                      className={`grow ${
                        showErrorBorder && isEmpty(maxClientAge)
                          ? "border-red"
                          : ""
                      }`}
                      onChangeFn={(e) => dispatch(setMaxClientAge(e))}
                      value={maxClientAge}
                    ></Input>
                  </div>
                )}
              </div>
            </div>
            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full -ml-[56px]">
                  6
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    С чем из этого вы работаете?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Это список тяжёлых запросов. Если появится клиент с запросом
                    из этого списка, с которым вы не работаете, мы его к вам не
                    направим.
                  </p>
                </div>
              </div>
              <ul className={`flex flex-col gap-2 p-2`}>
                {skillsList.map((skill, index) => (
                  <li>
                    <Checkbox
                      name="skills"
                      intent="cream"
                      id={`skill_${index}`}
                      onChange={() => dispatch(toogleSkills(skill))}
                      checked={checkedSkills.indexOf(skill) > -1 ? true : false}
                    >
                      {skill}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>

            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-cream text-black font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  7
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    На решении каких запросов вы специализируетесь?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Это менее тяжёлые запросы. Среди клиентов прошедших отбор
                    через предыдущий список мы будем отдавать предпочтение тем,
                    у кого с вами в этом списке больше пересечений.
                  </p>
                </div>
              </div>
              <ul
                className={`flex flex-col gap-2 p-2 ${
                  showErrorBorder && isEmpty(checkedQueries)
                    ? "border-red border rounded-[15px]"
                    : ""
                }`}
              >
                {queriesList.map((query, index) => (
                  <li>
                    <Checkbox
                      name="query"
                      intent="cream"
                      id={`query_${index}`}
                      onChange={() => dispatch(toogleQueries(query))}
                      checked={
                        checkedQueries.indexOf(query) > -1 ? true : false
                      }
                    >
                      {query}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="my-20 px-5">
            <Button
              intent={"cream"}
              hover={"primary"}
              onClick={() => sendForm(anketa)}
            >
              Отправить форму
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PsycologistPage;
