import React from "react";
import { PiMicrophone, PiMicrophoneSlash } from "react-icons/pi";

export default function FullContainer({
  children,
  audioMuted,
}: {
  children: React.ReactNode;
  audioMuted?: boolean;
}) {
  const AudioIcon = audioMuted ? PiMicrophoneSlash : PiMicrophone;
  return (
    <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center">
      {children}
      {audioMuted != undefined && (
        <AudioIcon
          className={`absolute top-[10%] right-[5%] rounded-full p-1 h-10 w-10 ${
            !audioMuted ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}
        />
      )}
    </div>
  );
}
