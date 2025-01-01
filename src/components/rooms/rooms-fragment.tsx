import axios from "@/utils/server-axios";
import Image from "next/image";
import Link from "next/link";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import ClientCookie from "../(main)/client-cookie";
import Rating from "../home/rating";

type OngoingMatch = {
  exchangeRoomId: number;
  userSkill: {
    name: string;
    id: number;
    categoryId: number;
  };
  otherUser: {
    id: number;
    name: never;
    bio: string | null;
    avatarUrl: string | null;
  };
  otherUserSkill: {
    name: string;
    id: number;
    categoryId: number;
  };
  id: number;
  createdAt: Date;
};

export default async function RoomsFragment() {
  const res = await axios.get("/skills/my-ongoing-matches");
  const matches: OngoingMatch[] = res.data;

  return (
    <>
      <ClientCookie cookie={res.headers["set-cookie"]} />
      {matches.length == 0 ? (
        <p className="text-center">No data</p>
      ) : (
        <div className="bg-white h-full p-4">
          {matches.map((m, i) => (
            <div key={m.id}>
              <div className="my-1 rounded-sm flex items-center p-2">
                <div className="flex-1">
                  <div className="flex items-center">
                    <Image
                      className="bg-cover mx-2 h-[calc(8vh-1rem)] w-[calc(8vh-1rem)]"
                      src={m.otherUser.avatarUrl ?? "/icons/profile.svg"}
                      alt="profile photo"
                      width={100}
                      height={100}
                    />
                    <div className="w-[22vw]">
                      <em>
                        <strong>{m.otherUserSkill.name}</strong>
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
                      <strong>{m.userSkill.name}</strong>
                    </em>{" "}
                    skill
                  </div>
                </div>
                <button className="mx-2">
                  {i % 2 == 1 ? <FaRegBookmark /> : <FaBookmark />}
                </button>
                <Link
                  href={`rooms/${m.exchangeRoomId}`}
                  className="border-2 px-8 py-2 rounded-3xl border-[#0086CA]"
                >
                  View
                </Link>
                {/* </div> */}
              </div>
              <div className="bg-slate-100 h-1 rounded-md mx-4"></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
