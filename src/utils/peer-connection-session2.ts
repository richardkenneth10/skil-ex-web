import { AppData } from "@/app/interfaces/mediasoup/app-data";
import {
  SignalingMessage,
  SignalingUser,
  SignalingUserRole,
} from "@/app/interfaces/user/user";
import {
  Consumer,
  ConsumerOptions,
  Device,
  Producer,
  RtpCapabilities,
  Transport,
  TransportOptions,
} from "mediasoup-client/lib/types";
import { io, Socket } from "socket.io-client";
import Constants from "./constants";

type TrackMuteToggleData = {
  userId: string;
  producerId: string;
  mute: boolean;
};
type ScreenShareToggleData = {
  userId: string;
  producerId: string;
  shared: boolean;
};

type ConnectionStateCB = (event: Event, id: string) => void;

export class PeerConnectionSession2 {
  private _onConnected?: ConnectionStateCB;
  private _onDisconnected?: ConnectionStateCB;
  private _channel?: string;
  private _consumersForPeer: Record<string, Consumer[]> = {};
  private _producers: Producer[] = [];
  private _transports: { send?: Transport; receive?: Transport } = {};
  socket: Socket;
  role: SignalingUserRole;
  peerConnections: Record<string, RTCPeerConnection> = {};

  constructor(socket: Socket, role: SignalingUserRole) {
    this.socket = socket;
    this.role = role;
  }

  joinChannel = async (
    device: Device,
    channel: string,
    stream: MediaStream
  ) => {
    console.log("joining", channel, this.socket);

    const { routerRtpCapabilities, role } = await new Promise<{
      role: SignalingUserRole;
      routerRtpCapabilities: RtpCapabilities;
    }>((resolve) => this.socket.emit("join-channel", channel, resolve));

    this._channel = channel;

    if (this.role !== role) throw new Error("User role does not match.");

    console.log("b4 cre", device);

    await device.load({ routerRtpCapabilities });

    console.log(device);

    const sendTransportInfo = await new Promise<TransportOptions>((resolve) =>
      this.socket.emit("create-transport", "send", channel, resolve)
    );

    console.log("created");
    const sendTransport = device.createSendTransport(sendTransportInfo);
    this._transports.send = sendTransport;

    console.log("send tp created");

    sendTransport.on("connect", (parameters, callback) =>
      this.socket.emit(
        "connect-transport",
        "send",
        parameters,
        channel,
        callback
      )
    );

    sendTransport.on("produce", async (parameters, callback) => {
      const producer: { id: string } = await new Promise((resolve) =>
        this.socket.emit("produce", parameters, channel, resolve)
      );
      callback(producer);
    });

    const audioTrack = stream.getAudioTracks()[0];
    //since the tracks 'enabled' property have been set by now, the producers will by default be muted or unmuted
    const audioProducer = (await this.produceTrack(audioTrack))!;

    let videoProducer: Producer<AppData> | undefined;

    if (this.role === "TEACHER") {
      const videoTrack = stream.getVideoTracks()[0];
      videoProducer = await this.produceTrack(videoTrack);
    }

    const rcvTransportInfo = await new Promise<TransportOptions>((resolve) =>
      this.socket.emit("create-transport", "receive", channel, resolve)
    );
    const rcvTransport = device.createRecvTransport(rcvTransportInfo);
    this._transports.receive = rcvTransport;
    console.log("recv tp created");

    rcvTransport.on("connect", (parameters, callback) => {
      console.log("connec");

      return this.socket.emit(
        "connect-transport",
        "receive",
        parameters,
        channel,
        callback
      );
    });

    this.socket.on(
      "produced",
      ({
        userId,
        producerId,
        mute,
        appData,
      }: {
        userId: string;
        producerId: string;
        mute: boolean;
        appData: AppData;
      }) => {
        console.log("pr c", mute);

        this.socket.emit(
          "consume",
          {
            producerId,
            rtpCapabilities: device.rtpCapabilities,
            appData,
          },
          channel,
          async (data: ConsumerOptions) => {
            const consumer = await rcvTransport.consume(data);

            const peerRemoteMedia = document.getElementById(userId) as
              | HTMLVideoElement
              | HTMLAudioElement
              | null;

            if (peerRemoteMedia) {
              let consumersForUser = this._consumersForPeer[userId] as
                | Consumer[]
                | undefined;
              if (!consumersForUser)
                consumersForUser = this._consumersForPeer[userId] = [];

              const existingTrack = consumersForUser.find(
                (c) =>
                  c.track.kind === consumer.track.kind &&
                  (c.appData as AppData).mediaTag ==
                    (consumer.appData as AppData).mediaTag
              );

              if (existingTrack) {
                consumersForUser.splice(
                  consumersForUser.indexOf(existingTrack),
                  1,
                  consumer
                );
              } else {
                consumersForUser.push(consumer);
              }
              //look into how to implement mute and also if a malicious user tries to send a muted video and no audio (or just something that wouldnt work or browser would complain)
              //just make sure to check all edge cases for this
              //also remember to implement screen share in this new method

              this.setPeerMedia(userId);
            }
            console.log("consumed");
          }
        );
      }
    );
    this.socket.emit("send-produced", channel);

    setTimeout(
      () => this.socket.emit("send-message", { content: "hey there" }, channel),
      4000
    );

    return {
      audioMuted: audioProducer.paused,
      videoMuted: videoProducer?.paused,
    };
  };

  private setPeerMedia = (userId: string) => {
    const consumersForUser = this._consumersForPeer[userId] as
      | Consumer[]
      | undefined;
    const peerRemoteMedia = document.getElementById(userId) as
      | HTMLVideoElement
      | HTMLAudioElement
      | null;

    if (!consumersForUser || !peerRemoteMedia) return;

    const consumerTracks = consumersForUser.map((c) => c.track);
    const videoTrackNotScreen = consumersForUser.find(
      (c) =>
        c.track.kind === "video" && (c.appData as AppData).mediaTag !== "screen"
    )?.track;
    const videoTrackScreen = consumersForUser.find(
      (c) =>
        c.track.kind === "video" && (c.appData as AppData).mediaTag === "screen"
    )?.track;

    if (videoTrackScreen && videoTrackNotScreen) {
      consumerTracks.splice(consumerTracks.indexOf(videoTrackNotScreen), 1);
    }
    const stream = new MediaStream(consumerTracks);

    peerRemoteMedia.srcObject = stream;
  };

  removeConsumer = (userId: string, producerId: string) => {
    console.log(this._consumersForPeer, userId, " ón remove");

    const consumersForUser = this._consumersForPeer[userId] as
      | Consumer[]
      | undefined;

    if (!consumersForUser) return;

    const consumer = consumersForUser.find((c) => c.producerId === producerId);

    if (consumer) {
      consumersForUser.splice(consumersForUser.indexOf(consumer), 1);
      this.setPeerMedia(userId);
    }
  };

  onAddUser = (callback: (user: SignalingUser) => void) => {
    console.log("onadd");

    this.socket.on(`add-user`, ({ user }: { user: SignalingUser }) => {
      return callback(user);
    });
  };

  onRemoveUser = (callback: (socketId: string) => void) => {
    this.socket.on(`remove-user`, ({ socketId }: { socketId: string }) =>
      callback(socketId)
    );
  };

  onUpdateUserList = (
    callback: (users: SignalingUser[], current: SignalingUser) => void
  ) => {
    console.log("onup");
    this.socket.on(
      `update-user-list`,
      ({
        users,
        current,
      }: {
        users: SignalingUser[];
        current: SignalingUser;
      }) => callback(users, current)
    );
  };

  //look into getting the mute state of users when a user joins
  onTrackMuteToggled = (callback: (trackData: TrackMuteToggleData) => void) =>
    this.socket.on(`track-mute-toggled`, (trackData: TrackMuteToggleData) =>
      callback(trackData)
    );

  onScreenShareToggled = (
    callback: (shareData: ScreenShareToggleData) => void
  ) =>
    this.socket.on(`screen-share-toggled`, (shareData: ScreenShareToggleData) =>
      callback(shareData)
    );

  onReceiveMessage = (callback: (message: SignalingMessage) => void) => {
    this.socket.on(`receive-message`, (message: SignalingMessage) =>
      callback(message)
    );
  };

  replaceProducedTrack = async (
    track: MediaStreamTrack,
    mediaTag?: keyof Pick<AppData, "mediaTag">
  ) => {
    const producer = this._producers.find(
      (p) => p.kind == track.kind && (p.appData as AppData).mediaTag == mediaTag
    );
    if (!producer) return false;
    await producer.replaceTrack({ track });
    return true;
  };

  toggleVideoMute = () => {
    if (this.role !== "TEACHER") return;
    //it currently works to select the user media video and not screen share because that is the first video producer
    //it would always find but you may want to ensure that it doesn't select the wrong video
    const videoProducer = this._producers.find(
      (p) => p.kind === "video" && (p.appData as AppData).mediaTag !== "screen"
    );
    if (!videoProducer) return;
    return this.toggleMute(videoProducer);
  };

  toggleAudioMute = () => {
    const audioProducer = this._producers.find((p) => p.kind === "audio");
    if (!audioProducer) return;

    return this.toggleMute(audioProducer);
  };

  toggleMute = async (producer: Producer) => {
    const isMuted = producer.paused;

    //it currently doesnt fail eg if wrong producer id
    //the promise is just stuck if there's an error. you need to
    //look into errors for emits

    if (isMuted) producer.resume();
    else producer.pause();

    await new Promise((resolve) =>
      this.socket.emit(
        "mute",
        { producerId: producer.id, mute: !isMuted },
        this._channel,
        resolve
      )
    );

    return { muted: !isMuted };
  };

  shareScreen = async (stream: MediaStream) => {
    if (this.role !== "TEACHER") return;

    const track = stream.getVideoTracks()[0];

    const producer = await this.produceTrack(track, {
      mediaTag: "screen",
    });
    if (!producer) return false;

    await new Promise((resolve) =>
      this.socket.emit(
        "screen-share",
        { producerId: producer.id, shared: true },
        this._channel,
        resolve
      )
    );
    return true;
  };

  cancelScreenShare = async () => {
    if (this.role !== "TEACHER") return;

    const producer = this._producers.find(
      (p) => (p.appData as AppData).mediaTag === "screen"
    );
    if (!producer) return;
    producer.close();
    this._producers = this._producers.filter((p) => p.id !== producer.id);

    await new Promise((resolve) =>
      this.socket.emit(
        "screen-share",
        { producerId: producer.id, shared: false },
        this._channel,
        resolve
      )
    );
  };

  produceTrack = async (track: MediaStreamTrack, appData?: AppData) => {
    if (track.kind == "video" && this.role !== "TEACHER") return;
    if (!this._transports.send) return;
    const producer = await this._transports.send.produce({ track, appData });
    this._producers.push(producer);
    return producer;
  };

  onConnected = (c: ConnectionStateCB) => (this._onConnected = c);
  onDisconnected = (c: ConnectionStateCB) => (this._onDisconnected = c);

  //set up clearing all data
  //also, i dont think we've implemented clearing related data of a peer when the peer disconnects or leaves
  clearConnections = () => {
    this.socket.close();
  };
}

export default function createPeerConnectionContext2(role: SignalingUserRole) {
  const socket = io(`${Constants.apiBaseUrl}/signaling2`, {
    transports: ["websocket"],
  });

  return new PeerConnectionSession2(socket, role);
}
