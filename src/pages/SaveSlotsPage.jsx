import React from "react";
import okLottie from "../assets/lotties/ok";
import Lottie from "react-lottie";

const SaveSlotsPage = () => {
  const okLottieOptions = {
    loop: false,
    autoplay: true,
    animationData: okLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="bg-dark-green w-screen min-h-screen flex flex-col items-center justify-center overflow-y-hidden p-5">
      <div className="bg-white h-full rounded-lg flex grow flex-col justify-center items-center relative w-full">
        <div className="flex flex-col justify-center items-center">
          <Lottie options={okLottieOptions} height={200} width={200} />
          <h2 className="font-medium text-center text-green text-3xl">
            Готово!
          </h2>
          <p className="text-black text-base font-medium text-center p-5">
            Ваши слоты успешно сохранены. Можете закрыть страницу
          </p>
        </div>
      </div>
    </div>
  );
};

export default SaveSlotsPage;
