"use client";

import LocalVideo from "@/components/video/local-video";
import RemoteVideo from "@/components/video/remote-video";
import VideoControls from "@/components/video/video-controls";
import useCreateMediaStream from "@/hooks/use-create-media-stream";
import useStartPeerSession from "@/hooks/use-start-peer-session";
import toggleFullScreen from "@/utils/toggle-full-screen";
import { useRef, useState } from "react";

export default function VideoPage() {
  const mainRef = useRef<HTMLDivElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const userMediaStream = useCreateMediaStream({ localVideoRef });
  const { connectedUsers, shareScreen, cancelScreenSharing, isScreenShared } =
    useStartPeerSession("1", userMediaStream, localVideoRef);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleScreenShare = async () => {
    console.log("screen share", isScreenShared);

    if (isScreenShared) await cancelScreenSharing();
    else await shareScreen();
  };

  const handleFullScreen = async () => {
    setIsFullScreen((v) => {
      if (!mainRef.current) return v;
      toggleFullScreen(!v, mainRef.current);
      return !v;
    });
  };

  return (
    <div>
      <h1>Video</h1>
      <div ref={mainRef}>
        <LocalVideo ref={localVideoRef} autoPlay playsInline muted />

        {connectedUsers.map((user) => (
          <RemoteVideo key={user} id={user} autoPlay playsInline />
        ))}
        <VideoControls
          isScreenShared={isScreenShared}
          onToggleScreenShare={handleScreenShare}
          isFullScreen={isFullScreen}
          onToggleFullScreen={handleFullScreen}
        />
      </div>
    </div>
  );
}
