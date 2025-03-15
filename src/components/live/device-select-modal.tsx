import Live from "@/utils/live";
import Strings from "@/utils/strings";
import { Ref } from "react";
import { BiCheck } from "react-icons/bi";
import { CustomDeviceInfo } from "./live-setup";

export default function DeviceSelectModal({
  devices,
  selectedDeviceId,
  onSelect,
  type,
  ref,
  darkBg,
}: {
  devices: CustomDeviceInfo[];
  selectedDeviceId: string | null;
  onSelect: (deviceId: string) => void;
  type: "microphone" | "speaker" | "camera";
  ref: Ref<HTMLDivElement>;
  darkBg: boolean;
}) {
  const handleSelect = (deviceId: string) => {
    onSelect(deviceId);
  };

  return (
    <div
      className={`absolute bottom-full left-0 w-max py-2 rounded-lg shadow-lg ${
        !darkBg ? "bg-white" : "bg-gray-900"
      }`}
      ref={ref}
    >
      {devices.map((d) => (
        <button
          key={d.deviceId}
          className={`w-full text-start flex items-center gap-2 py-2 px-4 ${
            !darkBg ? "hover:bg-gray-100" : "hover:bg-white/10 "
          } ${
            selectedDeviceId === d.deviceId
              ? "text-primary"
              : !darkBg
              ? "text-inherit"
              : "text-white"
          }`}
          onClick={() => handleSelect(d.deviceId)}
        >
          <BiCheck
            className="h-7 w-7"
            color={selectedDeviceId !== d.deviceId ? "transparent" : ""}
          />
          <div>
            <p>
              {d.label ||
                `${Strings.capitalizeFirst(type)} ${d.deviceId.slice(-4)}`}
            </p>
            {d.tags.length > 0 && (
              <p
                className={`text-sm ${
                  selectedDeviceId !== d.deviceId
                    ? "text-gray-500"
                    : "text-inherit"
                }`}
              >
                {Live.formatTags(d.tags)}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
