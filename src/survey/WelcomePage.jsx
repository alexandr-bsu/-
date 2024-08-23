import React from "react";
import Checkbox from "../components/Checkbox";
const WelcomePage = () => {
  return (
    <div className="px-5 py-12 flex flex-col gap-8">
      <div data-name="question-block flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="font-medium text-lg text-dark-green">
            Что вас беспокоит?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один или несколько вариантов ответа
          </p>
        </div>
      </div>
      <ul data-name="question-inputs flex flex-col">
        <li>
          <Checkbox>Низкая самооценка</Checkbox>
        </li>
      </ul>
    </div>
  );
};

export default WelcomePage;
