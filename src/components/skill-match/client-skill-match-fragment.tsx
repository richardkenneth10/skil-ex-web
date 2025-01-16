"use client";

import { useHeader } from "@/contexts/header-context";
import axios from "@/utils/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Avatar from "../(main)/avatar";
import Button from "../auth/button";
import { Match } from "../home/home-fragment";

export default function ClientSkillMatchFragment({
  match: { otherUser, offeredSkill, wantedSkill, pendingMatch: _pendingMatch },
}: {
  match: Match;
}) {
  const { setTitle } = useHeader();
  const [pendingMatch, setPendingMatch] = useState<typeof _pendingMatch | null>(
    _pendingMatch
  );

  useEffect(() => {
    setTimeout(() => setTitle("MATCH DETAILS"));
  });

  const sendMatchRequest = async () => {
    try {
      const { matchId } = (
        await axios.post("/skills/match-requests", {
          skillId: offeredSkill.id,
          receiverId: otherUser.id,
          receiverSkillId: wantedSkill.id,
        })
      ).data;
      setPendingMatch({ id: matchId, userStatus: "SENDER" });
      toast.success("Match request sent");
    } catch (error) {
      console.log(error);
      toast.error("Could not send request. Try again later");
    }
  };
  const cancelMatchRequest = async () => {
    if (!pendingMatch) return;
    try {
      await axios.post(`/skills/cancel-match-request/${pendingMatch.id}`);
      setPendingMatch(undefined);
      toast.info("Match request cancelled");
    } catch (error) {
      console.log(error);
      toast.error("Could not cancel request. Try again later");
    }
  };
  const confirmMatchRequest = async () => {
    if (!pendingMatch) return;
    try {
      await axios.post(`/skills/accept-match-request/${pendingMatch.id}`);
      setPendingMatch(null);
      toast.success("Match request accepted");
    } catch (error) {
      console.log(error);
      toast.error("Could not accept request. Try again later");
    }
  };
  const declineMatchRequest = async () => {
    if (!pendingMatch) return;
    try {
      await axios.post(`/skills/decline-match-request/${pendingMatch.id}`);
      setPendingMatch(undefined);
      toast.info("Match request declined");
    } catch (error) {
      console.log(error);
      toast.error("Could not decline request. Try again later");
    }
  };

  return (
    <div className="bg-white min-h-full py-7 px-5">
      <div>
        <h6 className="font-bold text-lg">User information</h6>
        <div className="bg-black/50 h-1 rounded-full w-36"></div>
        <div className="flex items-center mt-3">
          <Avatar url={otherUser.avatarUrl} size="3rem" />
          <p className="font-bold ml-3">{otherUser.name}</p>
        </div>
      </div>
      <div>
        <h6 className="mt-10 font-bold text-lg">Skills information</h6>
        <div className="bg-black/50 h-1 rounded-full w-[9.5rem]"></div>
        <div className="mt-2 grid grid-cols-2">
          <div>
            <p className="underline italic">Your wanted skill</p>
            <p>Name: {wantedSkill.name}</p>
            <p>Category: {wantedSkill.category.name}</p>
          </div>
          <div>
            <p className="underline italic">Your offered skill</p>
            <p>Name: {offeredSkill.name}</p>
            <p>Category: {offeredSkill.category.name}</p>
          </div>
        </div>
        <div className="mt-5">
          {pendingMatch !== null &&
            (pendingMatch?.userStatus == "SENDER" ? (
              <Button
                text="Cancel"
                width="10rem"
                color="#dddddd"
                textColor="black"
                onClick={cancelMatchRequest}
              />
            ) : pendingMatch?.userStatus == "RECEIVER" ? (
              <div className="flex items-center">
                <Button
                  text="Confirm Match"
                  width="10rem"
                  color="#cce7f5"
                  textColor="#0086ca"
                  onClick={confirmMatchRequest}
                />
                <Button
                  className="ml-4"
                  text="Decline Match"
                  width="10rem"
                  color="#dddddd"
                  textColor="black"
                  onClick={declineMatchRequest}
                />
              </div>
            ) : (
              <Button
                text="Match"
                width="10rem"
                color="#cce7f5"
                textColor="#0086ca"
                onClick={sendMatchRequest}
              />
            ))}
        </div>
      </div>
    </div>
  );
}
