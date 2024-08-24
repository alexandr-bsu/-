import React, { useState } from "react";

const Checkbox = ({ children, classLabel, ...props }) => {
  function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
      (
        +c ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))
      ).toString(16)
    );
  }

  let checkbox_id = uuidv4();
  return (
    <>
      <input
        type="checkbox"
        id={checkbox_id}
        className="custom-checkbox"
        {...props}
      />
      <label for={checkbox_id} className={classLabel}>
        {children}
      </label>
    </>
  );
};

export default Checkbox;
