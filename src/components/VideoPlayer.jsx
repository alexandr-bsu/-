import React from "react";
import { Media, Video } from "@vidstack/player-react";
import { CircleX } from "lucide-react";
import Button from "./Button";

const VideoPlayer = ({ isVisible = false, src, closeFn }) => {
  return (
    <>
      {isVisible && (
        <div className="flex flex-col justify-center items-center h-full w-full backdrop-blur-lg bg-[#204b4ada] absolute top-0 left-0">
          <div className="max-md:max-w-[250px] md:max-w-[300px] max-h-[300px] justify-center items-center flex flex-col pt-5">
            <Media>
              <Video loading="visible" controls preload="false">
                <video
                  loading="visible"
                  src={src}
                  preload="none"
                  data-video="0"
                  controls
                />
              </Video>
            </Media>
          </div>

          <div className="absolute top-0 right-[0%] px-5 py-5">
            <CircleX size={36} color="#d9b08c" onClick={() => closeFn()}>
              X
            </CircleX>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoPlayer;
