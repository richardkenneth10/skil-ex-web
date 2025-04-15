"use client";

import { SignalingUser } from "@/app/interfaces/user/user";
import { StreamInfoResData } from "@/app/live/[channelId]/page";
import LocalVideo from "@/components/video/local-video";
import useCalculateVoiceVolume from "@/hooks/use-calculate-voice-volume";
import { RefObject } from "react";
import {
  PiMicrophone,
  PiMicrophoneSlash,
  PiVideoCamera,
  PiVideoCameraSlash,
} from "react-icons/pi";
import Button from "../auth/button";
import VoiceVisualizer from "../video/voice-visualizer";
import DeviceSelect from "./device-select";
import { Devices } from "./live-fragment";

export type DeviceTag = "default" | "communications";
export type CustomDeviceInfo = MediaDeviceInfo & {
  tags: DeviceTag[];
};
export type DeviceType = "microphone" | "speaker" | "camera";

export default function LiveSetup({
  streamInfo,
  localVideoRef,
  devices: { cameras, microphones, speakers },
  userMediaStream,
  selectedMicrophone,
  selectedCamera,
  selectedSpeaker,
  onSelectMicrophone,
  onSelectCamera,
  onSelectSpeaker,
  onDone,
  isMicrophoneMuted,
  isCameraMuted,
  toggleMicrophoneMute,
  toggleCameraMute,
}: {
  streamInfo: StreamInfoResData;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  devices: Devices;
  userMediaStream: MediaStream | null;
  selectedMicrophone: string | null;
  selectedCamera: string | null;
  selectedSpeaker: string | null;
  onSelectMicrophone: (id: string) => void;
  onSelectCamera: (id: string) => void;
  onSelectSpeaker: (id: string) => void;
  onDone: () => void;
  isMicrophoneMuted: boolean;
  isCameraMuted: boolean;
  toggleMicrophoneMute: () => void;
  toggleCameraMute: () => void;
}) {
  const userIsTeacher = streamInfo.user.role === "TEACHER";

  const voiceId = "local";
  useCalculateVoiceVolume(userMediaStream, voiceId);

  const formatStreamLiveUsersInfo = (users: SignalingUser[]) => {
    if (users.length == 0) {
      return "No one is here.";
    } else {
      return users.reduce((acc, cur, idx) => {
        if (idx > 0) {
          if (idx < users.length - 1) acc += `, ${cur.user.name}`;
          else acc += ` and ${cur.user.name}`;
        } else {
          acc += cur.user.name;
        }
        if (idx == users.length - 1)
          acc += ` ${users.length > 1 ? "are" : "is"} here.`;

        return acc;
      }, "");
    }
  };

  return (
    <div className="md:grid grid-cols-[65%_35%] p-10 h-screen">
      <div className="relative h-full">
        {userIsTeacher ? (
          <div className="rounded-3xl overflow-clip absolute top-1/2 -translate-y-1/2 left-0 w-full">
            <div className="relative">
              <LocalVideo ref={localVideoRef} autoPlay playsInline muted />
              <p className="absolute top-5 left-5 text-white font-bold text-sm">
                {streamInfo.user.user.name}
              </p>
              <VoiceVisualizer id={voiceId} />
              <div className="absolute bottom-5 left-0 right-0 w-full flex justify-center gap-4">
                <button onClick={toggleMicrophoneMute}>
                  {!isMicrophoneMuted ? (
                    <PiMicrophone
                      className="border-[1px] h-[5vw] w-[5vw] p-3 rounded-full"
                      color="white"
                    />
                  ) : (
                    <PiMicrophoneSlash
                      className="h-[5vw] w-[5vw] p-3 rounded-full bg-red-700"
                      color="white"
                    />
                  )}
                </button>
                <button onClick={toggleCameraMute}>
                  {!isCameraMuted ? (
                    <PiVideoCamera
                      className="border-[1px] h-[5vw] w-[5vw] p-3 rounded-full"
                      color="white"
                    />
                  ) : (
                    <PiVideoCameraSlash
                      className="h-[5vw] w-[5vw] p-3 rounded-full bg-red-700"
                      color="white"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <VoiceVisualizer id={voiceId} />
            <div className="flex items-center justify-center h-full">
              <button
                onClick={toggleMicrophoneMute}
                className="h-[10vw] w-[10vw]"
              >
                {!isMicrophoneMuted ? (
                  <PiMicrophone
                    className="border-[1px] h-full w-full p-3 rounded-full"
                    color="black"
                  />
                ) : (
                  <PiMicrophoneSlash
                    className="h-full w-full p-3 rounded-full bg-red-700"
                    color="black"
                  />
                )}
              </button>
            </div>
          </>
        )}
        <div className="absolute -bottom-5 left-0 right-0 flex items-center gap-3">
          <DeviceSelect
            devices={microphones}
            selectedDeviceId={selectedMicrophone}
            onSelect={onSelectMicrophone}
            type="microphone"
          />
          {userIsTeacher && (
            <DeviceSelect
              devices={cameras}
              selectedDeviceId={selectedCamera}
              onSelect={onSelectCamera}
              type="camera"
            />
          )}
          <DeviceSelect
            devices={speakers}
            selectedDeviceId={selectedSpeaker}
            onSelect={onSelectSpeaker}
            type="speaker"
          />
        </div>
      </div>
      {!streamInfo.channel ? (
        <h6>Unexpected!!! Channel does not exist</h6>
      ) : (
        <div className="flex flex-col justify-center items-center gap-4">
          {formatStreamLiveUsersInfo(streamInfo.channel.users)}
          <h6>Ready to join?</h6>
          <Button text="Join now" onClick={onDone} />
        </div>
      )}
    </div>
  );
}
