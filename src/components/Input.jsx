import React from "react";
import { cva } from "class-variance-authority";

const input = cva(["appearance-none"], {
  variants: {
    intent: {
      primary: [
        "border-b-dark-green border-b-2 bg-[#155d5e2e] outline-none p-3 text-dark-green placeholder:text-[#204b4a76]",
      ],
      cream: [
        "border-cream border outline-none rounded-[15px] px-[20px] py-[10px]  text-corp-white placeholder:text-disabled bg-[#ffffff00]",
      ],
      'error': [
        "border-b-red border-b-2 bg-[#ffc9c9] outline-none p-3 text-red placeholder:text-red"
      ]
    },
  },

  defaultVariants: {
    intent: "primary",
  },
});

const Input = ({
  children,
  intent,
  onChangeFn,
  className,
  type = "text",
  ...props
}) => {
  return (
    <input
      type={type}
      className={input({ intent, className })}
      onChange={(e) => onChangeFn(e.target.value)}
      {...props}
    />
  );
};

export default Input;
