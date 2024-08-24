import React from "react";
import Checkbox from "../components/Checkbox";
import { useState } from "react";

const WelcomePage = () => {
  const [checkedList, setCheckedList] = useState([]);

  function toogleList(elem, list) {
    let list_copy = list;
    if (list.includes(elem)) {
      list.splice(1, list.indexOf(elem));
    } else {
      list.push(elem);
    }

    return list_copy;
  }

  const anxietyList = [
    "Низкая самооценка",
    "Тревога, страхи, панические атаки",
    "Отверженность, непонимание себя, своих чувств и желаний, своего места в жизни",
    "Сложности с построением близких и любовных отношений",
    "Проблемы с построением гармоничных отношений в семье, в коллективе",
    "Сложности в общении в рабочем коллективе",
    "Травматическое событие, с которым сложно справиться самому",
    "Сложности в общении и воспитании детей",
    "Зависимости: химические, психологические и тд",
    "Выход из абьюзивных отношений",
    "Эмоциональные всплески и эмоциональная пустота, агрессия и гнев",
    "Выгорание: эмоциональное и профессиональное",
    "Детские травмы, которые сильно сказываются на взрослой жизни",
  ];

  return (
    <div className="px-5 flex flex-col pb-6">
      <div
        data-name="question-block"
        className="bg-white border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Что вас беспокоит?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один или несколько вариантов ответа
          </p>
        </div>
      </div>

      <ul data-name="question-inputs">
        {anxietyList.map((anxiety) => (
          <li className="mt-2">
            <Checkbox>{anxiety}</Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WelcomePage;
