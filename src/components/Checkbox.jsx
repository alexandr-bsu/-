import React, { useState } from "react";

const Checkbox = ({
  children,
  id,
  classLabel,
  intent = "primary",
  ...props
}) => {
  return (
    <>
      <input
        type="checkbox"
        id={id}
        className={
          intent === "primary" ? `custom-checkbox` : `custom-checkbox-cream`
        }
        name="custom-checkbox"
        {...props}
      />
      <label htmlFor={id} className={classLabel}>
        {children}
      </label>
    </>
  );
};

export default Checkbox;
