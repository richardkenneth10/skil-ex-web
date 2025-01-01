// src/contexts/ScrollContext.tsx
import React, { createContext, ReactNode, useContext, useRef } from "react";

interface ScrollContextType {
  chatContainerRef: React.RefObject<HTMLElement | null>;
  scrollToBottom: () => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScroll = (): ScrollContextType => {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error("useScroll must be used within a ScrollProvider");
  }
  return context;
};

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  return (
    <ScrollContext.Provider value={{ chatContainerRef, scrollToBottom }}>
      {children}
    </ScrollContext.Provider>
  );
};
