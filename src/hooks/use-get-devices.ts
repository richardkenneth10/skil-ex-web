import { CustomDeviceInfo } from "@/components/live/live-setup";
import { useEffect, useState } from "react";

export default function useGetDevices({ useCamera }: { useCamera: boolean }) {
  const [microphones, setMicrophones] = useState<CustomDeviceInfo[]>([]);
  const [cameras, setCameras] = useState<CustomDeviceInfo[]>([]);
  const [speakers, setSpeakers] = useState<CustomDeviceInfo[]>([]);

  useEffect(() => {
    function processDevices(devices: MediaDeviceInfo[], kind: MediaDeviceKind) {
      const uniqueDevices = new Map<string, CustomDeviceInfo>(); // Map to store unique devices

      devices.forEach((device) => {
        if (device.kind !== kind) return;

        const groupId = device.groupId;

        const existingDevice = uniqueDevices.get(groupId);
        const tags = existingDevice?.tags ?? [];
        if (
          device.deviceId === "default" ||
          device.deviceId === "communications"
        )
          tags.push(device.deviceId);
        uniqueDevices.set(groupId, { ...device.toJSON(), tags });
      });

      return Array.from(uniqueDevices.values());
    }

    const getDevices = async () => {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const microphones = processDevices(allDevices, "audioinput");
      const speakers = processDevices(allDevices, "audiooutput");

      setMicrophones(microphones);
      setSpeakers(speakers);

      if (useCamera) {
        const cameras = processDevices(allDevices, "videoinput");
        setCameras(cameras);

        console.log(allDevices, microphones, cameras, speakers);
      }
    };

    getDevices();

    navigator.mediaDevices.addEventListener("devicechange", getDevices);

    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", getDevices);
    };
  }, [useCamera]);

  return { microphones, cameras, speakers };
}
