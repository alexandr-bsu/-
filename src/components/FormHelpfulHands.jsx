
import axios from "axios";
import { useState } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import Age from "@/survey/main/Age";
import Name from "@/survey/main/Name";
import AskContacts from "@/survey/main/AskContacts";
import SlotsHelpfulHand from './SlotsHelpfulHand'
import Button from "./Button";
const FormHelpfulHands = ({ maxTabsCount }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.form);
  // const ticket_id = useSelector((state) => state.form.ticket_id);
  const ticket_id = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.ticket_id;

  const age = useSelector((state) => state.form.age);
  const name = useSelector((state) => state.form.name)
  const slots = useSelector((state) => state.form.slots);
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);
  
  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const utm_psy_header = QueryString.parse(window.location.search, {
    ignoreQueryPrefix: true,
  })?.utm_psy;

  const headers = ['Запись к психологу из Хранителей - '+utm_psy_header];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const areSlotsEmpty = useSelector((state) => state.form.emptySlots);

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    
   if(tabIndex == 0 && slots.length == 0){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } 
    else {

      setActiveTabIndex(tabIndex + 1);
      setShowError(false);
    }
  }

  function checkUsername(username){
    var regex = new RegExp("^[a-zA-Z0-9_@+-]+$");
      if (!regex.test(username)){
        return false
      }

      return true
      }

  function sendData() {
    
    const utm_psy = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.utm_psy;

    if (activeTabIndex==0 && slots.length == 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      let data = {
        ...form,
        utm_psy,
        ticket_id,
      };
      
        data = { ...data };
      
      dispatch(setStatus("sending"));
      axios({
        method: "POST",
        data: data,
        url: "https://n8n-v2.hrani.live/webhook/helpful-hand-zayavka-new",
      })
        .then(() => {
          

          dispatch(setStatus("ok"));
          
          axios({
            method: "PUT",
            url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
            data: { step: "Заявка отправлена", ticket_id },
          });
        })
        .catch((e) => {
          dispatch(setStatus("error"));
          console.log("Ошибка [отправка формы]", e);
        });
      }
    }
  

  function showForwardBtn() {
    if (
      (activeTabIndex == 0) &&
      areSlotsEmpty
    ) {
      return false;
    } else if (activeTabIndex != maxTabsCount - 1) {
      return true;
    } else if (activeTabIndex == maxTabsCount - 1) {
      return false;
    }

    return true;
  }
  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}

      <div className="bg-white h-full flex flex-col relative w-full rounded-[30px]">
        <div
          data-name="header-block relative "
          className="px-5 py-3 bg-[#2c3531] sticky top-0 z-20 rounded-t-[30px]"
        >
          <h2 className="text-[#d1e8e2] font-medium text-base ">
            {headers[0]}
          </h2>
        </div>

        <div
          data-name="error-message"
          className={`px-5 h-0 flex justify-center items-center text-white font-medium bg-[#ff2f2f] height-transition-4 ${
            showError ? "h-20" : "h-0"
          }`}
        >
          { activeTabIndex == 0 && "Вы не выбрали время"}
        </div>
        {/* <FormPager></FormPager> */}

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
         
            <>
              {activeTabIndex == 0 && <SlotsHelpfulHand></SlotsHelpfulHand>}
            </>

        
        </div>

        {/* Control buttons  */}
        <div
          data-name="control-block"
          className="px-5 py-3 flex items-center sticky bottom-0  gap-4 bg-[#2c3531] w-full z-30 rounded-b-[30px]"
        >
          {activeTabIndex != 0 ? (
            <Button
              size="small"
              intent="cream-transparent"
              hower="primary"
              className="sm:max-w-40 max-sm:max-w-fit mr-auto text-sm"
              onClick={() => {
                setActiveTabIndex(activeTabIndex - 1);
                dispatch(removeEmptySlots());
              }}
            >
              Назад
            </Button>
          ) : (
            ""
          )}
          {showForwardBtn() ? (
            <Button
              size="small"
              intent="cream"
              hower="primary"
              className="sm:max-w-40 max-sm:max-w-fit ml-auto text-sm"
              onClick={() => {
                showNextTab(activeTabIndex);
              }}
            >
              Вперёд
            </Button>
          ) : (
            ""
          )}

          {activeTabIndex == maxTabsCount - 1 ? (
            <Button
              size="small"
              intent="cream"
              hower="primary"
              className="max-w-fit ml-auto text-nowrap text-sm"
              onClick={() => {
                sendData();
              }}
            >
              Забронировать
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default FormHelpfulHands;
