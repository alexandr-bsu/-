import React, { useState } from "react";

const Radio = ({ children, id, name, classLabel, ...props }) => {
  return (
    <>
      <input
        type="radio"
        name={name}
        id={id}
        className="custom-radio"
        {...props}
      />
      <label htmlFor={id} className={classLabel}>
        {children}
      </label>
    </>
  );
};

export default Radio;
