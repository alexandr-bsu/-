import React, { useRef } from "react";
import "@vidstack/react/player/styles/base.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import { PauseIcon } from "@vidstack/react/icons";
import { PlayButton } from "@vidstack/react";
import { useEffect } from "react";
import { CirclePause } from "lucide-react";

const CustomVideoPlayer = ({
  src,
  index,
  selectedIndex,
  showAllCards,
  setPlayStatus,
  playStatus,
}) => {
  const ref = useRef(null);

  useEffect(() => {
    if (selectedIndex !== index) {
      ref.current.remoteControl.pause();
    } else {
      if (playStatus == "play") {
        ref.current.remoteControl.play();
      }
    }
  }, [selectedIndex, playStatus]);

  return (
    <div
      className={`h-full w-full rounded-[30px] top-0 left-0 relative ${
        index === selectedIndex ? "visible" : "hidden"
      }`}
    >
      <div className="w-full h-full">
        <MediaPlayer
          ref={ref}
          src={[{ src }]}
          autoPlay
          className="player rounded-[30px]"
          playsInline
          onEnd={() => {
            showAllCards();
            setPlayStatus("paused");
          }}
        >
          <MediaProvider />
          <div className="absolute inset-0 z-100 flex h-full w-full flex-col bg-gradient-to-t rounded-[30px] from-black/10 to-transparent transition-opacity pointer-events-none">
            <div className="pointer-events-auto rounded-t-[30px] w-full flex gap-2 py-5 px-3 text-white justify-end">
              <div>
                <PlayButton
                  onClick={() => {
                    showAllCards();
                    setPlayStatus("paused");
                  }}
                  className="w-[40px] h-[40px] rounded-full bg-green flex justify-center items-center"
                >
                  <div className="w-[30px] h-[30px] flex justify-center items-center border border-dashed border-white rounded-full">
                    <CirclePause color="white" size={16} />
                  </div>
                </PlayButton>
              </div>
            </div>
          </div>
        </MediaPlayer>
      </div>
    </div>
  );
};

export default CustomVideoPlayer;
