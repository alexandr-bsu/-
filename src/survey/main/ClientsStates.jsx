import React from "react";
import Checkbox from "../../components/Checkbox";
import { useSelector, useDispatch } from "react-redux";
import { toogleClientStates } from "../../redux/slices/formSlice";

import axios from "axios";
import { useEffect } from "react";

const ClientState = () => {
  const stateList = [
    "Физические недомогания: постоянная усталость, бессонница, проблемы с питанием, проблемы с памятью, психосоматические реакции",
    "Подавленное настроение, прокрастинация, ощущение бессмысленности существования, опустошенность, отверженность",
    "Беременность, родительство, послеродовая депрессия, проблемы в отношениях с детьми до 18 лет",
    "Абьюзивные отношения, домашнее насилие",
    "Алкогольные и химические зависимости",
    "Психологические зависимости: игровые, любовные, виртуальные и прочие",
    "Состояние ужаса, панические атаки",
    "Намерения или попытки суицида",
    "Повышенная эмоциональность, эмоциональные всплески, приступы агрессии, поступки под действием эмоций, частые смены настроения",
    "Сложности в сексуальной сфере",
    "Проблемы с раскрытием женственности и сексуальности"
  ];

  const checkedStates = useSelector((state) => state.form.clientStates);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();
  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Состояние клиента", ticket_id },
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
              Что из описанного ниже вы наблюдаете в своём состоянии в последнее
              время?
            </h3>
            <p className="text-gray-disabled text-sm">
              Выберите все подходящие пункты или пропустите вопрос, если ничего
              из этого не беспокоит
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs" className="mb-6">
            {stateList.map((state, index) => (
              <li key={state} className="mt-2">
                <Checkbox
                  id={`traumatic_events_${index}`}
                  onChange={() => dispatch(toogleClientStates(state))}
                  checked={checkedStates.indexOf(state) > -1 ? true : false}
                >
                  {state}
                </Checkbox>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default ClientState;