import Constants from "@/utils/constants";
import Image from "next/image";
import { useEffect, useState } from "react";
import NavigationTile from "./navigation-tile";

export default function Navigation({ bgOpacity }: { bgOpacity: number }) {
  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

  return (
    <div className="z-10 fixed md:static bottom-0 left-0 right-0 h-[4.5rem] md:w-1/6">
      <Image
        className="hidden md:block m-auto py-2"
        src="/icon.ico"
        alt="logo"
        width={30}
        height={30}
      />
      <div
        className={`flex md:block justify-around md:!bg-transparent md:shadow-lg md:h-[calc(100vh-8vh)] py-1 md:py-3 md:pr-3`}
        style={{
          //primary color
          backgroundColor: `rgba(${!isDark ? "0,134,202," : "77,184,255,"}${
            0.9 - (bgOpacity != null ? (1 - bgOpacity) * 0.4 : 0)
          })`,
          backdropFilter: `blur(${bgOpacity * 4}px)`,
        }}
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
