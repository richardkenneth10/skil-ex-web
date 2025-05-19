"use client";

import Drawer from "@/components/(main)/drawer";
import Header from "@/components/(main)/header";
import Navigation from "@/components/(main)/navigation";
import TopDrawer from "@/components/(main)/top-drawer";
import { HeaderProvider } from "@/contexts/header-context";
import { UserProvider } from "@/contexts/user-context";
import { useRef, useState } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isTopDrawerOpen, setIsTopDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const openTopDrawer = () => setIsTopDrawerOpen(true);
  const closeTopDrawer = () => setIsTopDrawerOpen(false);
  const closeDrawers = () => {
    closeTopDrawer();
    closeDrawer();
  };
  const pageContainerRef = useRef<HTMLDivElement>(null);

  const [navBgOpacity, setNavBgOpacity] = useState<number>(1);

  const lastScrollTopRef = useRef(0);
  const minScrollTopOnDownRef = useRef<number | undefined>(0);

  const pageScrollHandler = () => {
    const container = pageContainerRef.current;
    if (!container) return;

    const lastScrollTop = lastScrollTopRef.current;

    const { scrollTop, scrollHeight, clientHeight } = container;
    console.log(scrollTop, scrollHeight, clientHeight);
    console.log(lastScrollTop);
    console.log(minScrollTopOnDownRef.current);

    if (scrollTop < lastScrollTop) {
      //scrolled up
      console.log("up");

      setNavBgOpacity(1);
    } else {
      //scrolled down
      console.log("down");
      if (!minScrollTopOnDownRef.current)
        minScrollTopOnDownRef.current = scrollTop;
      const opacity = 1 - (scrollTop - minScrollTopOnDownRef.current) / 200;
      setNavBgOpacity(opacity < 0 ? 0 : opacity);
      console.log(opacity + " opacity");
    }
    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative values
    console.log(lastScrollTop + " last");
  };

  return (
    <div>
      <div className="h-screen flex" onClick={closeDrawers}>
        <Navigation bgOpacity={navBgOpacity} />
        <Drawer isOpen={isDrawerOpen} />
        <TopDrawer isOpen={isTopDrawerOpen} />
        <div className="w-full">
          <HeaderProvider>
            <UserProvider>
              <Header openDrawer={openDrawer} openTopDrawer={openTopDrawer} />
              <div
                ref={pageContainerRef}
                onScroll={pageScrollHandler}
                className="h-[calc(92vh)] md:h-[92vh] mt-[8vh] overflow-y-auto px-2 pt-2 pb-[4.5rem]"
              >
                {children}
              </div>
            </UserProvider>
          </HeaderProvider>
        </div>
      </div>
    </div>
  );
}
