"use client";

import Drawer from "@/components/(main)/drawer";
import Header from "@/components/(main)/header";
import Navigation from "@/components/(main)/navigation";
import TopDrawer from "@/components/(main)/top-drawer";
import { HeaderProvider } from "@/contexts/header-context";
import { UserProvider } from "@/contexts/user-context";
import { useState } from "react";

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

  return (
    <div>
      <div className="h-screen flex" onClick={closeDrawers}>
        <Navigation />
        <Drawer isOpen={isDrawerOpen} />
        <TopDrawer isOpen={isTopDrawerOpen} />
        <div className="w-full">
          <HeaderProvider>
            <UserProvider>
              <Header openDrawer={openDrawer} openTopDrawer={openTopDrawer} />
              <div className="h-[calc(92vh-4.5rem)] md:h-[92vh] mt-[8vh] overflow-y-auto p-2">
                {children}
              </div>
            </UserProvider>
          </HeaderProvider>
        </div>
      </div>
    </div>
  );
}
