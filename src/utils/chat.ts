import { Message } from "@/components/room/room-fragment";

export default class Chat {
  static getContent(message: Message) {
    switch (message.type) {
      case "TEXT":
        return message.textMessage!.text;
      case "LIVE":
        return "Live session";
    }
  }

  static isLiveMsgWithOngoingSession(message: Message) {
    return message.type == "LIVE" && !message.liveMessage!.session.endedAt;
  }
}
