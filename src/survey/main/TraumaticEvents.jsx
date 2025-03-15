import React from "react";
import Checkbox from "../../components/Checkbox";
import Input from "../../components/Input";
import { useSelector, useDispatch } from "react-redux";
import { toogleTraumaticEvents, setCustomTraumaticEvents } from "../../redux/slices/formSlice";
import axios from "axios";
import { useEffect } from "react";

const TraumaticEvents = () => {
  const eventsList = [
    "Утрата близкого",
    "Болезни близкого",
    "Диагностированное смертельное заболевание",
    "Сексуальное насилие во взрослом возрасте",
    "Сексуальное насилие в детстве",
    "Ничего из вышеперечисленного"
  ];

  const checkedEvents = useSelector((state) => state.form.traumaticEvents);
  const customEvent = useSelector((state) => state.form.customTraumaticEvent);
  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Травматические события", ticket_id },
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
              Беспокоит ли вас травмирующее событие, с которым сложно справиться
              самостоятельно?
            </h3>
            <p className="text-gray-disabled text-sm">
              Выберите все подходящие пункты или пропустите вопрос, если ничего
              из этого не беспокоит
            </p>
          </div>
        </div>

        <div className="px-5">
          <ul data-name="question-inputs" className="mb-6">
            {eventsList.map((event, index) => (
              <li key={event} className="mt-2">
                <Checkbox
                  id={`traumatic_events_${event}`}
                  onChange={() => dispatch(toogleTraumaticEvents(event))}
                  checked={checkedEvents.indexOf(event) > -1 ? true : false}
                >
                  {event}
                </Checkbox>
              </li>
            ))}
            <li className="mt-2 flex gap-4">
              <Checkbox
                id={`custom_anxiety_custom`}
                onChange={() =>
                  dispatch(toogleTraumaticEvents("Свой вариант"))
                }
                checked={checkedEvents.indexOf("Свой вариант") > -1}
              >
                Свой вариант
              </Checkbox>
              {checkedEvents.indexOf("Свой вариант") > -1 && (
                <Input
                  className={'h-6'}
                  value={customEvent}
                  onChangeFn={(e) => dispatch(setCustomTraumaticEvents(e))}
                ></Input>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default TraumaticEvents;
