"use client";

import { useHeader } from "@/contexts/header-context";
import axios from "@/utils/axios";
import DateTime from "@/utils/datetime";
import { sleep } from "@/utils/dev";
import {
  emitRoomMessage,
  joinRoomChat,
  subscribeToRoomChat,
  unsubscribeToRoomChat,
} from "@/utils/socket";
import { useUser } from "@/utils/useUser";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ChatInput from "./chat-input";
import { Message, RoomMsgsResData, SkillMatch } from "./room-fragment";
import Spinner from "./spinner";

export default function ClientRoomFragment({
  messages: _messages,
  skillMatch,
}: {
  messages: Message[];
  skillMatch: SkillMatch;
}) {
  const { setTitle } = useHeader();
  const user = useUser();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>(_messages);
  const [hasMore, setHasMore] = useState(_messages.length == 10);
  const [loadingMore, setLoadingMore] = useState(false);

  const { id: roomId } = useParams();

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  useEffect(() => {
    setTitle(
      `${skillMatch.otherUserSkill.name} & ${skillMatch.userSkill.name} room`
    );
    focusInput();
    const container = chatContainerRef.current;

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
  }, [roomId, user, skillMatch, setTitle]);

  const handleScroll = async () => {
    const container = chatContainerRef.current;
    if (!container) return;

    // If the user scrolls up, disable auto-scrolling
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottomRef.current = scrollTop + clientHeight + 20 > scrollHeight; //Threshold of 20

    if (scrollTop < 150 && hasMore && !loadingMore) {
      const currentScrollHeight = container.scrollHeight;

      await fetchMoreMessages();

      if (container.scrollTop == 0)
        setTimeout(() => {
          requestAnimationFrame(() => {
            container.scrollTop =
              container.scrollHeight - currentScrollHeight - 32;
          });
        });
    }
  };

  const handleSendMessage = (msg: string) => {
    emitRoomMessage({ roomId: parseInt(roomId as string), content: msg });
    focusInput();
  };

  const fetchMoreMessages = async () => {
    try {
      setLoadingMore(true);
      const { messages: newMessages }: RoomMsgsResData = (
        await axios.get(
          `/chats/exchange-room-messages/${roomId}?cursorId=${
            messages[messages.length - 1].id
          }`
        )
      ).data;

      await sleep(2000);

      if (newMessages.length < 10) setHasMore(false);
      setMessages((prev) => [...prev, ...newMessages]);
      setLoadingMore(false);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <>
      <div className="bg-gray-200 h-full relative">
        <div className="bg-primary -mx-2 -mt-2 pl-2 pb-2 md:pt-2 h-12 md:h-14 flex items-center md:absolute md:min-w-[70%] md:w-fit md:right-0 md:left-0 md:mx-auto md:rounded-b-lg md:">
          <Image
            className="w-10 h-10 rounded-full object-cover"
            src={skillMatch.otherUser.avatarUrl ?? "/icons/profile.svg"}
            alt={`${skillMatch.otherUser.name}'s avatar`}
            width={100}
            height={100}
          />
          <p className="ml-4 text-white">{skillMatch.otherUser.name}</p>
        </div>
        <div
          className="pt-4 md:pt-14 h-[calc(100%-(2.5rem+0.5rem+2.5rem))] md:h-[calc(100%-(2.5rem+0.5rem+0.5rem))] overflow-y-auto"
          ref={chatContainerRef}
          onScroll={handleScroll}
        >
          {messages.length == 0 ? (
            <p className="text-center">No data</p>
          ) : (
            <div className="px-4">
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
                      <>
                        <div className="w-fit m-auto px-2 py-1 text-[0.75rem] text-gray-700 font-bold bg-white rounded-md mb-2">
                          {DateTime.formatDate(m.createdAt)}
                        </div>
                        {i == 0 && loadingMore && <Spinner className="pb-2" />}
                      </>
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
        </div>
        <ChatInput ref={inputRef} onSend={handleSendMessage} />
      </div>
    </>
  );
}
