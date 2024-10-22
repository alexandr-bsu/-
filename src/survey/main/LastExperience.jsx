import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setLastExperience } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";

const LastExperience = () => {
  const lastExperience = useSelector((state) => state.form.lastExperience);
  const dispatch = useDispatch();

  const experienceList = [
    "Нет, это первый опыт",
    "Да, было 1-2 сессии",
    "Да, было до 3 месяцев терапии",
    "Да, была длительная терапия",
  ];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Обращались ли вы к психологу или к психотерапевту ранее?
          </h3>
          <p className="text-gray-disabled text-base">
            Выберите один вариант ответа
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {experienceList.map((experience, index) => (
            <li key={experience} className="mt-2">
              <Radio
                name="experience"
                id={`experience_${index}`}
                onChange={() => dispatch(setLastExperience(experience))}
                checked={lastExperience == experience ? true : false}
              >
                {experience}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default LastExperience;
