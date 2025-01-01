import { usePathname } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

// Define the context value type
interface HeaderContextType {
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// Create the provider component
export const HeaderProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentPath = usePathname();
  const [title, setTitle] = useState<string | null>(
    currentPath.toUpperCase().slice(1)
  );

  // useEffect(() => {
  //   const user = getCookie(Constants.userKey);

  //   if (user) {
  //     try {
  //       setUser(JSON.parse(user.toString())); // Parse the cookie and set the user
  //     } catch (error) {
  //       console.error("Failed to parse user cookie:", error);
  //     }
  //   }
  // }, []);

  return (
    <HeaderContext.Provider value={{ title, setTitle }}>
      {children}
    </HeaderContext.Provider>
  );
};

// Custom hook for accessing the context
export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
};
