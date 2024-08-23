import React from "react";

const WelcomePage = () => {
  return (
    <div className="px-5 py-12 flex flex-col">
      <div data-name="question-block flex flex-col gap-4">
        <h3 className="font-medium text-lg text-dark-green">
          Опишите своими словами, какой вопрос хотите обсудить с психологом?
        </h3>
      </div>
    </div>
  );
};

export default WelcomePage;
