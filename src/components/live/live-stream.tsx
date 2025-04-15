"use client";

import { StreamInfoResData } from "@/app/live/[channelId]/page";
import LocalVideo from "@/components/video/local-video";
import useStartPeerSession2 from "@/hooks/use-start-peer-session2";
import { RefObject, useEffect, useRef } from "react";
import RemoteAudio from "../video/remote-audio";
import RemoteVideo from "../video/remote-video";
import DeviceSelectMini from "./device-select-mini";
import DraggableUser from "./draggable-user";
import FullContainer from "./full-container";
import { Devices } from "./live-fragment";
import OtherControl from "./other-control";
import User from "./user";

export default function LiveStream({
  streamInfo,
  channelId,
  localVideoRef,
  devices: { cameras, microphones, speakers },
  userMediaStream,
  selectedMicrophone,
  selectedCamera,
  selectedSpeaker,
  onSelectMicrophone,
  onSelectCamera,
  onSelectSpeaker,
  isMicrophoneMuted,
  isCameraMuted,
  toggleMicrophoneMute,
  toggleCameraMute,
}: {
  streamInfo: StreamInfoResData;
  channelId: string;
  localVideoRef: RefObject<HTMLVideoElement | null>;
  devices: Devices;
  userMediaStream: MediaStream | null;
  selectedMicrophone: string | null;
  selectedCamera: string | null;
  selectedSpeaker: string | null;
  onSelectMicrophone: (id: string) => void;
  onSelectCamera: (id: string) => void;
  onSelectSpeaker: (id: string) => void;
  isMicrophoneMuted: boolean;
  isCameraMuted: boolean;
  toggleMicrophoneMute: () => void;
  toggleCameraMute: () => void;
}) {
  const mainRef = useRef<HTMLDivElement>(null);

  const {
    connectedUsers,
    shareScreen,
    cancelScreenSharing,
    isScreenShared,
    toggleMuteAudio,
    isAudioMuted,
    toggleMuteVideo,
    isVideoMuted,
    // startLocalRecord,
    // stopLocalRecord,
    // isRecordingLocally,
    peerVideoConnection,
  } = useStartPeerSession2(
    streamInfo.user.role,
    channelId!,
    userMediaStream,
    localVideoRef,
    selectedSpeaker
  );

  const microphoneCompletelyMuted = isMicrophoneMuted && isAudioMuted;
  const cameraCompletelyMuted = isCameraMuted && isVideoMuted;
  // const [isFullScreen, setIsFullScreen] = useState(false);

  const userIsTeacher = streamInfo.user.role === "TEACHER";

  const handleScreenShare = async () => {
    if (isScreenShared) await cancelScreenSharing();
    else await shareScreen();
  };

  // const handleLocalRecording = async () => {
  //   if (isRecordingLocally) await stopLocalRecord();
  //   else await startLocalRecord();
  // };

  // const handleFullScreen = async () => {
  //   setIsFullScreen((v) => {
  //     if (!mainRef.current) return v;
  //     toggleFullScreen(!v, mainRef.current, () => setIsFullScreen(false));
  //     return !v;
  //   });
  // };

  // if theres need for faster (non-async) mutes, you can checkout using just the non-async toggle and even completely remove the other if possible
  // BUT there's a need to note that if the tracks are set to not enabled (from the non-async mutes), it will make the producer in the peerVideoConnection paused
  // and so you may need to look into that if you want to go the plain sync route
  const microphoneMuteToggleHandler = async () => {
    toggleMicrophoneMute();
    await toggleMuteAudio();
  };
  const cameraMuteToggleHandler = async () => {
    toggleCameraMute();
    await toggleMuteVideo();
  };

  useEffect(() => {
    if (!peerVideoConnection) return;
    for (const user of connectedUsers)
      peerVideoConnection.setPeerMedia(user.id);
  }, [connectedUsers, peerVideoConnection]);

  return (
    <div>
      <div ref={mainRef} className="relative h-screen w-screen bg-black">
        <div className="">
          {streamInfo.user.role === "TEACHER" && !cameraCompletelyMuted ? (
            <FullContainer>
              <LocalVideo ref={localVideoRef} autoPlay playsInline muted />
            </FullContainer>
          ) : cameraCompletelyMuted || connectedUsers.length == 0 ? (
            <User user={streamInfo.user} />
          ) : (
            <DraggableUser user={streamInfo.user} isCurrentUser={true} />
          )}
          {connectedUsers.map((user) => (
            <div key={user.id}>
              {user.role === "TEACHER" ? (
                <FullContainer audioMuted={!!user.muted?.audio}>
                  {!(user.muted && user.muted.video) ? (
                    <RemoteVideo id={user.id} autoPlay playsInline />
                  ) : (
                    <User user={user} />
                  )}
                </FullContainer>
              ) : (
                <DraggableUser user={user} isCurrentUser={false}>
                  <RemoteAudio id={user.id} autoPlay playsInline />
                </DraggableUser>
              )}
            </div>
          ))}
        </div>
        <div className="absolute bottom-5 left-0 right-0 flex justify-center items-center gap-3">
          <DeviceSelectMini
            devices={[
              { type: "microphone", devices: microphones },
              { type: "speaker", devices: speakers },
            ]}
            selectedDeviceId={[selectedMicrophone, selectedSpeaker]}
            onSelect={(deviceId, idx) => {
              if (idx == 0) onSelectMicrophone(deviceId);
              else if (idx == 1) onSelectSpeaker(deviceId);
            }}
            muted={microphoneCompletelyMuted}
            toggleMute={microphoneMuteToggleHandler}
          />
          {userIsTeacher && (
            <>
              <DeviceSelectMini
                devices={[{ type: "camera", devices: cameras }]}
                selectedDeviceId={[selectedCamera]}
                onSelect={(deviceId) => {
                  onSelectCamera(deviceId);
                }}
                muted={cameraCompletelyMuted}
                toggleMute={cameraMuteToggleHandler}
              />
              <OtherControl
                type="screen-share"
                isOn={isScreenShared}
                onOnToggle={handleScreenShare}
              />
              {/* <OtherControl
                type="record"
                isOn={isRecordingLocally}
                onOnToggle={handleLocalRecording}
              /> */}
            </>
          )}
          {/* <VideoControls
            isScreenShared={isScreenShared}
            onToggleScreenShare={handleScreenShare}
            isFullScreen={isFullScreen}
            onToggleFullScreen={handleFullScreen}
            isAudioMuted={isAudioMuted}
            onToggleMuteAudio={handleMuteAudio}
            isVideoMuted={isVideoMuted}
            onToggleMuteVideo={handleMuteVideo}
          /> */}
        </div>
      </div>
    </div>
  );
}
