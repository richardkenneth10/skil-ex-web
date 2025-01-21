import { AppData } from "@/app/interfaces/mediasoup/app-data";
import { SignalingUser } from "@/app/interfaces/user/user";
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

class PeerConnectionSession2 {
  private _onConnected?: ConnectionStateCB;
  private _onDisconnected?: ConnectionStateCB;
  private _channel?: string;
  private _consumersForPeer: Record<string, Consumer[]> = {};
  private _producers: Producer[] = [];
  private _transports: { send?: Transport; receive?: Transport } = {};
  socket: Socket;
  device: Device;
  peerConnections: Record<string, RTCPeerConnection> = {};

  constructor(socket: Socket, device: Device) {
    this.socket = socket;
    this.device = device;
  }

  joinChannel = async (channel: string, stream: MediaStream) => {
    console.log("joining");

    const routerRtpCapabilities = await new Promise<RtpCapabilities>(
      (resolve) => this.socket.emit("join-channel", channel, resolve)
    );

    console.log("b4 cre");

    this.device.load({ routerRtpCapabilities });

    const sendTransportInfo = await new Promise<TransportOptions>((resolve) =>
      this.socket.emit("create-transport", "send", channel, resolve)
    );

    console.log("created");
    const sendTransport = this.device.createSendTransport(sendTransportInfo);
    this._transports.send = sendTransport;

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
    await this.produceTrack(audioTrack);

    const videoTrack = stream.getVideoTracks()[0];
    await this.produceTrack(videoTrack);

    const rcvTransportInfo = await new Promise<TransportOptions>((resolve) =>
      this.socket.emit("create-transport", "receive", channel, resolve)
    );
    const rcvTransport = this.device.createRecvTransport(rcvTransportInfo);
    this._transports.receive = rcvTransport;

    rcvTransport.on("connect", (parameters, callback) =>
      this.socket.emit(
        "connect-transport",
        "receive",
        parameters,
        channel,
        callback
      )
    );

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
        console.log("pr c");
        console.log(userId, producerId, mute);

        this.socket.emit(
          "consume",
          {
            producerId,
            rtpCapabilities: this.device.rtpCapabilities,
            appData,
          },
          channel,
          async (data: ConsumerOptions) => {
            const consumer = await rcvTransport.consume(data);

            const peerRemoteVideo = document.getElementById(
              userId
            ) as HTMLVideoElement | null;
            console.log(peerRemoteVideo);

            if (peerRemoteVideo) {
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
              console.log(consumersForUser, consumer);

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

              this.setPeerVideo(userId);
            }
            console.log("consumed");
          }
        );
      }
    );
    this.socket.emit("send-produced", channel);

    this._channel = channel;
  };

  private setPeerVideo = (userId: string) => {
    const consumersForUser = this._consumersForPeer[userId] as
      | Consumer[]
      | undefined;
    const peerRemoteVideo = document.getElementById(
      userId
    ) as HTMLVideoElement | null;
    console.log(peerRemoteVideo);

    if (!consumersForUser || !peerRemoteVideo) return;

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
      console.log("yesp", consumerTracks);

      consumerTracks.splice(
        consumerTracks.indexOf(videoTrackNotScreen),
        1,
        videoTrackScreen
      );

      console.log(consumerTracks);
    }
    const stream = new MediaStream(consumerTracks);

    peerRemoteVideo.srcObject = stream;
    console.log(consumersForUser.map((c) => c.track));
  };

  removeConsumer = (userId: string, producerId: string) => {
    const consumersForUser = this._consumersForPeer[userId] as
      | Consumer[]
      | undefined;

    if (!consumersForUser) return;

    const consumer = consumersForUser.find((c) => c.producerId === producerId);

    if (consumer) {
      consumersForUser.splice(consumersForUser.indexOf(consumer), 1);
      this.setPeerVideo(userId);
    }
  };

  onAddUser = (callback: (user: SignalingUser) => void) => {
    this.socket.on(`add-user`, ({ user }: { user: SignalingUser }) =>
      callback(user)
    );
  };

  onRemoveUser = (callback: (socketId: string) => void) => {
    this.socket.on(`remove-user`, ({ socketId }: { socketId: string }) =>
      callback(socketId)
    );
  };

  onUpdateUserList = (
    callback: (users: SignalingUser[], current: SignalingUser) => void
  ) => {
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

  toggleVideoMute = () => {
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
    //log into errors for emits

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
    const producer = this._producers.find(
      (p) => (p.appData as AppData).mediaTag === "screen"
    );
    if (!producer) return;
    producer.close();
    this._producers = this._producers.filter((p) => p.id == producer.id);

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

export default function createPeerConnectionContext2(device: Device) {
  const socket = io(Constants.apiBaseUrl + "/signaling2", {
    transports: ["websocket"],
  });
  return new PeerConnectionSession2(socket, device);
}
