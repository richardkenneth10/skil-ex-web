import { RefObject, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
  PiMicrophone,
  PiMicrophoneSlash,
  PiVideoCamera,
  PiVideoCameraSlash,
} from "react-icons/pi";
import ControlButton from "./control-button";

export default function DeviceControl({
  type,
  selectModalRef,
  isSelectOpen,
  isMuted,
  onSelectToggle,
  onMuteToggle,
}: {
  type: "audio" | "video";
  selectModalRef: RefObject<HTMLDivElement | null>;
  isSelectOpen: boolean;
  isMuted: boolean;
  onSelectToggle: (open: boolean) => void;
  onMuteToggle: (mute: boolean) => void;
}) {
  const selectButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMuteHandler = () => onMuteToggle(!isMuted);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        selectModalRef.current &&
        !selectModalRef.current.contains(event.target as Node) &&
        selectButtonRef.current &&
        !selectButtonRef.current.contains(event.target as Node)
      ) {
        onSelectToggle(!isSelectOpen);
      }
    }

    if (isSelectOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectModalRef, isSelectOpen, onSelectToggle]);

  return (
    <div>
      <button
        onClick={() => onSelectToggle(!isSelectOpen)}
        ref={selectButtonRef}
      >
        <div
          className={`flex items-center relative w-[9vw] h-[4.5vw] p-2 rounded-full hover:border-inherit text-gray-600 ${
            !isMuted
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-red-300 hover:bg-red-200"
          }`}
        >
          <div className="w-[3vw] flex justify-center">
            {!isSelectOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
          </div>
        </div>
      </button>
      <ControlButton
        type="device"
        icon={
          type === "audio"
            ? !isMuted
              ? PiMicrophone
              : PiMicrophoneSlash
            : !isMuted
            ? PiVideoCamera
            : PiVideoCameraSlash
        }
        selected={isMuted}
        onClick={toggleMuteHandler}
        className="absolute -right-1 top-1/2 -translate-y-1/2"
      />
    </div>
  );
}
