"use client";

import { useHeader } from "@/contexts/header-context";
import { useUser } from "@/contexts/user-context";
import Constants from "@/utils/constants";
import { usePathname, useRouter } from "next/navigation";
import { CSSProperties } from "react";
import { FaArrowLeft, FaBars } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa6";
import Avatar from "./avatar";

export default function Header({
  openDrawer,
  openTopDrawer,
  controlsStyle,
}: {
  openDrawer: () => void;
  openTopDrawer: () => void;
  controlsStyle?: CSSProperties;
}) {
  const currentPath = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { title } = useHeader();

  const isCurrentPathBase = Constants.navItems.some(
    (n) => `/${n.title.toLowerCase()}` === currentPath
  );

  return (
    <div
      className={`fixed z-10 top-0 left-0 md:left-[16.666667%] right-0 h-[3rem] flex md:justify-end bg-primary md:bg-bright text-white md:text-inherit items-center py-4 px-4`}
      style={controlsStyle}
    >
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
        <Avatar size="calc(3rem - 1rem)" url={user?.avatarUrl} />
        <h6 className="ml-2 font-bold text-sm">{user?.firstName ?? ""}</h6>
        <FaChevronDown className="ml-2 text-xl border border-black rounded-full p-1" />
      </button>
    </div>
  );
}
