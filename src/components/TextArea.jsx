import React from "react";
import { cva } from "class-variance-authority";

const textarea = cva(["appearance-none"], {
  variants: {
    intent: {
      primary: [
        "border-b-dark-green border-b-2 bg-[#155d5e2e] outline-none p-3 text-dark-green placeholder:text-[#204b4a76]",
      ],
      cream: [
        "border-cream border rounded-[15px] bg-[#155d5e2e] px-[20px] outline-none py-[10px] text-white placeholder:text-disabled",
      ],
    },
  },

  defaultVariants: {
    intent: "primary",
  },
});

const TextArea = ({ children, onChangeFn, className, intent, ...props }) => {
  return (
    <textarea
      type="text"
      className={textarea({ intent, className })}
      onChange={(e) => onChangeFn(e.target.value)}
      {...props}
    />
  );
};

export default TextArea;
