import React from "react";
import { cva } from "class-variance-authority";

const button = cva(
  [
    "rounded-[30px]",
    "font-medium",
    "text-regular",
    "w-full",
    "flex",
    "gap-2",
    "items-center",
    "justify-center",
  ],
  {
    variants: {
      intent: {
        primary: ["bg-green", "text-white"],
        cream: ["bg-cream", "text-green"],
        disabled: ["bg-gray", "text-gray-disabled"],
        "primary-transparent": [
          "bg-transparent",
          "text-green",
          "border",
          "border-green",
        ],

        "cream-transparent": [
          "bg-transparent",
          "text-cream",
          "border",
          "border-cream",
        ],
      },

      hover: {
        primary: ["hover:bg-green", "hover:text-white"],
        cream: ["hover:bg-cream", "hover:text-green"],
        disabled: [
          "hover:bg-gray",
          "hover:text-gray-disabled",
          "hover:border-none",
        ],
        "primary-transparent": [
          "hover:bg-transparent",
          "hover:text-green",
          "hover:border",
          "hover:border-green",
        ],
        no: ["cursor-default"],
      },

      size: {
        small: ["px-4", "py-2"],
        medium: ["px-5", "py-3"],
        large: ["px-8", "py-6"],
      },
    },

    defaultVariants: {
      hover: "primary",
      intent: "primary",
      size: "medium",
    },
  }
);

const Button = ({ intent, size, hover, className, children, ...props }) => {
  return (
    <button className={button({ intent, size, hover, className })} {...props}>
      {children}
    </button>
  );
};

export default Button;
