import React from "react";
import Checkbox from "../../components/Checkbox";
import { useState } from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  toogleImportancePsycho,
  setCustomImportance,
} from "../../redux/slices/formPsyClientInfoSlice";
import Input from "../../components/Input";

const Importance = ({custom_description}) => {
  const importanceList = [
    "Чуткость, мягкость, умение выслушивать",
    "Прямолинейность, строгость, серьезность",
    "Опыт работы в эзотерике",
    "Научность, доказательная база подхода, без эзотерики",
    "Опыт семейной жизни, собственные дети",
    "Знание более 1 метода терапии (модальности)"
  ];

  const checkedImportances = useSelector(
    (state) => state.formPsyClientInfo.importancePsycho
  );
  const customImportance = useSelector(
    (state) => state.formPsyClientInfo.customImportance
  );
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex flex-col grow pb-6">
        <div
          data-name="question-block"
          className="bg-white px-5 sticky top-0 border-gray border-b z-10 w-full py-3 mb-4"
        >
          <div className="flex flex-col">
            <h3 className="font-medium text-base text-dark-green">
              Что вам важно в психологе? 
            </h3>
            <p className="text-gray-disabled text-sm">
            {custom_description ? custom_description : "Опыт, образование и личная терапия - по умолчанию. Если предпочтений нет - можете пропустить"}
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs">
            {importanceList.map((i, index) => (
              <li key={i} className="mt-2">
                <Checkbox
                  id={`anxiety_${index}`}
                  onChange={() => dispatch(toogleImportancePsycho(i))}
                  checked={checkedImportances.indexOf(i) > -1 ? true : false}
                >
                  {i}
                </Checkbox>
              </li>
            ))}
            <li className="mt-2 flex gap-4">
              <Checkbox
                id={`custom_anxiety_custom`}
                onChange={() =>
                  dispatch(toogleImportancePsycho("Свой вариант"))
                }
                checked={checkedImportances.indexOf("Свой вариант") > -1}
              >
                Свой вариант
              </Checkbox>
              {checkedImportances.indexOf("Свой вариант") > -1 && (
                <Input
                  className={'h-6'}
                  value={customImportance}
                  onChangeFn={(e) => dispatch(setCustomImportance(e))}
                ></Input>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Importance;
