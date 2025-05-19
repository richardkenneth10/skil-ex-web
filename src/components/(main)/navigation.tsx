import Constants from "@/utils/constants";
import Image from "next/image";
import { CSSProperties } from "react";
import NavigationTile from "./navigation-tile";

export default function Navigation({
  controlsStyle,
}: {
  controlsStyle?: CSSProperties;
}) {
  return (
    <div className="z-10 fixed md:static bottom-0 left-0 right-0 h-[4.5rem] md:h-[calc(100vh-3rem)] md:w-1/6">
      <Image
        className="hidden md:block m-auto py-2"
        src="/icon.ico"
        alt="logo"
        width={30}
        height={30}
      />
      <div
        className={`flex md:block justify-around md:!bg-transparent md:shadow-lg h-full py-1 md:py-3 md:pr-3`}
        style={controlsStyle}
      >
        {Constants.navItems.map((nav) => (
          <NavigationTile
            key={nav.title}
            navItem={{ ...nav, icon: <nav.icon /> }}
          />
        ))}
      </div>
    </div>
  );
}
