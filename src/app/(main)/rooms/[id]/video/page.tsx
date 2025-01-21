"use client";

import LocalVideo from "@/components/video/local-video";
import RemoteVideo from "@/components/video/remote-video";
import VideoControls from "@/components/video/video-controls";
import useCreateMediaStream2 from "@/hooks/use-create-media-stream2";
import useStartPeerSession2 from "@/hooks/use-start-peer-session2";
import toggleFullScreen from "@/utils/toggle-full-screen";
import { useRef, useState } from "react";

export default function VideoPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const userMediaStream = useCreateMediaStream2({ localVideoRef });
  const {
    connectedUsers,
    shareScreen,
    cancelScreenSharing,
    isScreenShared,
    toggleMuteAudio,
    isAudioMuted,
    toggleMuteVideo,
    isVideoMuted,
  } = useStartPeerSession2(
    "68ff8239-ad30-4e3c-b6be-f68ec9d8f21b",
    userMediaStream,
    localVideoRef
  );
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleScreenShare = async () => {
    if (isScreenShared) await cancelScreenSharing();
    else await shareScreen();
  };

  const handleFullScreen = async () => {
    setIsFullScreen((v) => {
      if (!mainRef.current) return v;
      toggleFullScreen(!v, mainRef.current, () => setIsFullScreen(false));
      return !v;
    });
  };

  const handleMuteAudio = async () => {
    console.log("han");

    await toggleMuteAudio();
  };

  const handleMuteVideo = async () => {
    await toggleMuteVideo();
  };

  return (
    <div>
      <h1>Video</h1>
      <div ref={mainRef}>
        <LocalVideo ref={localVideoRef} autoPlay playsInline muted />

        {connectedUsers.map((user) => (
          <RemoteVideo key={user.id} id={user.id} autoPlay playsInline />
        ))}
        <VideoControls
          isScreenShared={isScreenShared}
          onToggleScreenShare={handleScreenShare}
          isFullScreen={isFullScreen}
          onToggleFullScreen={handleFullScreen}
          isAudioMuted={isAudioMuted}
          onToggleMuteAudio={handleMuteAudio}
          isVideoMuted={isVideoMuted}
          onToggleMuteVideo={handleMuteVideo}
        />
      </div>
    </div>
  );
}
