"use client";

import { useHeader } from "@/contexts/header-context";
import { useUser } from "@/contexts/user-context";
import Constants from "@/utils/constants";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";

export default function Header({
  openDrawer,
  openTopDrawer,
}: {
  openDrawer: () => void;
  openTopDrawer: () => void;
}) {
  const currentPath = usePathname();
  const router = useRouter();
  const user = useUser();
  const { title } = useHeader();

  const isCurrentPathBase = Constants.navItems.some(
    (n) => `/${n.title.toLowerCase()}` === currentPath
  );

  return (
    <div className="fixed top-0 left-0 md:left-[16.666667%] right-0 h-[8vh] flex md:justify-end bg-[#0086CA] md:bg-white text-white md:text-inherit items-center py-4 px-4 md:pl-0">
      <div className="md:mr-auto my-auto">
        {isCurrentPathBase ? (
          <button
            className="md:hidden"
            onClick={(e) => {
              e.stopPropagation();
              openDrawer();
            }}
          >
            <FaBars />
          </button>
        ) : (
          <button onClick={router.back}>
            <FaArrowLeft />
          </button>
        )}
      </div>
      <h3 className="absolute left-1/2 -translate-x-1/2 font-bold">{title}</h3>
      <button
        className="hidden md:flex items-center justify-between w-[11.5rem]"
        onClick={(e) => {
          e.stopPropagation();
          openTopDrawer();
        }}
      >
        <Image
          className="bg-cover h-[calc(8vh-1rem)] w-[calc(8vh-1rem)]"
          src={user?.avatarUrl ?? "/icons/profile.svg"}
          alt="profile photo"
          width={100}
          height={100}
        />
        <h6 className="ml-2 font-bold text-sm">{user?.firstName ?? ""}</h6>
        <FaChevronDown className="ml-2 text-xl border border-black rounded-full p-1" />
      </button>
    </div>
  );
}
