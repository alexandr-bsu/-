import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CircleX, Instagram, Check, Camera, Clapperboard, Image } from "lucide-react";
import { Uploady, UPLOADER_EVENTS } from "@rpldy/uploady";
import UploadButton from "@rpldy/upload-button";

import {
  setName,
  setAge,
  setSexClient,
  setMinClientAge,
  setMaxClientAge,
  setPsychologistPersonalTherapyDuration,
  toogleSkills,
  toogleQueries,
  setMainModal,
  toogleAdditionalModals,
  setTelegram,
  setSite,
  setVk,
  setEducationList,
  setAnketaData,
  setAbout,
  setIsMarried,
  setMinPrice,
  setMaxPrice,
  setCity,
  setHasChildren,
  setHelpHandMode,
  setAllWithPriceMode,
  setPsychologistPersonalTherapyType,
  setFirstFreeMode
} from "@/redux/slices/psy";
import Input from "@/components/Input";
import Radio from "@/components/Radio";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import QueryString from "qs";
import PopupPsyAnketa from "@/components/PopupPsyAnketa";
import EduList from "@/components/EduList";
import axios from "axios";
import TextArea from "@/components/TextArea";


const PsycologistPage = () => {


  const uploaderPhoto = useMemo(() => ({
    [UPLOADER_EVENTS.ITEM_START]: (item) => {
      console.log(`Item Start - ${item.id} : ${item.file.name}`);
      setUploadPhotoState('loading')
    },
    [UPLOADER_EVENTS.ITEM_FINISH]: (item) => {
      console.log(`Item Finish - ${item.id} : ${item.file.name}`);
      setUploadPhotoState('success')
    },
  }), []);

  const [uploadPhotoState, setUploadPhotoState] = useState('empty')


  const uploaderVideo = useMemo(() => ({
    [UPLOADER_EVENTS.ITEM_START]: (item) => {
      console.log(`Item Start - ${item.id} : ${item.file.name}`);
      setUploadVideoState('loading')
    },
    [UPLOADER_EVENTS.ITEM_FINISH]: (item) => {
      console.log(`Item Finish - ${item.id} : ${item.file.name}`);
      setUploadVideoState('success')
    },
  }), []);

  const [uploadVideoState, setUploadVideoState] = useState('empty')

  const filterByTypePhoto = useCallback((file) => {
    //filter out files larger than 5MB
    console.log(file)
    return True
  }, []);

  const dispatch = useDispatch();
  const [isNameInputEnabled, setIsNameInputEnabled] = useState('true')
  const anketa = useSelector((state) => state.psyAnketa);
  const sexClientList = ["Мужчины", "Женщины", "Не имеет значения"];
  const name = anketa.name;
  const age = anketa.age;
  const checkedSexClient = anketa.sexClient;
  const checkedMainModal = anketa.mainModal
  const ageClientList = ["Не имеет значения", "Указать возраст (от и до)"];
  const [checkedClientAge, setCheckedClientAge] = useState("Указать возраст (от и до)");
  const maxClientAge = anketa.maxClientAge;
  const minClientAge = anketa.minClientAge;
  const psychologistPersonalTherapyDuration = anketa.psychologistPersonalTherapyDuration;
  const psychologistPersonalTherapyType = anketa.psychologistPersonalTherapyType;
  const checkedSkills = anketa.skills;
  const checkedAdditionalModals = anketa.additionalModals;
  const about = anketa.about
  const isMarried = anketa.isMarried
  const hasChildren = anketa.hasChildren
  const maxPrice = anketa.maxPrice;
  const minPrice = anketa.minPrice;
  const helpHandMode = anketa.helpHandMode
  const allWithPriceMode = anketa.allWithPriceMode
  const firstFreeMode = anketa.firstFreeMode
  const city = anketa.city
  const skillsList = [
    // "Есть диагностированное психическое заболевание (РПП, СДВГ и др)",
    "Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР и др)",
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
    "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
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

  const main_modal_list = [
    'Аналитическая психология',
    'Психоанализ',
    'КПТ',
    'Гештальт',
    // 'Полимодальный метод'
  ]

  const additional_modal_list = [
    'Аналитическая психология',
    'Психоанализ',
    'КПТ',
    'Гештальт',
    // 'Полимодальный метод',
    'Нет дополнительной модальности'
  ]



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

  function checkEducation(education) {
    console.log(education)
    for (let edu of education) {
      if (edu.educationItemTitle.length == 0 || edu.educationItemType.length == 0 || edu.educationItemYear.length == 0 || edu.educationItemProgramTitle.length == 0) {
        return false
      }
    }

    return true
  }

  function validateFields(form) {
    console.log('form', form)
    let emptyKeys = getEmptyKeys(form);
    emptyKeys = removeElementAtValue(emptyKeys, "skills");
    emptyKeys = removeElementAtValue(emptyKeys, "telegram_link");
    emptyKeys = removeElementAtValue(emptyKeys, "site_link");
    emptyKeys = removeElementAtValue(emptyKeys, "vk_link");
    emptyKeys = removeElementAtValue(emptyKeys, "education");
    emptyKeys = removeElementAtValue(emptyKeys, "firstFreeMode");
    emptyKeys = removeElementAtValue(emptyKeys, "helpHandMode");
    emptyKeys = removeElementAtValue(emptyKeys, "allWithPriceMode");
    emptyKeys = removeElementAtValue(emptyKeys, "maxPrice");

    if (form.allWithPriceMode == false && form.helpHandMode == false && form.firstFreeMode == false) {

      toast(
        <div className="flex gap-4 items-center">
          <CircleX color="#fff" size={36}></CircleX>
          <div className="flex flex-col text-[#fff]">
            <p className="font-medium">Вы заполнили не все поля</p>
            <p>Пожалуйста, заполните все поля, чтобы отправить анкету</p>
          </div>
        </div>
      );

      return false
    }


    if (!checkEducation(form.education)) {
      toast(
        <div className="flex gap-4 items-center">
          <CircleX color="#fff" size={36}></CircleX>
          <div className="flex flex-col text-[#fff]">
            <p className="font-medium">Заполните все поля из раздела Образование</p>
          </div>
        </div>
      );

      return false
    }

    if (uploadPhotoState == 'empty') {
      toast(
        <div className="flex gap-4 items-center">
          <CircleX color="#fff" size={36}></CircleX>
          <div className="flex flex-col text-[#fff]">
            <p className="font-medium">Пожалуйста, загрузите свою фотографию</p>
          </div>
        </div>
      );

      return false
    }

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

    if (!city && city == undefined) {
      toast(
        <div className="flex gap-4 items-center">
          <CircleX color="#fff" size={36}></CircleX>
          <div className="flex flex-col text-[#fff]">
            <p className="font-medium">Напишите название города</p>
          </div>
        </div>
      );
      return false;

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

    console.log(emptyKeys)
    return false;
  }

  const [showErrorBorder, setShowErrorBorder] = useState(false);
  function sendForm(form) {
    if (validateFields(form)) {
      setShowPopup(true);
      // processPending()
    } else {
      setShowErrorBorder(true);
    }
  }

  const [showPopup, setShowPopup] = useState(false);
  const psychologist_id = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.psychologist_id;

  useEffect(() => {
    axios(
      {
        url: "https://n8n-v2.hrani.live/webhook/download-psychologist-education",
        params: { psychologist_id }
      }
    ).then(
      resp => dispatch(setEducationList(resp.data))
    )

    axios(
      {
        url: "https://n8n-v2.hrani.live/webhook/load-psy-anketa",
        params: { psychologist_id }
      }
    ).then(
      resp => {
        dispatch(setAnketaData(resp.data))
        if (resp.data?.name?.length != 0) {
          setIsNameInputEnabled(false)
        }
      }
    )

    axios(
      {
        url: "https://n8n-v2.hrani.live/webhook/has-photo",
        params: { psychologist_id }
      }
    ).then(
      resp => {
        if (resp.data.result) {
          setUploadPhotoState('success')
        }
      }
    )

    axios(
      {
        url: "https://n8n-v2.hrani.live/webhook/has-video",
        params: { psychologist_id }
      }
    ).then(
      resp => {
        if (resp.data.result) {
          setUploadVideoState('success')
        }

      }
    )
  }, [])

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
              Анкета предназначена для заполнения информации в вашей карточке Хранителя на сайте сообщества. После заполнения мы сохраним анкету и вы сможете вернуться к ней в любое время по ссылке в своем <span className="whitespace-nowrap">чат-боте</span>.
              {/* <a
                target="_top"
                href="https://hrani.live/community"
                className="border-b-[3px] border-cream"
              >
                формой на сайте
              </a> */}
            </p>
          </div>
          <div data-name="survey" className="flex flex-col gap-14 px-5">
            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10  text-corp-white font-black text-xl  items-center justify-center rounded-full hidden md:flex md:-ml-[56px]">
                  1
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Как вас зовут?
                  </h2>

                </div>
              </div>
              <Input
                placeholder="Пожалуйста, введите свою Фамилию и Имя в именительном падеже именно в таком порядке"
                intent="cream"
                disabled={!isNameInputEnabled}
                value={name}
                className={showErrorBorder && isEmpty(name) ? "border-red" : ""}
                onChangeFn={(e) => dispatch(setName(e))}
              ></Input>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10  text-corp-white font-black text-xl  items-center justify-center rounded-full hidden md:flex md:-ml-[56px]">
                  2
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    В каком городе вы находитесь?
                  </h2>

                </div>
              </div>
              <Input
                placeholder="Пожалуйста, введите введите свой город"
                intent="cream"
                value={city}
                className={showErrorBorder && isEmpty(city) ? "border-red" : ""}
                onChangeFn={(e) => dispatch(setCity(e))}
              ></Input>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  3
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Сколько вам лет?
                  </h2>
                </div>
              </div>
              <Input
                placeholder="Введите цифру - она будет использоваться для подбора клиентов"
                intent="cream"
                type="number"
                className={showErrorBorder && isEmpty(age) ? "border-red" : ""}
                value={age}
                onChangeFn={(e) => dispatch(setAge(e))}
              ></Input>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  4
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Какой у вас опыт личной терапии?
                  </h2>
                  <p className="text-corp-white text-sm">Укажите модальность и срок</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select onValueChange={(e) => dispatch(setPsychologistPersonalTherapyType(e))} value={psychologistPersonalTherapyType}>
                  <SelectTrigger className={`md:min-w-[300px] md:max-w-[300px] max-md:grow rounded-[15px] py-3 h-full text-corp-white ${showErrorBorder && isEmpty(psychologistPersonalTherapyType) ? "border-red" : "border-cream"}`}>
                    <SelectValue placeholder="Выберите модальность" />
                  </SelectTrigger>
                  <SelectContent className="bg-green text-corp-white">
                    <SelectItem value="Аналитическая психология">Аналитическая психология</SelectItem>
                    <SelectItem value="Психоанализ">Психоанализ</SelectItem>
                    <SelectItem value="КПТ">КПТ</SelectItem>
                    <SelectItem value="Гештальт">Гештальт</SelectItem>
                    <SelectItem value="Полимодальный метод">Полимодальный метод</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Укажите срок в часах или месяцах или годах"
                  intent="cream"
                  className={`grow ${showErrorBorder && isEmpty(psychologistPersonalTherapyDuration) ? "border-red" : ""
                    }`}
                  value={psychologistPersonalTherapyDuration}
                  onChangeFn={(e) => dispatch(setPsychologistPersonalTherapyDuration(e))}
                ></Input>
              </div>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white  font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  5
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Напишите пару слов о себе
                  </h2>
                </div>
              </div>
              <TextArea
                placeholder='Введите информацию в раздел "О Хранителе" на сайте - вы можете сказать пару слов своими словами о том, почему начали заниматься психологией, что для вас клиенты, почему нравится помогать людям, какой у вас стиль (чуткий или  прямолинейный, вы ближе к эзотерике или научному подходу и тд), отметьте модальности которые изучаете и техники, которые используете, к чему хотите прийти сами и привести клиента'
                intent="cream"
                rows={7}
                className={`${showErrorBorder && isEmpty(about) ? "border-red" : ""} text-corp-white`}

                value={about}
                onChangeFn={(e) => dispatch(setAbout(e))}
              ></TextArea>
            </div>

            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full -ml-[56px]">
                  6
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Ваше семейное положение (необязательное поле)
                  </h2>
                  <p className="text-corp-white text-sm">
                    Эта информация для тех клиентов, кому в психологе важен персональный жизненный опыт. Она будет указана отдельно в разделе "О Хранителе"
                  </p>
                </div>
              </div>
              <ul className={`flex flex-col gap-2 p-2 rounded-[15px]`}>

                <li>
                  <Checkbox
                    name="family"
                    intent="cream"
                    id={`family_${1}`}
                    onChange={() => dispatch(setIsMarried(!isMarried))}
                    checked={isMarried}
                  >
                    Замужем/женат
                  </Checkbox>
                </li>

                <li>
                  <Checkbox
                    name="family"
                    intent="cream"
                    id={`family_${2}`}
                    onChange={() => dispatch(setHasChildren(!hasChildren))}
                    checked={hasChildren}
                  >
                    Есть дети
                  </Checkbox>
                </li>

              </ul>
            </div>

            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  7
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Какую модальность хотите указать как основную?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Этот подход  будет указан в вашей карточке на сайте как основной
                  </p>
                </div>
              </div>
              <ul
                className={`flex flex-col gap-2 p-2 ${showErrorBorder && isEmpty(checkedMainModal)
                  ? "border-red border rounded-[15px]"
                  : ""
                  }`}
              >
                {main_modal_list.map((modal, index) => (
                  <li>
                    <Radio
                      name="main_modal"
                      intent="cream"
                      id={`main_modal_${index}`}
                      onChange={() => dispatch(setMainModal(modal))}
                      checked={checkedMainModal == modal ? true : false}
                    >
                      {modal}
                    </Radio>
                  </li>
                ))}
              </ul>
            </div>
            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full -ml-[56px]">
                  8
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Какие модальности вы бы хотели указать как дополнительные?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Эти подходы будут указаны в вашей карточке на сайте как дополнительные
                  </p>
                </div>
              </div>
              <ul className={`flex flex-col gap-2 p-2 ${showErrorBorder && isEmpty(checkedAdditionalModals)
                ? "border-red border rounded-[15px]"
                : ""
                }`}>
                { }
                {additional_modal_list.map((ad_modal, index) => (
                  <li>
                    <Checkbox
                      name="ad_modal"
                      intent="cream"
                      id={`ad_modal_${index}`}
                      onChange={() => dispatch(toogleAdditionalModals(ad_modal))}
                      checked={checkedAdditionalModals.indexOf(ad_modal) > -1 ? true : false}
                    >
                      {ad_modal}
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>

            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  9
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Расскажите клиентам про свое психологическое образование
                  </h2>
                  <p className="text-corp-white text-sm">
                    Это образование будет указано в вашей карточке - можно указать любое количество завершенных и текущих образовательных программ
                  </p>
                </div>
              </div>
              <div>

                <EduList showError={showErrorBorder}></EduList>

              </div>
            </div>


            <div data-name="question" className="flex flex-col gap-4">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  10
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
                className={`flex flex-col gap-2 p-2 ${showErrorBorder && isEmpty(checkedSexClient)
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
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  11
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
                  className={`flex flex-col gap-2 p-2 ${showErrorBorder && isEmpty(checkedClientAge)
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
                      className={`grow ${showErrorBorder && isEmpty(minClientAge)
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
                      className={`grow ${showErrorBorder && isEmpty(maxClientAge)
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
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full ">
                  12
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    По какой стоимости вы готовы проводить сессии?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Эта стоимость будет указана на вашей карточке на сайте - по ней клиент сможет записаться к вам на первую сессию
                  </p>
                </div>
              </div>
              <div>


                <div className="flex flex-wrap gap-4 items-center mt-4">
                  <Input
                    intent="cream"
                    type="number"
                    placeholder="Введите стоимость сессии"
                    min={0}
                    className={`grow ${showErrorBorder && isEmpty(minPrice)
                      ? "border-red"
                      : ""
                      }`}
                    onChangeFn={(e) => dispatch(setMinPrice(e))}
                    value={minPrice}
                  ></Input>
                </div>
              </div>
            </div>


            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full -ml-[56px]">
                  13
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    С какими условиями первых сессий вы готовы работать?
                  </h2>
                  <p className="text-corp-white text-sm">
                    Сообщество ежемесячно предоставляет вам определенное количество из разных источников. Вы можете выбрать с какими источниками вы готовы работать. Первый пункт выбран по умолчанию - любое количество клиентов могут записаться к вам через наш сайт после прочтения вашей статьи в онлайн-журнале Хранителей или посещения группового мероприятия с вами
                  </p>
                </div>
              </div>

              <ul className={`flex flex-col gap-2 p-2 rounded-[15px] ${allWithPriceMode == false && helpHandMode == false && firstFreeMode == false && showErrorBorder ? 'border-red border' : ''}`}>
                <li>
                  <Checkbox
                    name="mode"
                    intent="cream"
                    id={`mode_${2}`}
                    onChange={() => dispatch(setFirstFreeMode(!firstFreeMode))}
                    checked={firstFreeMode}
                  >
                    Первая сессия бесплатно, последующие по вашей цене
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='ml-2 p-2 rounded-full border-cream border w-2 h-2 flex items-center justify-center border-solid'>?</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[600px]">
                          <p className="rounded-[15px] p-4 border border-cream text-corp-white bg-green">Это клиенты, приходящие к вам на первую бесплатную сессию. При назначении они участвуют в исследовании услуг психологов и проходят фильтры (по занятости, по мотивации, по платежеспособности и тд). Подробный отчет по исследованию <a href="https://drive.google.com/file/d/1WHV-40nOIkPQ9TKn6WK5RxdOgMjHIMim/view" className="text-cream underline" target="_new">можно скачать тут</a>. Клиенты учитываются в общем числе клиентов от Хранителей в месяц.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                  </Checkbox>
                </li>

                {/* <li>
                  <Checkbox
                    name="mode"
                    intent="cream"
                    id={`mode_${1}`}
                    onChange={() => dispatch(setAllWithPriceMode(!allWithPriceMode))}
                    checked={allWithPriceMode}
                  >
                    Первая и последующие сессии с карточки на сайте по вашей цене
                  </Checkbox>
                </li> */}

                <li>
                  <Checkbox
                    name="mode"
                    intent="cream"
                    id={`mode_${3}`}
                    onChange={() => dispatch(setHelpHandMode(!helpHandMode))}
                    checked={helpHandMode}
                  >
                    Первые 8 сессий по предложенной клиентом цене (проект "Рука помощи от Хранителей")
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='ml-2 p-2 rounded-full border-cream border w-2 h-2 flex items-center justify-center border-solid'>?</span>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-[600px]">
                          <p className="rounded-[15px] p-4 border border-cream text-corp-white bg-green">Это клиенты из проекта "Рука помощи от Хранителей". Клиенты пишут свой запрос и предлагают  вознаграждение за сессию в диапазоне от: Бесплатно до 2000 Р, указывают модальность.  Вы можете выбрать и забронировать интересную заявку в чат-боте.  Клиенты учитываются в общем числе клиентов от Хранителей в месяц. </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Checkbox>
                </li>

              </ul>
            </div>



            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full -ml-[56px]">
                  14
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
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  15
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
                className={`flex flex-col gap-2 p-2 ${showErrorBorder && isEmpty(checkedQueries)
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

            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  16
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Загрузите фото и видео
                  </h2>
                  <p className="text-corp-white text-sm">
                    Для размещения информации о вас на сайте Хранителей необходимо загрузить фотографию. Видеовизитку вы может загрузить позднее. Рекомендации по фото и видео <a className="text-cream underline" href="https://docs.google.com/document/d/1hH5DS4xP7URaHl_z-VCQNxUMpoLCZAmi_VhVLEAvXwE/edit?tab=t.0" target="_new">можно найти в этом файле</a>.
                  </p>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 p-2`}
              >

                <Uploady
                  listeners={uploaderPhoto}
                  // fileFilter={filterByTypePhoto}
                  destination={{ url: `https://n8n-v2.hrani.live/webhook/upload-psychologist-photo?psychologist=${psychologist_id}&psychologist_name=${anketa.name}` }}
                >

                  {uploadPhotoState == 'empty' && <UploadButton text="Выберите фотографию" className={`p-4 text-cream border-2 ${showErrorBorder ? 'border-red' : 'border-cream border-dashed'} rounded-xl flex gap-2 items-center justify-center`}><Image size={24} color="
                  #d9b08c"/>
                    <p>Выберите фотографию</p>
                  </UploadButton>}
                  {uploadPhotoState == 'loading' &&
                    <div className="p-4 text-cream border-2 border-cream border-dashed rounded-xl flex gap-2 justify-center items-center">
                      <svg
                        width={24}
                        height={24}
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
                          <stop offset="0" stop-color="#D1A987"></stop>
                          <stop
                            offset=".3"
                            stop-color="#D1A987"
                            stop-opacity=".9"
                          ></stop>
                          <stop
                            offset=".6"
                            stop-color="#D1A987"
                            stop-opacity=".6"
                          ></stop>
                          <stop
                            offset=".8"
                            stop-color="#D1A987"
                            stop-opacity=".3"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#D1A987"
                            stop-opacity="0"
                          ></stop>
                        </radialGradient>
                        <circle
                          transform-origin="center"
                          fill="none"
                          stroke="url(#a12)"
                          stroke-width="16"
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
                          stroke="#D1A987"
                          stroke-width="16"
                          stroke-linecap="round"
                          cx="100"
                          cy="100"
                          r="70"
                        ></circle>
                      </svg>
                      <p className="text-cream">фотография загружается</p>
                    </div>}
                  {uploadPhotoState == 'success' &&
                    <div className="p-4 text-cream border-2 border-cream border-dashed rounded-xl flex gap-2 items-center justify-center"><Check size={24} color="
                  #d9b08c"/>
                      <p>фотография загружена</p>
                      <p onClick={() => { setUploadPhotoState('empty') }} className="cursor-pointer text-white underline">Заменить</p>
                    </div>}
                </Uploady>

                <Uploady
                  listeners={uploaderVideo}
                  destination={{ url: `https://n8n-v2.hrani.live/webhook/upload-psychologist-video?psychologist=${psychologist_id}&psychologist_name=${anketa.name}` }}
                >

                  {uploadVideoState == 'empty' && <UploadButton text="Выберите видео (необязательно)" className="p-4 text-cream border-2 border-cream border-dashed rounded-xl flex gap-2 items-center justify-center"><Clapperboard size={24} color="
                  #d9b08c"/>
                    <p>Выберите видео (необязательно)</p>
                  </UploadButton>}
                  {uploadVideoState == 'loading' &&
                    <div className="p-4 text-cream border-2 border-cream border-dashed rounded-xl flex gap-2 justify-center items-center">
                      <svg
                        width={24}
                        height={24}
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
                          <stop offset="0" stop-color="#D1A987"></stop>
                          <stop
                            offset=".3"
                            stop-color="#D1A987"
                            stop-opacity=".9"
                          ></stop>
                          <stop
                            offset=".6"
                            stop-color="#D1A987"
                            stop-opacity=".6"
                          ></stop>
                          <stop
                            offset=".8"
                            stop-color="#D1A987"
                            stop-opacity=".3"
                          ></stop>
                          <stop
                            offset="1"
                            stop-color="#D1A987"
                            stop-opacity="0"
                          ></stop>
                        </radialGradient>
                        <circle
                          transform-origin="center"
                          fill="none"
                          stroke="url(#a12)"
                          stroke-width="16"
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
                          stroke="#D1A987"
                          stroke-width="16"
                          stroke-linecap="round"
                          cx="100"
                          cy="100"
                          r="70"
                        ></circle>
                      </svg>
                      <p className="text-cream">видео загружается</p>
                    </div>}
                  {uploadVideoState == 'success' &&
                    <div className="p-4 text-cream border-2 border-cream border-dashed rounded-xl flex gap-2 items-center justify-center"><Check size={24} color="
                  #d9b08c"/>
                      <p>видео загружено</p>
                      <p onClick={() => { setUploadVideoState('empty') }} className="cursor-pointer text-white underline">Заменить</p>
                    </div>}
                </Uploady>
              </div>
            </div>

            <div data-name="question" className="flex flex-col gap-6">
              <div data-name="header" className="flex gap-4 items-start">
                <div className="w-10 h-10 text-corp-white font-black text-xl hidden md:flex md:-ml-[56px] items-center justify-center rounded-full">
                  17
                </div>
                <div className="flex flex-col gap-1">
                  <h2 className="text-corp-white font-bold text-2xl font-sans">
                    Ваш сайт и социальные сети
                  </h2>
                  <p className="text-corp-white text-sm">
                    Вы можете указать ссылки на свои соцсети, которые позволят клиенту познакомиться с вами ближе до сессии. Также это повысит рейтинг вашего сайта и увеличить число подписчиков
                  </p>
                </div>
              </div>
              <div
                className={`flex flex-col gap-2 p-2`}
              >
                <Input
                  placeholder="Cсылка на персональный сайт, например https://primer.ru"
                  intent="cream"
                  value={anketa.site_link}
                  onChangeFn={(e) => dispatch(setSite(e))}
                ></Input>
                <Input
                  placeholder="Cсылка на страницу Вконтакте, например https://vk.com/moya_straniza"
                  intent="cream"
                  value={anketa.vk_link}
                  onChangeFn={(e) => dispatch(setVk(e))}
                ></Input>
                <Input
                  placeholder="Cсылка на канал в Телеграм, например https://t.me/moy_kanal"
                  intent="cream"
                  value={anketa.telegram_link}
                  onChangeFn={(e) => dispatch(setTelegram(e))}
                ></Input>
              </div>
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
