import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setLastExperience } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";
import axios from "axios";

const LastExperience = () => {
  const lastExperience = useSelector((state) => state.form.lastExperience);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Обращался ли к психологу", ticket_id },
    });
  }, []);

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
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Обращались ли вы к психологу или к психотерапевту ранее?
          </h3>
          <p className="text-gray-disabled text-sm">
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
