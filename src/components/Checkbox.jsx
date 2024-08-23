import React from "react";

const Checkbox = ({ children }) => {
  return (
    <>
      <input
        type="checkbox"
        name="happy"
        className="custom-checkbox"
        value="yes"
      />

      <label>{children}</label>
    </>
  );
};

export default Checkbox;
