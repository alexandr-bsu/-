import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setCategoryType } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";

const MeetType = () => {
  const categoryType = useSelector((state) => state.form.categoryType);
  const dispatch = useDispatch();

  const categoryList = ["1000 - 2000 рублей (опыт до 1 года, аналитический метод)", "2000 - 4000 рублей (опыт до 3х лет, аналитический метод)", "4000 рублей и больше (опыт от 3х лет, работа в нескольких методах)"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
          К какому психологу вы хотите записаться?
          </h3>
          <p className="text-gray-disabled text-sm">
          Мы подберем психолога из нашего сообщества по вашим ожиданиям и возможностям. Стоимость сессии назовет психолог после первой сессии, но она будет находится в выбранном вами диапазоне
          </p>
        </div>
      </div>

      <div className="px-5">
        <ul data-name="question-inputs">
          {categoryList.map((c, index) => (
            <li key={c} className="mt-2">
              <Radio
                name="categoryType"
                id={`category_type_client_${index}`}
                onChange={() => dispatch(setCategoryType(c))}
                checked={categoryType == c ? true : false}
              >
                {c}
              </Radio>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MeetType;
