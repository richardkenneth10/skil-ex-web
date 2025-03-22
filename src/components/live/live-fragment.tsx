"use client";

import { StreamInfoResData } from "@/app/live/[channelId]/page";
import useCreateMediaStream2 from "@/hooks/use-create-media-stream2";
import useGetDevices from "@/hooks/use-get-devices";
import { useEffect, useRef, useState } from "react";
import LiveSetup, { CustomDeviceInfo } from "./live-setup";
import LiveStream from "./live-stream";

export type SetupData = {
  microphoneMuted: boolean;
  cameraMuted: boolean;
};

export type Devices = {
  cameras: CustomDeviceInfo[];
  microphones: CustomDeviceInfo[];
  speakers: CustomDeviceInfo[];
};

export default function LiveFragment({
  channelId,
  streamInfo,
}: {
  channelId: string;
  streamInfo: StreamInfoResData;
}) {
  const [setupDone, setSetupDone] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);
  const [selectedMicrophone, setSelectedMicrophone] = useState<string | null>(
    null
  );
  const [selectedSpeaker, setSelectedSpeaker] = useState<string | null>(null);

  const userIsTeacher = streamInfo.user.role === "TEACHER";

  const {
    userMediaStream,
    isAudioMuted,
    isVideoMuted,
    toggleAudioMute,
    toggleVideoMute,
  } = useCreateMediaStream2({
    localVideoRef,
    microphoneId: selectedMicrophone,
    cameraId: selectedCamera,
    useCamera: userIsTeacher,
  });

  const { microphones, cameras, speakers } = useGetDevices({
    useCamera: userIsTeacher,
  });

  useEffect(() => {
    if (localVideoRef.current && !isVideoMuted) {
      localVideoRef.current.srcObject = userMediaStream;
    }
  }, [setupDone, userMediaStream, isVideoMuted]);

  useEffect(() => {
    const defaultMicrophone =
      microphones.length > 0
        ? (
            microphones.find((m) => m.tags.includes("default")) ??
            microphones[0]
          ).deviceId
        : null;
    const defaultSpeaker =
      speakers.length > 0
        ? (speakers.find((s) => s.tags.includes("default")) ?? speakers[0])
            .deviceId
        : null;

    setSelectedMicrophone(defaultMicrophone);
    setSelectedSpeaker(defaultSpeaker);

    if (userIsTeacher) {
      const defaultCamera =
        cameras.length > 0
          ? (cameras.find((c) => c.tags.includes("default")) ?? cameras[0])
              .deviceId
          : null;
      setSelectedCamera(defaultCamera);
    }
  }, [microphones, cameras, speakers, userIsTeacher]);

  return (
    <div>
      {setupDone ? (
        <LiveStream
          channelId={channelId}
          streamInfo={streamInfo}
          localVideoRef={localVideoRef}
          devices={{ microphones, cameras, speakers }}
          userMediaStream={userMediaStream}
          selectedMicrophone={selectedMicrophone}
          selectedCamera={selectedCamera}
          selectedSpeaker={selectedSpeaker}
          onSelectMicrophone={setSelectedMicrophone}
          onSelectCamera={setSelectedCamera}
          onSelectSpeaker={setSelectedSpeaker}
          isMicrophoneMuted={isAudioMuted}
          isCameraMuted={isVideoMuted}
          toggleMicrophoneMute={toggleAudioMute}
          toggleCameraMute={toggleVideoMute}
        />
      ) : (
        <LiveSetup
          streamInfo={streamInfo}
          onDone={() => setSetupDone(true)}
          localVideoRef={localVideoRef}
          devices={{ microphones, cameras, speakers }}
          userMediaStream={userMediaStream}
          selectedMicrophone={selectedMicrophone}
          selectedCamera={selectedCamera}
          selectedSpeaker={selectedSpeaker}
          onSelectMicrophone={setSelectedMicrophone}
          onSelectCamera={setSelectedCamera}
          onSelectSpeaker={setSelectedSpeaker}
          isMicrophoneMuted={isAudioMuted}
          isCameraMuted={isVideoMuted}
          toggleMicrophoneMute={toggleAudioMute}
          toggleCameraMute={toggleVideoMute}
        />
      )}
    </div>
  );
}
