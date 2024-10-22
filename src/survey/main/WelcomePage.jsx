import React from "react";
import Checkbox from "../../components/Checkbox";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import { toogleAnexieties } from "../../redux/slices/formSlice";

const WelcomePage = () => {
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
    "Вопросы сексуальной сферы",
  ];

  const checkedAnxieties = useSelector((state) => state.form.anxieties);
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col grow pb-6">
        <div
          data-name="question-block"
          className="bg-white px-5 sticky top-0 border-gray border-b z-10 w-full py-4 mb-4"
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

        <div className="px-5">
          <ul data-name="question-inputs">
            {anxietyList.map((anxiety, index) => (
              <li key={anxiety} className="mt-2">
                <Checkbox
                  id={`anxiety_${index}`}
                  onChange={() => dispatch(toogleAnexieties(anxiety))}
                  checked={
                    checkedAnxieties.indexOf(anxiety) > -1 ? true : false
                  }
                >
                  {anxiety}
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
