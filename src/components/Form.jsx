import React from "react";
import Slots from "./Slots";
import Button from "./Button";

import { useState } from "react";

const Form = ({ maxTabsCount }) => {
  // Массив заголовков табов формы.
  const headers = [
    'Заполните анкету чтобы мы могли подобрать вам психолога из сообщества "Хранители"',
  ];

  const [activeTabIndex, setActiveTabIndex] = useState(0);

  function showNextPage() {}

  function showPrevPage() {
    setActiveTabIndex(activeTabIndex - 1);
  }

  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}
      <div className="bg-white h-full rounded-lg flex flex-col relative w-full">
        <div
          data-name="header-block"
          className="p-5 bg-[#2c3531] sticky top-0 z-20"
        >
          <h2 className="text-[#d1e8e2] font-medium text-lg">{headers[0]}</h2>
        </div>

        <div className="relative overflow-y-scroll">
          <div className="min-h-screen">
            {/* Здесь размещаются вкладки */}
            {activeTabIndex == 0 && <div>Привет я первая вкладка</div>}
            {activeTabIndex == 1 && <Slots></Slots>}
            {activeTabIndex == 2 && <div>Привет я последняя вкладка</div>}
          </div>
        </div>

        {/* Control buttons */}
        <div
          data-name="control-block"
          className="p-2 flex items-center flex-wrap max-sm:grow gap-4 justify-between bg-[#2c3531] z-20"
        >
          {activeTabIndex != 0 ? (
            <Button
              intent="cream-transparent"
              hower="primary"
              className="sm:max-w-64 max-sm:min-w-40"
              onClick={() => {
                setActiveTabIndex(activeTabIndex - 1);
              }}
            >
              Назад
            </Button>
          ) : (
            <div></div>
          )}
          {activeTabIndex != maxTabsCount - 1 ? (
            <Button
              intent="cream"
              hower="primary"
              className="sm:max-w-64 max-sm:min-w-40"
              onClick={() => {
                setActiveTabIndex(activeTabIndex + 1);
              }}
            >
              Вперёд
            </Button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </>
  );
};

export default Form;
