import Constants from "@/utils/constants";
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
      <ClientCookie
        tokensJSONString={res.config.headers[Constants.authTokensHeaderKey]}
      />
      {matches.length == 0 ? (
        <p className="text-center">No data</p>
      ) : (
        <div className="p-4">
          {[
            ...matches,
            ...matches,
            ...matches,
            ...matches,
            ...matches,
            ...matches,
            // ...matches, ...matches, ...matches
          ].map((m, i) => {
            const roomPath = `rooms/${m.exchangeRoomId}`;
            return (
              <div className="relative" key={m.id + i}>
                <Link
                  href={roomPath}
                  className="absolute inset-0 md:pointer-events-none"
                >
                  {/* Empty Link to make whole card clickable on mobile, pointer-events-none on desktop */}
                </Link>
                <div>
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
                    {/* make this client comp to stop the nested a tag error*/}
                    <Link
                      href={roomPath}
                      className="hidden md:block pointer-events-auto border-2 px-8 py-2 rounded-3xl border-primary"
                    >
                      View
                    </Link>
                    {/* </div> */}
                  </div>
                  <div className="bg-divider h-1 rounded-md mx-4"></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
