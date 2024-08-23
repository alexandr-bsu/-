import React from "react";
import Slots from "./Slots";
import { useState } from "react";

const Form = () => {
  // Массив заголовков табов формы.
  const headers = [];
  return (
    <>
      {/* Не задаём ограничений  т.к ширину будет ограничивать контейнер в Tilda */}
      <div className="bg-white h-full rounded-lg flex flex-col relative w-full">
        <div
          data-name="header-block"
          className="p-10 bg-black sticky top-0 rounded-t-lg z-20"
        ></div>

        <div className="relative overflow-y-scroll">
          <Slots></Slots>
        </div>

        <div
          data-name="header-block"
          className="p-10 rounded-b-lg bg-black z-20"
        ></div>
      </div>
    </>
  );
};

export default Form;
