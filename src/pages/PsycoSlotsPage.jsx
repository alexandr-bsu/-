import React from "react";
import PsycoSlots from "../components/PsycoSlots";
const PsycoSlotsPage = () => {
  return (
    <div className="bg-dark-green w-screen min-h-screen flex flex-col items-center justify-center overflow-y-hidden p-5">
      <div className="bg-white h-full rounded-lg flex grow flex-col relative w-full">
        <PsycoSlots />
      </div>
    </div>
  );
};

export default PsycoSlotsPage;
