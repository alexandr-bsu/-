import React from "react";
import Button from "./Button";
const FormPager = ({ pager, nextFn, prevFn, sendFn }) => {
  return (
    <div className="py-5 px-5 flex justify-between w-full items-center bg-black text-white">
      <Button size="small" className="max-w-3 rounded-full">
        {"<-"}
      </Button>
      <p>1 / 8</p>
      <Button className="max-w-3 rounded-full" size="small">
        {"->"}
      </Button>
    </div>
  );
};

export default FormPager;
