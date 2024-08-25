import React from "react";
import Slots from "./Slots";
import Button from "./Button";
import WelcomePage from "../survey/WelcomePage";
import { useState } from "react";
import { useSelector } from "react-redux";

const Form = ({ maxTabsCount }) => {
  const checkedAnxieties = useSelector((state) => state.form.anxieties);
  const [showError, setShowError] = useState(false);

  // Массив заголовков табов формы.
  const headers = [
    'Заполните анкету чтобы мы могли подобрать вам психолога из сообщества "Хранители"',
  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);
  function showNextTab(tabIndex) {
    // Валидация перед переходом на следущую вкладку
    if (tabIndex == 0 && checkedAnxieties.length > 0) {
      setActiveTabIndex(tabIndex + 1);
      setShowError(false);
    } else {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
    }
  }

  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}

      <div className="bg-white h-full rounded-lg flex flex-col relative w-full">
        <div
          data-name="header-block relative"
          className="p-5 bg-[#2c3531] sticky top-0 z-20"
        >
          <h2 className="text-[#d1e8e2] font-medium text-lg">{headers[0]}</h2>
        </div>

        <div
          data-name="error-message"
          className={`px-5 h-0 flex justify-center items-center text-white font-medium bg-[#ff2f2f] height-transition-4 ${
            showError ? "h-10" : "h-0"
          }`}
        >
          Обязательное поле
        </div>

        <div className="relative h-full flex flex-col overflow-y-scroll">
          {/* Здесь размещаются вкладки */}
          {activeTabIndex == 0 && <WelcomePage></WelcomePage>}
          {activeTabIndex == 1 && <Slots></Slots>}
          {activeTabIndex == 2 && <div>Привет я последняя вкладка</div>}
        </div>

        {/* Control buttons */}
        <div
          data-name="control-block"
          className="p-5 flex items-center flex-wrap max-sm:grow gap-4 bg-[#2c3531] sticky bottom-0 z-30"
        >
          {activeTabIndex != 0 ? (
            <Button
              intent="cream-transparent"
              hower="primary"
              className="sm:max-w-64 max-sm:min-w-40 mr-auto"
              onClick={() => {
                setActiveTabIndex(activeTabIndex - 1);
              }}
            >
              Назад
            </Button>
          ) : (
            ""
          )}
          {activeTabIndex != maxTabsCount - 1 ? (
            <Button
              intent="cream"
              hower="primary"
              className="sm:max-w-64 max-sm:min-w-40 ml-auto"
              onClick={() => {
                showNextTab(activeTabIndex);
              }}
            >
              Вперёд
            </Button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
