import React from "react";
import TextArea from "../../components/TextArea";

import { useSelector, useDispatch } from "react-redux";
import { setQuestionToPsycologist } from "../../redux/slices/formSlice";

const QuestionToPsycologist = () => {
  const questionToPsycologist = useSelector(
    (state) => state.form.questionToPsycologist
  );
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col grow pb-6">
      <div
        data-name="question-block"
        className="bg-white px-5 border-gray border-b z-10 sticky top-0 w-full py-4 mb-4"
      >
        <div className="flex flex-col">
          <h3 className="font-medium text-lg text-dark-green">
            Опишите своими словами, какой вопрос хотите обсудить с психологом?
          </h3>
          <p className="text-gray-disabled text-base">Что вас беспокоит?</p>
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
