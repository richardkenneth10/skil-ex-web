import { SignalingUserRole } from "@/app/interfaces/user/user";
import { useEffect, useRef, useState } from "react";
import { GiExitDoor } from "react-icons/gi";
import { MdCallEnd } from "react-icons/md";
import ControlButton from "./control-button";

export type ExitType = "leave" | "end";

export default function ExitControl({
  userRole,
  onExitToggle,
}: {
  userRole: SignalingUserRole;
  onExitToggle: (type: ExitType) => void;
}) {
  const [isSelected, setIsSelected] = useState(false);
  const openRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const toggleSelectHandler = () => {
    switch (userRole) {
      case "LEARNER":
        onExitToggle("leave");
        break;

      case "TEACHER":
        setIsSelected((v) => !v);
        break;
    }
  };

  const LeaveIcon = !isSelected ? GiExitDoor : GiExitDoor;
  const EndIcon = !isSelected ? MdCallEnd : MdCallEnd;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        openRef.current &&
        !openRef.current.contains(event.target as Node) &&
        openButtonRef.current &&
        !openButtonRef.current.contains(event.target as Node)
      ) {
        setIsSelected(!isSelected);
      }
    }

    if (isSelected) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openRef, isSelected, setIsSelected]);

  return (
    <div className="relative">
      {isSelected && (
        <div
          className="absolute bottom-[140%] left-0 flex items-center gap-4 bg-gray-900 rounded-full p-2"
          ref={openRef}
        >
          <ControlButton
            type="exit"
            icon={LeaveIcon}
            selected={false}
            onClick={() => onExitToggle("leave")}
          />
          <ControlButton
            type="exit"
            icon={EndIcon}
            selected={false}
            onClick={() => onExitToggle("end")}
          />
        </div>
      )}
      <ControlButton
        type="exit"
        icon={LeaveIcon}
        selected={isSelected}
        onClick={toggleSelectHandler}
        ref={openButtonRef}
      />
    </div>
  );
}
