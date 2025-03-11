import React from "react";
import TextArea from "../../components/TextArea";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCustomImportance } from "../../redux/slices/formPsyClientInfoSlice";
import axios from "axios";

const Importance = () => {
  const customImportance  = useSelector(
    (state) => state.formPsyClientInfo.customImportance
  );

  const ticket_id = useSelector((state) => state.form.ticket_id);
  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n-v2.hrani.live/webhook/update-tracking-step",
      data: { step: "Важно в психологе", ticket_id },
    });
  }, []);

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
          Что для вас важно в психологе, какие есть предпочтения?
          </h3>
          {/* <p className="text-gray-disabled text-sm">Не знаете ответов — это нормально, напишите, как чувствуете. Можете пропустить если не готовы</p> */}
        </div>
      </div>

      <div className="px-5 flex flex-col grow">
        <TextArea
          rows={4}
          value={customImportance}
          onChangeFn={(e) => dispatch(setCustomImportance(e))}
        />
      </div>
    </div>
  );
};

export default Importance;
