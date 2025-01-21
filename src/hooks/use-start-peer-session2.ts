import { SignalingUser } from "@/app/interfaces/user/user";
import createPeerConnectionContext2 from "@/utils/peer-connection-session2";
import { Device } from "mediasoup-client";
import { RefObject, useEffect, useMemo, useState } from "react";

export default function useStartPeerSession2(
  channel: string,
  userMediaStream: MediaStream | null,
  localVideoRef: RefObject<HTMLVideoElement | null>
) {
  const [displayMediaStream, setDisplayMediaStream] =
    useState<MediaStream | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<SignalingUser[]>([]);
  const [device, setDevice] = useState<Device | null>(null);

  const peerVideoConnection = useMemo(
    () => (device ? createPeerConnectionContext2(device) : null),
    [device]
  );

  useEffect(() => {
    setDevice(new Device());
  }, []);

  useEffect(() => {
    console.log("eff");
    console.log(peerVideoConnection);

    // const device = new Device();
    // setDevice(device);

    if (peerVideoConnection && userMediaStream) {
      peerVideoConnection.joinChannel(channel, userMediaStream);

      peerVideoConnection.onAddUser((user) => {
        console.log("new user", user);

        setConnectedUsers((users) => [...users, user]);
      });

      peerVideoConnection.onRemoveUser((socketId) => {
        console.log("removed user", socketId);

        setConnectedUsers((users) =>
          users.filter((user) => user.id !== socketId)
        );
        // peerVideoConnection.removePeerConnection(socketId);
      });

      peerVideoConnection.onUpdateUserList((users) => {
        console.log("just joined", users);
        setConnectedUsers(users);
      });

      peerVideoConnection.onTrackMuteToggled((trackData) => {
        console.log(trackData);
      });

      peerVideoConnection.onScreenShareToggled(
        ({ shared, userId, producerId }) => {
          console.log({ shared, userId, producerId });
          if (!shared) {
            peerVideoConnection.removeConsumer(userId, producerId);
          }
        }
      );
    }

    // setInterval(() => {
    //   console.log(peerVideoConnection?.producers);
    // }, 3000);

    return () => {
      if (peerVideoConnection || userMediaStream) {
        peerVideoConnection?.clearConnections();
        userMediaStream?.getTracks().forEach((track) => track.stop());
      }
    };
  }, [, channel, userMediaStream]);

  const cancelScreenSharing = async () => {
    if (!peerVideoConnection || !userMediaStream || !localVideoRef.current)
      return;

    await peerVideoConnection.cancelScreenShare();

    localVideoRef.current.srcObject = userMediaStream;
    displayMediaStream?.getTracks().forEach((track) => track.stop());
    setDisplayMediaStream(null);
  };

  const shareScreen = async () => {
    if (!peerVideoConnection || !localVideoRef.current) return;

    const stream =
      displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    const started = await peerVideoConnection.shareScreen(stream);
    if (!started) return;

    stream.getVideoTracks()[0].addEventListener("ended", () => {
      cancelScreenSharing();
    });

    localVideoRef.current.srcObject = stream;

    setDisplayMediaStream(stream);
  };

  const toggleMuteAudio = async () => {
    if (!peerVideoConnection) return;
    const res = await peerVideoConnection.toggleAudioMute();
    if (res) setAudioMuted(res.muted);
  };

  const toggleMuteVideo = async () => {
    if (!peerVideoConnection) return;
    const res = await peerVideoConnection.toggleVideoMute();
    if (res) setVideoMuted(res.muted);
  };

  return {
    connectedUsers,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
    toggleMuteAudio,
    isAudioMuted: audioMuted,
    toggleMuteVideo,
    isVideoMuted: videoMuted,
  };
}
