import React, { useState } from "react";

const Radio = ({
  children,
  id,
  name,
  classLabel,
  intent = "primary",
  ...props
}) => {
  return (
    <>
      <input
        type="radio"
        name={name}
        id={id}
        className={intent === "primary" ? `custom-radio` : `custom-radio-cream`}
        {...props}
      />
      <label htmlFor={id} className={classLabel}>
        {children}
      </label>
    </>
  );
};

export default Radio;
