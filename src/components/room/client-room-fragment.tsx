"use client";

import { IMiniUser } from "@/app/interfaces/user/user";
import { useHeader } from "@/contexts/header-context";
import DateTime from "@/utils/datetime";
import {
  emitRoomMessage,
  joinRoomChat,
  subscribeToRoomChat,
  unsubscribeToRoomChat,
} from "@/utils/socket";
import { useUser } from "@/utils/useUser";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input";
import { Message } from "./room-fragment";

export default function ClientRoomFragment({
  messages: _messages,
  otherUser,
}: {
  messages: Message[];
  otherUser: IMiniUser;
}) {
  const { setTitle } = useHeader();
  const user = useUser();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>(_messages);

  const { id: roomId } = useParams();

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    setTitle(otherUser.firstName);
    focusInput();

    const container = chatContainerRef.current;

    // Auto-scroll to bottom when new messages are added
    const scrollToBottom = () => {
      if (container) container.scrollTop = container.scrollHeight;
    };

    scrollToBottom();

    //maybe we'll validate rommId type later
    joinRoomChat(parseInt(roomId as string));
    subscribeToRoomChat((m) => {
      setMessages((prev) => [m, ...prev]);
      if (isAtBottomRef.current || user?.id === m.senderId)
        setTimeout(scrollToBottom, 1);
    });

    return () => {
      unsubscribeToRoomChat();
    };
  }, [roomId, user]);

  const handleScroll = () => {
    console.log("handling scroll");

    const container = chatContainerRef.current;
    if (!container) return;

    // If the user scrolls up, disable auto-scrolling
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottomRef.current = scrollTop + clientHeight + 20 > scrollHeight; //Threshold of 20
  };

  const handleSendMessage = (msg: string) => {
    emitRoomMessage({ roomId: parseInt(roomId as string), content: msg });
    focusInput();
  };

  return (
    <div className="bg-gray-200 h-full">
      {messages.length == 0 ? (
        <p className="text-center">No data</p>
      ) : (
        <div
          className="px-4 pt-4 h-[calc(100%-(2.5rem+0.5rem))] overflow-y-auto"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {messages
            .slice()
            .reverse()
            .map((m, i, arr) => (
              <div key={m.id}>
                {(i == 0 ||
                  (i > 0 &&
                    !DateTime.isSameDay(
                      arr[i - 1].createdAt,
                      arr[i].createdAt
                    ))) && (
                  <div className="w-fit m-auto px-2 py-1 text-[0.75rem] text-gray-700 font-bold bg-white rounded-md mb-2">
                    {DateTime.formatDate(m.createdAt)}
                  </div>
                )}
                <div
                  className={`rounded-md mb-2 p-2 w-3/4 ${
                    user?.id === m.senderId
                      ? "ml-auto rounded-tr-none bg-[#69c0ec]"
                      : "rounded-tl-none bg-white"
                  }`}
                >
                  <p>{m.content}</p>
                  <p className="text-right text-[0.6rem] text-gray-700">
                    {DateTime.formatTime(m.createdAt)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      )}
      <ChatInput ref={inputRef} onSend={handleSendMessage} />
    </div>
  );
}
