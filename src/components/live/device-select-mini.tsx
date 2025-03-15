import { useRef, useState } from "react";
import DeviceControl from "./device-control";
import DeviceSelect from "./device-select";
import { CustomDeviceInfo } from "./live-setup";

export default function DeviceSelectMini({
  devices,
  selectedDeviceId,
  onSelect,
  toggleMute,
  muted,
}: {
  devices: {
    devices: CustomDeviceInfo[];
    type: "microphone" | "camera" | "speaker";
  }[];
  selectedDeviceId: (string | null)[];
  onSelect: (deviceId: string, idx: number) => void;
  toggleMute: () => void;
  muted: boolean;
}) {
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const toggleSelectHandler = () => setIsSelectOpen((v) => !v);

  const handleSelect = (deviceId: string, idx: number) => {
    onSelect(deviceId, idx);
  };

  return (
    <>
      <div className="relative">
        {isSelectOpen && (
          <div
            className="absolute bottom-[140%] left-0 flex items-center gap-4 bg-gray-900 rounded-full p-2"
            ref={modalRef}
          >
            {devices.map((d, i) => (
              <DeviceSelect
                key={i}
                devices={d.devices}
                onSelect={(id) => handleSelect(id, i)}
                selectedDeviceId={selectedDeviceId[i]}
                type={d.type}
                darkBg={true}
              />
            ))}
          </div>
        )}
        <DeviceControl
          type={
            devices.find((d) => d.type === "microphone") ? "audio" : "video"
          }
          selectModalRef={modalRef}
          isSelectOpen={isSelectOpen}
          isMuted={muted}
          onSelectToggle={toggleSelectHandler}
          onMuteToggle={toggleMute}
        />
      </div>
    </>
  );
}
