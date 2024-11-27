import React from "react";
import Checkbox from "../../components/Checkbox";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  toogleQuestions,
  setCustomQuestion,
} from "../../redux/slices/formSlice";
import Input from "../../components/Input";
import axios from "axios";
import { useEffect } from "react";

const Questions = () => {
  const questions = [
    "Построение близких отношений с противоположным полом",
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
    "Раскрытие женственности и сексуальности",
  ];

  const checkedQuestions = useSelector((state) => state.form.questions);
  const customQuestion = useSelector(
    (state) => state.formPsyClientInfo.customQuestion
  );
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();
  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: { step: "Вопросы психологу", ticket_id },
    });
  }, []);
  return (
    <>
      <div className="flex flex-col grow pb-6">
        <div
          data-name="question-block"
          className="bg-white px-5 sticky top-0 border-gray border-b z-10 w-full py-3 mb-4"
        >
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-dark-green">
              Какие запросы вы хотите обсудить с психологом?
            </h3>
            <p className="text-gray-disabled text-sm">
              Вы можете выбрать несколько пунктов и написать свой вариант
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs">
            {questions.map((question, index) => (
              <li key={question} className="mt-2">
                <Checkbox
                  id={`question_${index}`}
                  onChange={() => dispatch(toogleQuestions(question))}
                  checked={
                    checkedQuestions.indexOf(question) > -1 ? true : false
                  }
                >
                  {question}
                </Checkbox>
              </li>
            ))}
            <li className="mt-2 flex gap-4 h-9">
              <Checkbox
                id={`custom_anxiety_custom`}
                onChange={() => dispatch(toogleQuestions("Свой вариант"))}
                checked={checkedQuestions.indexOf("Свой вариант") > -1}
              >
                Свой вариант
              </Checkbox>
              {checkedQuestions.indexOf("Свой вариант") > -1 && (
                <Input
                  value={customQuestion}
                  onChangeFn={(e) => dispatch(setCustomQuestion(e))}
                ></Input>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Questions;
