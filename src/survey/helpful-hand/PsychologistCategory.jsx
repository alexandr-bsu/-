import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { setCategoryType, setCustomCategory } from "../../redux/slices/formSlice";
import { useEffect } from "react";
import Radio from "../../components/Radio";
import Input from "../../components/Input";
import axios from "axios";
const MeetType = () => {
  const categoryType = useSelector((state) => state.form.categoryType);
  const custom_cat = useSelector((state) => state.form.customCategory);
  const dispatch = useDispatch();

  const ticket_id = useSelector((state) => state.form.ticket_id);
    
      useEffect(() => {
        axios({
          method: "PUT",
          url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
          data: { step: "Категория психолога", ticket_id },
        });
      }, [])
  

  const categoryList = ["Бесплатно", "300 руб", "500 руб", "1000 руб", "1500 руб", "2000 руб", "3000 руб"];

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
          Какую сумму вы готовы выделить из своего бюджета для еженедельных сессий с психологом? (оплата за сессию)
          </h3>
          <p className="text-gray-disabled text-sm">
          Психологи выбирают себе клиентов в первую очередь на основе того, какой случай им откликается. Сумма компенсации может играть роль при выборе, она должна быть комфортной и для клиента, и для психолога. Важно, чтобы вы указали именно ту сумму, которая будет комфортна для вас, чтобы вы могли по крайней мере полгода пробыть в терапии.
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

          {/* <li className="mt-2 flex gap-4 h-9">
                <Radio
                  id={`price_other`}
                  onChange={() => dispatch(setCategoryType("Другое"))}
                  checked={
                    categoryType == "Другое" ? true : false
                  }
                >
                  Другое
                </Radio>

                {categoryType == "Другое" && (
                <Input
                  value={custom_cat}
                  onChangeFn={(e) => dispatch(setCustomCategory(e))}
                ></Input>
              )}
              </li> */}
        </ul>

        
      </div>
    </div>
  );
};

export default MeetType;
