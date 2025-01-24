import React from "react";
import Checkbox from "../../components/Checkbox";
import TextArea from "@/components/TextArea";
import { useSelector, useDispatch } from "react-redux";
import { toogleDiagnoses, setDiagnoseInfo } from "../../redux/slices/formSlice";
import Input from "../../components/Input";
import axios from "axios";
import { useEffect } from "react";

const Diagnoses = () => {
  const diagnosesList = [
    "Есть диагностированное психическое заболевание (РПП, СДВГ и прочее)",
    "Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР, депрессивное расстройство и прочее)",
    "Прохожу/назначено медикаментозное лечение от невролога/психиатра",
  ];

  const checkedDiagnoses = useSelector((state) => state.form.diagnoses);
  const diagnoseInfo = useSelector((state) => state.form.diagnoseInfo);
  const dispatch = useDispatch();
  const ticket_id = useSelector((state) => state.form.ticket_id);

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Диагноз клиента", ticket_id },
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
              Есть ли у вас диагностированные психические/психиатрические
              заболевания?
            </h3>
            <p className="text-gray-disabled text-sm">
              Выберите все подходящие пункты или пропустите вопрос, если ничего
              из этого не беспокоит
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs" className="mb-6">
            {diagnosesList.map((diagnose, index) => (
              <li key={diagnose} className="mt-2">
                <Checkbox
                  id={`diagnoses_${index}`}
                  onChange={() => dispatch(toogleDiagnoses(diagnose))}
                  checked={
                    checkedDiagnoses.indexOf(diagnose) > -1 ? true : false
                  }
                >
                  {diagnose}
                </Checkbox>
              </li>
            ))}
            {/* <li className="mt-2 flex gap-4 h-9">
              
              {checkedAnxieties.indexOf("Свой вариант") > -1 && (
                <Input
                  value={customAnexiety}
                  onChangeFn={(e) => dispatch(setCustomAnexiety(e))}
                ></Input>
              )}
            </li> */}
          </ul>
          {checkedDiagnoses.length > 0 && (
            <div className="flex flex-col gap-4">
              <p className="text-dark-green text-base ">
                Напишите чуть подробнее о диагнозе и лечении
              </p>
              <TextArea
                value={diagnoseInfo}
                rows={5}
                onChangeFn={(e) => dispatch(setDiagnoseInfo(e))}
              ></TextArea>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Diagnoses;
