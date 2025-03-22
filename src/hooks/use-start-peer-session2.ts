import {
  SignalingMessage,
  SignalingUser,
  SignalingUserRole,
} from "@/app/interfaces/user/user";
import createPeerConnectionContext2, {
  PeerConnectionSession2,
} from "@/utils/peer-connection-session2";
import { Device } from "mediasoup-client";
import { RefObject, useEffect, useState } from "react";

export default function useStartPeerSession2(
  userRole: SignalingUserRole,
  channel: string,
  userMediaStream: MediaStream | null,
  localVideoRef: RefObject<HTMLVideoElement | null>,
  selectedSpeaker: string | null
) {
  const [displayMediaStream, setDisplayMediaStream] =
    useState<MediaStream | null>(null);
  const [audioMuted, setAudioMuted] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState<SignalingUser[]>([]);
  const [messages, setMessages] = useState<SignalingMessage[]>([]);
  const [connectionSetup, setConnectionSetup] = useState(false);
  const [isRecordingRemotely, setIsRecordingRemotely] = useState(false);

  const [peerVideoConnection, setPeerVideoConnection] =
    useState<PeerConnectionSession2 | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (connectionSetup) return;
    let peerVideoConnection: PeerConnectionSession2;

    const setupConnection = async () => {
      if (!userMediaStream) return;
      peerVideoConnection = createPeerConnectionContext2(userRole);
      setPeerVideoConnection(peerVideoConnection);

      peerVideoConnection.onAddUser((user) => {
        console.log("new user", user);
        setConnectedUsers((users) => [...users, user]);
      });

      peerVideoConnection.onRemoveUser((socketId) => {
        console.log("removed user", socketId);
        setConnectedUsers((users) =>
          users.filter((user) => user.id !== socketId)
        );
      });

      peerVideoConnection.onUpdateUserList((users, current) => {
        console.log("just joined", users, current);
        setConnectedUsers(users);
      });

      peerVideoConnection.onReceiveMessage((m) => {
        console.log("new message", m);
        setMessages((prev) => [...prev, m]);
      });

      peerVideoConnection.onTrackMuteToggled((trackData) => {
        setConnectedUsers((users) => {
          const user = users.find((u) => u.id === trackData.userId);
          if (user)
            user.muted = { ...user.muted, [trackData.kind]: trackData.mute };
          return [...users];
        });
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

      //last so that the listeners are already set for events that will be emitted during join
      const { audioMuted, videoMuted } = await peerVideoConnection.joinChannel(
        new Device(),
        channel,
        userMediaStream
      );
      if (!isMounted) {
        peerVideoConnection.clearConnections();
        return;
      }
      setAudioMuted(audioMuted);
      if (videoMuted) setVideoMuted(videoMuted);

      setConnectionSetup(true);
    };

    setupConnection();

    return () => {
      isMounted = false;

      if (userMediaStream && connectionSetup)
        peerVideoConnection.clearConnections();
    };
  }, [userRole, channel, userMediaStream, connectionSetup]);

  useEffect(() => {
    if (!userMediaStream || !peerVideoConnection || !connectionSetup) return;
    for (const track of userMediaStream.getTracks()) {
      console.log(track);

      peerVideoConnection.replaceProducedTrack(track);
    }
  }, [userMediaStream, peerVideoConnection, connectionSetup]);

  useEffect(() => {
    if (!selectedSpeaker) return;
    connectedUsers.forEach((u) => {
      const peerRemoteVideo = document.getElementById(u.id) as
        | HTMLVideoElement
        | HTMLAudioElement
        | null;
      peerRemoteVideo?.setSinkId(selectedSpeaker);
    });
  }, [connectedUsers, selectedSpeaker]);

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

  const startRemoteRecord = async () => {
    if (!peerVideoConnection) return;
    const started = await peerVideoConnection.startRecord();
    if (started) setIsRecordingRemotely(true);
  };
  const stopRemoteRecord = async () => {
    if (!peerVideoConnection) return;
    const ended = await peerVideoConnection.stopRecord();
    if (ended) setIsRecordingRemotely(false);
  };

  return {
    connectedUsers,
    messages,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
    toggleMuteAudio,
    isAudioMuted: audioMuted,
    toggleMuteVideo,
    isVideoMuted: videoMuted,
    startRemoteRecord,
    stopRemoteRecord,
    isRecordingRemotely,
  };
}
