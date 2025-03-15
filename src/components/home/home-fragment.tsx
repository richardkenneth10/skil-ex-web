import axios from "@/utils/server-axios";
import Link from "next/link";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import Avatar from "../(main)/avatar";
import ClientCookie from "../(main)/client-cookie";
import Rating from "./rating";

export type Match = {
  otherUser: {
    id: number;
    name: never;
    bio: string | null;
    avatarUrl: string | null;
  };
  offeredSkill: {
    id: number;
    name: string;
    category: { id: number; name: string };
  };
  wantedSkill: {
    id: number;
    name: string;
    category: { id: number; name: string };
  };
  pendingMatch?: {
    id: string;
    userStatus: "SENDER" | "RECEIVER";
  };
};

type MatchWTCategory = {
  otherUser: {
    id: number;
    name: never;
    bio: string | null;
    avatarUrl: string | null;
  };
  offeredSkill: {
    id: number;
    name: string;
    categoryId: number;
  };
  wantedSkill: {
    id: number;
    name: string;
    categoryId: number;
  };
  pendingMatch?: {
    id: string;
    userStatus: "SENDER" | "RECEIVER";
  };
};

// export const getServerSideProps = (async () => {
//   const matches: Match[] = (await axios.get("/skills/matches")).data;

//   return { props: { matches } };
// }) satisfies GetServerSideProps<{ matches: Match[] }>;

export default async function HomeFragment() {
  // const res = await axios.post(
  //   "/api",
  //   {},
  //   { baseURL: "https://localhost:3001" }
  // );
  const res = await axios.get("/skills/matches");
  const matches: MatchWTCategory[] = res.data;

  return (
    <>
      <ClientCookie cookie={res.headers["set-cookie"]} />
      {matches.length == 0 ? (
        <p className="text-center">No data</p>
      ) : (
        <div className="bg-white min-h-full p-4">
          {matches.map((m, i) => (
            <div
              key={`${m.offeredSkill.id}_${m.wantedSkill.id}_${m.otherUser.id}`}
            >
              <div className="my-1 rounded-sm flex items-center p-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Avatar
                      url={m.otherUser.avatarUrl}
                      size="calc(8vh - 1rem)"
                    />
                    <div className="ml-3 w-[22vw]">
                      <em>
                        <strong>{m.wantedSkill.name}</strong>
                      </em>
                      <div> {m.otherUser.name}</div>{" "}
                    </div>
                    <Rating value={i + 1} />
                  </div>{" "}
                  <div className="bg-slate-700 h-1 rounded-full"></div>
                  <div>
                    {" "}
                    In exchange for your{" "}
                    <em>
                      <strong>{m.offeredSkill.name}</strong>
                    </em>{" "}
                    skill
                  </div>
                </div>
                {m.pendingMatch && (
                  <div className="bg-[#4ba7d6] rounded-md p-1 mx-2 text-sm text-white">
                    {m.pendingMatch?.userStatus == "SENDER"
                      ? "Requested"
                      : "Pending Request"}
                  </div>
                )}
                <button className="mx-2">
                  {i % 2 == 1 ? <FaRegBookmark /> : <FaBookmark />}
                </button>
                <Link
                  className="hidden md:block border-2 px-8 py-2 rounded-3xl border-[#0086CA]"
                  href={`home/match?otherUserId=${m.otherUser.id}&offeredSkillId=${m.offeredSkill.id}&wantedSkillId=${m.wantedSkill.id}`}
                >
                  View
                </Link>
              </div>
              <div className="bg-slate-100 h-1 rounded-md mx-4"></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
