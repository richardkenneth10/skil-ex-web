"use client";

import { useHeader } from "@/contexts/header-context";
import axios from "@/utils/axios";
import Chat from "@/utils/chat";
import DateTime from "@/utils/datetime";
import { sleep } from "@/utils/dev";
import {
  emitRoomMessage,
  joinRoomChat,
  subscribeToRoomChat,
  subscribeToStreamEnded,
  subscribeToStreamStarted,
  unsubscribeToRoomChat,
} from "@/utils/socket";
import { useUser } from "@/utils/useUser";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
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
  const router = useRouter();
  const { setTitle } = useHeader();
  const user = useUser();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>(_messages);
  const [hasMore, setHasMore] = useState(_messages.length == 10);
  const [loadingMore, setLoadingMore] = useState(false);
  const [liveRinging, setLiveRinging] = useState<{ channelId: string } | null>(
    null
  );

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
    joinRoomChat(parseInt(roomId as string)).then(
      ({ ongoingStreamSession }) => {
        console.log(ongoingStreamSession);

        setLiveRinging(ongoingStreamSession);
      }
    );
    subscribeToRoomChat((m) => {
      setMessages((prev) => [m, ...prev]);
      if (isAtBottomRef.current || user?.id === m.senderId)
        setTimeout(scrollToBottom, 1);
    });

    subscribeToStreamStarted((channelId) => {
      setLiveRinging({ channelId });
    });

    subscribeToStreamEnded((channelId, endedAt) => {
      setLiveRinging((v) => (v?.channelId == channelId ? null : v));

      setMessages((messages) => {
        const assMsg = messages.find(
          (m) => m.liveMessage?.channelId == channelId
        );
        if (assMsg) assMsg.liveMessage!.session.endedAt = endedAt;

        return messages;
      });
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

  const handleLive = async () => {
    if (liveRinging) {
      return router.push(`/live/${liveRinging.channelId}`);
    }
    const { channelId }: { channelId: string } = (
      await axios.post(`/rooms/${roomId}/go-live`)
    ).data;
    router.push(`/live/${channelId}`);
  };

  return (
    <>
      <div className="bg-gray-200 dark:bg-inherit h-full">
        <div className="relative">
          <div className="md:absolute md:left-1/2 md:-translate-x-1/2 bg-primary -mx-2 -mt-2 px-2 pb-2 md:pt-2 h-12 md:h-14 flex justify-between items-center md:min-w-[70%] md:w-fit md:mx-auto md:rounded-b-lg md:z-10">
            <div className="flex items-center">
              <Image
                className="w-10 h-10 rounded-full object-cover"
                src={skillMatch.otherUser.avatarUrl ?? "/icons/profile.svg"}
                alt={`${skillMatch.otherUser.name}'s avatar`}
                width={100}
                height={100}
              />
              <div className="ml-4 text-white">
                <p className="font-bold capitalize">
                  {skillMatch.otherUser.name}
                </p>
                {liveRinging && (
                  <p className="italic text-sm">Ongoing Live session...</p>
                )}
              </div>
            </div>
            <motion.div
              onClick={handleLive}
              animate={!liveRinging ? "stop" : { x: [0, -2, 2, -2, 2, 0] }}
              transition={
                (liveRinging ?? undefined) && {
                  duration: 0.3,
                  repeat: Infinity,
                }
              }
              className="inline-block cursor-pointer"
            >
              <Image
                className="h-8 w-8"
                src="/icons/live.png"
                alt="Go live"
                width={100}
                height={100}
              />
            </motion.div>
          </div>
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
                      <div className="flex flex-col items-center">
                        <div className="w-fit px-2 py-1 text-[0.75rem] text-gray-700 font-bold bg-white rounded-md mb-2">
                          {DateTime.formatDate(m.createdAt)}
                        </div>
                        {i == 0 && loadingMore && (
                          <Spinner className="pb-2 m-auto" />
                        )}
                      </div>
                    )}
                    <div
                      className={`rounded-md mb-2 p-2 w-3/4 ${
                        user?.id === m.senderId
                          ? "ml-auto rounded-tr-none bg-primary-light dark:bg-primary-dark"
                          : "rounded-tl-none bg-white dark:bg-divider"
                      } ${
                        Chat.isLiveMsgWithOngoingSession(m) && "cursor-pointer"
                      }`}
                      {...(Chat.isLiveMsgWithOngoingSession(m) && {
                        onClick: () => {
                          router.push(`/live/${m.liveMessage!.channelId}`);
                        },
                      })}
                    >
                      {m.type == "LIVE" ? (
                        <div className="flex items-center gap-1">
                          <div
                            className={`h-10 w-10 rounded-full p-1 ${
                              user?.id === m.senderId
                                ? "bg-[#c0ddec]"
                                : "bg-gray-200"
                            }`}
                          >
                            <Image
                              className="invert brightness-100"
                              src="/icons/live.png"
                              alt="Live"
                              width={100}
                              height={100}
                            />
                          </div>
                          <div>
                            <p className="font-bold">{Chat.getContent(m)}</p>
                            {!m.liveMessage!.session.endedAt ? (
                              <p className="text-text-secondary">
                                In Live session
                              </p>
                            ) : (
                              <p className="text-text-secondary">
                                {DateTime.difference(
                                  m.liveMessage!.session.startedAt,
                                  m.liveMessage!.session.endedAt
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <p>{Chat.getContent(m)}</p>
                      )}
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
