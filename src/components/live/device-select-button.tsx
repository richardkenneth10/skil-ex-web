import { RefObject } from "react";
import { IconType } from "react-icons";
import { FaCaretDown } from "react-icons/fa";
import {
  PiMicrophoneBold,
  PiSpeakerHighBold,
  PiVideoCameraBold,
} from "react-icons/pi";
import { DeviceType } from "./live-setup";

export default function DeviceSelectButton({
  type,
  text,
  ref,
  darkBg,
  toggleSelect,
}: {
  type: DeviceType;
  text: string;
  ref: RefObject<HTMLButtonElement | null>;
  darkBg: boolean;
  toggleSelect: () => void;
}) {
  let Icon: IconType | undefined;

  switch (type) {
    case "microphone":
      Icon = PiMicrophoneBold;
      break;
    case "camera":
      Icon = PiVideoCameraBold;
      break;
    case "speaker":
      Icon = PiSpeakerHighBold;
      break;
  }

  return (
    <button onClick={toggleSelect} ref={ref}>
      <div
        className={`flex items-center w-40 p-2 rounded-3xl border-[1px]  ${
          !darkBg
            ? "text-gray-600 hover:bg-gray-100 border-transparent hover:border-inherit hover:text-black"
            : "text-white border-gray-600 hover:bg-gray-800"
        }`}
      >
        <Icon />
        <p
          className={`ml-1 text-[0.9rem] font-medium overflow-hidden text-ellipsis whitespace-nowrap flex-1 `}
        >
          {text}
        </p>
        <FaCaretDown />
      </div>
    </button>
  );
}
