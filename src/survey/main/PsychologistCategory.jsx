import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setCategoryType } from "../../redux/slices/formSlice";
import Radio from "../../components/Radio";

const MeetType = () => {
  const categoryType = useSelector((state) => state.form.categoryType);
  const dispatch = useDispatch();

  const categoryList = ["К начинающему — бесплатная первая сессия", "К опытному — 2 тыс. рублей первая сессия", "С большим опытом — 6 тыс. рублей первая сессия"];

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
          Стоимость сессий начиная со второй определяется психологом и находится в дипазоне от 1 до 6 тысяч.
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
