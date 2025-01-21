import { SignalingUser } from "@/app/interfaces/user/user";
import { io, Socket } from "socket.io-client";
import Constants from "./constants";

const capitalizeFirst = (s: string) => {
  return `${s.charAt(0).toUpperCase()}${s.slice(1)}`;
};

// type OnKeys<T> = {
//   [K in keyof T]: K extends `_on${string}` ? K : never;
// }[keyof T];

// type OnFields<T> = Pick<T, OnKeys<T>>;

// type OnFieldTypes = OnFields<PeerConnectionSession>;

type ConnectionStateCB = (event: Event, id: string) => void;

// interface IPeerUser {
//   id: number;
// }

interface ICallData {
  offer: RTCSessionDescriptionInit;
  socket: string;
}
interface IAnswerData {
  answer: RTCSessionDescriptionInit;
  socket: string;
}

class PeerConnectionSession {
  private _onConnected?: ConnectionStateCB;
  private _onDisconnected?: ConnectionStateCB;
  private _channel?: string;
  socket: Socket;
  isAlreadyCalling = false;
  peerConnections: Record<string, RTCPeerConnection> = {};
  senders: RTCRtpSender[] = [];
  listeners: Record<string, (e: Event) => void> = {};

  constructor(socket: Socket) {
    this.socket = socket;
    this.onCallMade();
  }

  joinChannel = (channel: string) => {
    this._channel = channel;
    this.socket.emit("join-channel", channel);
  };

  addPeerConnection(
    id: string,
    stream: MediaStream,
    callback: (s: MediaStream) => void
  ) {
    this.peerConnections[id] = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    stream
      .getTracks()
      .forEach((t) =>
        this.senders.push(this.peerConnections[id].addTrack(t, stream))
      );

    this.listeners[id] = (event) => {
      const fn = this[
        ("_on" +
          capitalizeFirst(
            this.peerConnections[id].connectionState
          )) as keyof PeerConnectionSession
      ] as ConnectionStateCB | undefined;
      if (fn) fn(event, id);
    };

    this.peerConnections[id].addEventListener(
      "connectionstatechange",
      this.listeners[id]
    );

    this.peerConnections[id].ontrack = ({ streams: [stream] }) => {
      console.log({ id, stream });
      callback(stream);
    };

    console.log(this.peerConnections);
  }

  removePeerConnection(id: string) {
    this.peerConnections[id].removeEventListener(
      "connectionstatechange",
      this.listeners[id]
    );
    delete this.peerConnections[id];
    delete this.listeners[id];
  }

  callUser = async (toSocket: string) => {
    if (this.peerConnections[toSocket].iceConnectionState === "new") {
      const offer = await this.peerConnections[toSocket].createOffer();
      await this.peerConnections[toSocket].setLocalDescription(
        new RTCSessionDescription(offer)
      );

      this.socket.emit("call-user", { to: toSocket, offer });
    }
  };

  onCallMade = () => {
    this.socket.on("call-made", async (data: ICallData) => {
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnections[data.socket].createAnswer();
      await this.peerConnections[data.socket].setLocalDescription(
        new RTCSessionDescription(answer)
      );

      this.socket.emit("make-answer", {
        to: data.socket,
        answer,
      });
    });
  };

  onAnswerMade = (callback: (socket: string) => void) => {
    this.socket.on("answer-made", async (data: IAnswerData) => {
      await this.peerConnections[data.socket].setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );
      callback(data.socket);
    });
  };

  onAddUser = (callback: (user: SignalingUser) => void) => {
    this.socket.on(
      `${this._channel}-add-user`,
      ({ user }: { user: SignalingUser }) => callback(user)
    );
  };

  onRemoveUser = (callback: (socketId: string) => void) => {
    this.socket.on(
      `${this._channel}-remove-user`,
      ({ socketId }: { socketId: string }) => callback(socketId)
    );
  };

  onUpdateUserList = (
    callback: (users: SignalingUser[], current: SignalingUser) => void
  ) => {
    this.socket.on(
      `${this._channel}-update-user-list`,
      ({
        users,
        current,
      }: {
        users: SignalingUser[];
        current: SignalingUser;
      }) => callback(users, current)
    );
  };

  onConnected = (c: ConnectionStateCB) => (this._onConnected = c);
  onDisconnected = (c: ConnectionStateCB) => (this._onDisconnected = c);

  clearConnections = () => {
    this.socket.close();
    this.senders = [];
    Object.keys(this.peerConnections).forEach(
      this.removePeerConnection.bind(this)
    );
  };
}

export default function createPeerConnectionContext() {
  const socket = io(Constants.apiBaseUrl + "/signaling", {
    transports: ["websocket"],
  });

  return new PeerConnectionSession(socket);
}
