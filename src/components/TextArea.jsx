import React from "react";

const TextArea = ({ children, onChangeFn, ...props }) => {
  return (
    <textarea
      type="text"
      className="appearance-none border-b-dark-green border-b-2 bg-[#155d5e2e] outline-none p-3 text-dark-green placeholder:text-dark-green"
      onChange={(e) => onChangeFn(e.target.value)}
      {...props}
    />
  );
};

export default TextArea;
