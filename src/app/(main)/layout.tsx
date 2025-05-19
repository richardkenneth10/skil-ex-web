"use client";

import Drawer from "@/components/(main)/drawer";
import Header from "@/components/(main)/header";
import Navigation from "@/components/(main)/navigation";
import TopDrawer from "@/components/(main)/top-drawer";
import { HeaderProvider } from "@/contexts/header-context";
import { UserProvider } from "@/contexts/user-context";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 768
  );

  const [navBgOpacity, setNavBgOpacity] = useState<number>(1);

  const controlsStyle = useMemo(
    () => ({
      //header color
      backgroundColor: `rgba(${
        isMobile
          ? !isDark
            ? "0,134,202,"
            : "77,184,255,"
          : !isDark
          ? "255,255,255,"
          : "0,0,0,"
      }${0.9 - (1 - navBgOpacity) * 0.4})`,
      backdropFilter: `blur(${navBgOpacity * 4 + (isMobile ? 0 : 2)}px)`,
    }),
    [isMobile, isDark, navBgOpacity]
  );

  const lastScrollTopRef = useRef(0);
  const minScrollTopOnDownRef = useRef<number | undefined>(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const mediaListener = (e: MediaQueryListEvent) => setIsDark(e.matches);
    media.addEventListener("change", mediaListener);

    const widthListener = (e: UIEvent) => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", widthListener);
    return () => {
      media.removeEventListener("change", mediaListener);
      window.removeEventListener("resize", widthListener);
    };
  }, []);

  const pageScrollHandler = () => {
    const container = pageContainerRef.current;
    if (!container) return;

    const lastScrollTop = lastScrollTopRef.current;

    const { scrollTop } = container;

    let navBgOpacity: number;
    if (scrollTop < lastScrollTop) {
      //scrolled up
      navBgOpacity = 1;
    } else {
      //scrolled down
      if (!minScrollTopOnDownRef.current)
        minScrollTopOnDownRef.current = scrollTop;
      const opacity = 1 - (scrollTop - minScrollTopOnDownRef.current) / 200;
      navBgOpacity = opacity < 0 ? 0 : opacity;
    }
    setNavBgOpacity(navBgOpacity);
    lastScrollTopRef.current = scrollTop <= 0 ? 0 : scrollTop; // Avoid negative values
  };

  return (
    <div className="h-screen flex" onClick={closeDrawers}>
      <Navigation controlsStyle={controlsStyle} />
      <Drawer isOpen={isDrawerOpen} />
      <TopDrawer isOpen={isTopDrawerOpen} />
      <div className="w-full md:w-5/6">
        <HeaderProvider>
          <UserProvider>
            <Header
              openDrawer={openDrawer}
              openTopDrawer={openTopDrawer}
              controlsStyle={controlsStyle}
            />
            <div
              ref={pageContainerRef}
              onScroll={pageScrollHandler}
              className="h-screen overflow-y-auto px-2 pt-[calc(3rem+0.5rem)] pb-[4.5rem]"
            >
              {children}
            </div>
          </UserProvider>
        </HeaderProvider>
      </div>
    </div>
  );
}
