import Constants from "@/utils/constants";
import Image from "next/image";
import NavigationTile from "./navigation-tile";

export default function Navigation() {
  return (
    <div className="fixed md:static bottom-0 left-0 right-0 h-[4.5rem] md:w-1/6">
      <Image
        className="hidden md:block m-auto py-2"
        src="/icon.ico"
        alt="logo"
        width={30}
        height={30}
      />
      <div className="flex md:block justify-around bg-[#0086CA] md:bg-transparent py-1 md:py-3 md:pr-3">
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
