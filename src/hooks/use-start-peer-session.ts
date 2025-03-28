import { SignalingUser } from "@/app/interfaces/user/user";
import createPeerConnectionContext from "@/utils/peer-connection-session";
import { RefObject, useEffect, useMemo, useState } from "react";

export default function useStartPeerSession(
  channel: string,
  userMediaStream: MediaStream | null,
  localVideoRef: RefObject<HTMLVideoElement | null>
) {
  const peerVideoConnection = useMemo(() => createPeerConnectionContext(), []);

  const [displayMediaStream, setDisplayMediaStream] =
    useState<MediaStream | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<SignalingUser[]>([]);

  useEffect(() => {
    if (userMediaStream) {
      peerVideoConnection.joinChannel(channel);
      peerVideoConnection.onAddUser((user) => {
        setConnectedUsers((users) => [...users, user]);
        peerVideoConnection.addPeerConnection(
          user.id,
          userMediaStream,
          (stream) => {
            //if we know its just one remote video always, we can just receive the ref
            const peerRemoteVideo = document.getElementById(
              user.id
            ) as HTMLVideoElement | null;

            if (peerRemoteVideo) peerRemoteVideo.srcObject = stream;
          }
        );
        peerVideoConnection.callUser(user.id);
      });

      peerVideoConnection.onRemoveUser((socketId) => {
        setConnectedUsers((users) =>
          users.filter((user) => user.id !== socketId)
        );
        peerVideoConnection.removePeerConnection(socketId);
      });

      peerVideoConnection.onUpdateUserList((users) => {
        setConnectedUsers(users);
        for (const user of users) {
          peerVideoConnection.addPeerConnection(
            user.id,
            userMediaStream,
            (stream) => {
              //if we know its just one remote video always, we can just receive the ref
              const peerRemoteVideo = document.getElementById(
                user.id
              ) as HTMLVideoElement | null;
              if (peerRemoteVideo) peerRemoteVideo.srcObject = stream;
            }
          );
        }
      });

      peerVideoConnection.onAnswerMade((socket) =>
        peerVideoConnection.callUser(socket)
      );
    }

    return () => {
      if (userMediaStream) {
        peerVideoConnection.clearConnections();
        userMediaStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [peerVideoConnection, channel, userMediaStream]);

  const cancelScreenSharing = async () => {
    if (!userMediaStream || !localVideoRef.current) return;

    const senders = peerVideoConnection.senders.filter(
      (sender) => sender.track?.kind === "video"
    );

    for (const sender of senders) {
      await sender.replaceTrack(
        userMediaStream.getTracks().find((track) => track.kind === "video") ??
          null
      );
    }

    localVideoRef.current.srcObject = userMediaStream;
    displayMediaStream?.getTracks().forEach((track) => track.stop());
    setDisplayMediaStream(null);
  };

  const shareScreen = async () => {
    if (!localVideoRef.current) return;

    const stream =
      displayMediaStream || (await navigator.mediaDevices.getDisplayMedia());

    const senders = peerVideoConnection.senders.filter(
      (sender) => sender.track?.kind === "video"
    );

    for (const sender of senders) {
      await sender.replaceTrack(stream.getTracks()[0]);
    }

    stream.getVideoTracks()[0].addEventListener("ended", () => {
      cancelScreenSharing();
    });

    localVideoRef.current.srcObject = stream;

    setDisplayMediaStream(stream);
  };

  return {
    connectedUsers,
    peerVideoConnection,
    shareScreen,
    cancelScreenSharing,
    isScreenShared: !!displayMediaStream,
  };
}
