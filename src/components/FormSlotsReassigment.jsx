import axios from "axios";
import { useState, useEffect } from "react";
import QueryString from "qs";
import { useSelector, useDispatch } from "react-redux";
import { setStatus } from "../redux/slices/formStatusSlice";
import {setInternalQueries} from "../redux/slices/formSlice"
import SlotsReassigment from './SlotsReassigment'
import Button from "./Button";


const FormSlotsReassigment = ({ maxTabsCount }) => {
  const dispatch = useDispatch();

  const form = useSelector((state) => state.form);
  const age = useSelector((state) => state.form.age);
  const name = useSelector((state) => state.form.name)
  const slots = useSelector((state) => state.form.slots);
  const filtered_psychologists = useSelector((state) => state.form.filtered_by_automatch_psy_names)
  const _queries = useSelector((state) => state.form._queries)
  const [_formData, _setFormData] = useState({})
  const contactType = useSelector((state) => state.form.contactType);
  const contact = useSelector((state) => state.form.contact);
  
  useEffect(() => {

     const lead_number = QueryString.parse(window.location.search, {
        ignoreQueryPrefix: true,
      })?.lead_number;
    
    axios({
      method: "GET",
      params: {lead_number},
      url: 'https://n8n-v2.hrani.live/webhook/get-ticket-info-for-reassigment-without-schedule'
    }).then(resp => {
      dispatch(setInternalQueries(
        [resp.data.form.question_to_psychologist, resp.data.form.traumaticEvents, resp.data.form.clientStates, resp.data.form.diagnoses].join(';')))
      
    }).catch(err => console.log('reeeeeeeeeeeeeeeeeeeeeerrroooooor', err))
  }, [])
  
  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = ["Заявка на подбор психолога из сообщества Хранители"];
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const areSlotsEmpty = useSelector((state) => state.form.emptySlots);

  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if(tabIndex == 0 && age == ''){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } 
    // else if(tabIndex == 1 && name == ''){
    //   setShowError(true);
    //   setTimeout(() => {
    //     setShowError(false);
    //   }, 3000);
    // } 
    else if(tabIndex == 0 && slots.length == 0){
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else if(tabIndex == 3 && (contactType == "" || contact.length <= 1 || !checkUsername(contact))){
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
    
    const lead_number = QueryString.parse(window.location.search, {
      ignoreQueryPrefix: true,
    })?.lead_number;

    function slots_to_db(slots){
      let t = []
for (let slot of slots){
  let splited_slot = slot.split(' ')
  let date = splited_slot[0].split('.')
  let day = date[0].padStart(2,'0')
  let month = date[1].padStart(2,'0')
  date = `${day}.${month}`
  let time = splited_slot[1]
  t.push(date+' '+time)
}
slots = t.join(';')
  return slots
    }

    if (activeTabIndex == 0 && slots.length == 0) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    } else {
      let data = {
        lead_number,
        filtered_psychologists: filtered_psychologists.join(';'),
        slots: slots_to_db(slots),
        _queries
      };
      
        data = { ...data };
      console.log('ТЕСТ')
      dispatch(setStatus("sending"));
      axios({
        method: "POST",
        data: data,
        url: "https://n8n-v2.hrani.live/webhook/reassign",
      })
        .then(() => {
          dispatch(setStatus("ok"));
        })
        .catch((e) => {
          dispatch(setStatus("error"));
          console.log("Ошибка [отправка формы]", e);
        });
      }
    }
  

  function showForwardBtn() {
    if (
      (activeTabIndex == 9 ||

        ( activeTabIndex == 6)) &&
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
          { activeTabIndex == 0
            ? "Вы не выбрали время"
            : activeTabIndex == -1  ? "Введите корректный @username или номер телефона для связи в Telegram" : "Вы не заполнили обязательное поле"}
        </div>
        {/* <FormPager></FormPager> */}

        <div className="relative h-full overflow-y-scroll flex flex-col ">
          {/* Здесь размещаются вкладки */}
         
            <>
              
              {activeTabIndex == 0 && <SlotsReassigment></SlotsReassigment>}
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
              Отправить форму
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default FormSlotsReassigment;