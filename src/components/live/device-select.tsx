import Strings from "@/utils/strings";
import { useEffect, useRef, useState } from "react";
import DeviceSelectButton from "./device-select-button";
import DeviceSelectModal from "./device-select-modal";
import { CustomDeviceInfo, DeviceType } from "./live-setup";

export default function DeviceSelect({
  devices,
  selectedDeviceId,
  onSelect,
  type,
  darkBg = false,
}: {
  devices: CustomDeviceInfo[];
  selectedDeviceId: string | null;
  onSelect: (deviceId: string) => void;
  type: DeviceType;
  darkBg?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleHandler = () => setIsOpen((v) => !v);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        toggleHandler();
      }
    }

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleSelect = (deviceId: string) => {
    onSelect(deviceId);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {isOpen && (
        <DeviceSelectModal
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          onSelect={handleSelect}
          type={type}
          darkBg={darkBg}
          ref={modalRef}
        />
      )}
      <DeviceSelectButton
        type={type}
        text={
          devices.find((d) => d.deviceId === selectedDeviceId)?.label ||
          `${Strings.capitalizeFirst(type)} ${selectedDeviceId?.slice(-4)}`
        }
        ref={buttonRef}
        darkBg={darkBg}
        toggleSelect={toggleHandler}
      />
    </div>
  );
}
