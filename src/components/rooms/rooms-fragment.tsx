import axios from "@/utils/server-axios";
import Image from "next/image";
import Link from "next/link";
import ClientCookie from "../(main)/client-cookie";

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
          {matches.map((m) => (
            <div key={m.id}>
              <div className="my-1 rounded-sm flex items-center p-2">
                <div className="flex-1">
                  <p className="font-bold text-lg">{`${m.otherUserSkill.name} & ${m.userSkill.name} room`}</p>
                  <div className="mt-2 flex items-center">
                    <Image
                      className="w-10 h-10 rounded-full object-cover"
                      src={m.otherUser.avatarUrl ?? "/icons/profile.svg"}
                      alt={`${m.otherUser.name}'s avatar`}
                      width={100}
                      height={100}
                    />
                    <p className="ml-4">{m.otherUser.name}</p>
                  </div>
                </div>
                <Link
                  href={`rooms/${m.exchangeRoomId}`}
                  className="hidden md:block border-2 px-8 py-2 rounded-3xl border-[#0086CA]"
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
