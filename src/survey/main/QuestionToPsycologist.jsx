import React from "react";
import TextArea from "../../components/TextArea";
import { useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setQuestionToPsycologist } from "../../redux/slices/formSlice";

const QuestionToPsycologist = () => {
  const questionToPsycologist = useSelector(
    (state) => state.form.questionToPsycologist
  );
  const ticket_id = useSelector((state) => state.form.ticket_id);

  const dispatch = useDispatch();

  useEffect(() => {
    axios({
      method: "PUT",
      url: "https://n8n.hrani.live/webhook/update-tracking-step",
      data: {step: "Вопрос психологу", ticket_id}
    })
  }, [])

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-3 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-base text-dark-green">
            Опишите своими словами, какой вопрос хотите обсудить с психологом?
          </h3>
          <p className="text-gray-disabled text-sm">Что вас беспокоит?</p>
        </div>
      </div>

      <div className="px-5 flex flex-col grow">
        <TextArea
          rows={4}
          value={questionToPsycologist}
          onChangeFn={(e) => dispatch(setQuestionToPsycologist(e))}
        />
      </div>
    </div>
  );
};

export default QuestionToPsycologist;
