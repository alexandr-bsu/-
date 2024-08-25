import React, { useState } from "react";

const Checkbox = ({ children, id, classLabel, ...props }) => {
  return (
    <>
      <input type="checkbox" id={id} className="custom-checkbox" {...props} />
      <label htmlFor={id} className={classLabel}>
        {children}
      </label>
    </>
  );
};

export default Checkbox;
