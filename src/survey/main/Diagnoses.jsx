import React from "react";
import Radio from "../../components/Radio";
import TextArea from "@/components/TextArea";
import { useSelector, useDispatch } from "react-redux";
import { setDiagnoses, setDiagnoseMedicaments } from "../../redux/slices/formSlice";

import axios from "axios";
import { useEffect } from "react";

const Diagnoses = () => {
  const diagnosesList = [
    "Есть диагностированное психическое заболевание (РПП, СДВГ и прочее)",
    "Есть диагностированное психиатрическое заболевание (ПРЛ, БАР, ПТСР, депрессивное расстройство и прочее)",
    "Нет",
  ];

  const checkedDiagnoses = useSelector((state) => state.form.diagnoses);
  const diagnoseInfo = useSelector((state) => state.form.diagnoseInfo);
  const diagnoseMedicaments = useSelector((state) => state.form.diagnoseMedicaments);
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
             Выберите один вариант ответа
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs" className="mb-6">
            {diagnosesList.map((diagnose, index) => (
              <li key={diagnose} className="mt-2">
                <Radio
                  id={`diagnoses_${index}`}
                  onChange={() => dispatch(setDiagnoses(diagnose))}
                  checked={
                    checkedDiagnoses[0] == diagnose ? true : false
                  }
                >
                  {diagnose}
                </Radio>
              </li>
            ))}
       
          </ul>
         
          {(checkedDiagnoses.length > 0 && checkedDiagnoses[0] != "Нет") && (
            <div className="flex flex-col gap-4">
              <p className="text-dark-green text-base ">
              Принимаете ли вы медикаменты по назначению психиатра?
              </p>
              <ul data-name="question-inputs" className="mb-6">
            {["Да", "Нет"].map((diagnose_med, index) => (
              <li key={diagnose_med} className="mt-2">
                <Radio
                  id={`diagnoses_med_${index}`}
                  onChange={() => dispatch(setDiagnoseMedicaments(diagnose_med))}
                  checked={
                    diagnoseMedicaments == diagnose_med ? true : false
                  }
                >
                  {diagnose_med}
                </Radio>
              </li>
            ))}
       
          </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Diagnoses;
