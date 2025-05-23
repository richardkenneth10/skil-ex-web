import { IconType } from "react-icons";
import {
  MdOutlineMobileOff,
  MdOutlineMobileScreenShare,
  MdOutlineScreenShare,
  MdOutlineStopScreenShare,
} from "react-icons/md";
import { PiRecord, PiRecordBold } from "react-icons/pi";
import { TbMessage, TbMessageOff } from "react-icons/tb";
import ControlButton from "./control-button";

export default function OtherControl({
  type,
  isOn,
  onOnToggle,
}: {
  type: "screen-share" | "record" | "chat";
  isOn: boolean;
  onOnToggle: (on: boolean) => void;
}) {
  let Icon: IconType;
  let MobileIcon: IconType | undefined;

  switch (type) {
    case "screen-share":
      Icon = !isOn ? MdOutlineScreenShare : MdOutlineStopScreenShare;
      MobileIcon = !isOn ? MdOutlineMobileScreenShare : MdOutlineMobileOff;
      break;
    case "record":
      Icon = !isOn ? PiRecord : PiRecordBold;
      break;
    case "chat":
      Icon = !isOn ? TbMessage : TbMessageOff;
      break;
  }

  const toggleOnHandler = () => onOnToggle(!isOn);

  return (
    <ControlButton
      type="other"
      icon={Icon}
      mobileIcon={MobileIcon}
      selected={isOn}
      onClick={toggleOnHandler}
    />
  );
}
