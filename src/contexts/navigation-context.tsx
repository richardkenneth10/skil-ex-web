import { usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the context value type
interface NavigationContextType {
  title: string | null;
  setTitle: React.Dispatch<React.SetStateAction<string | null>>;
}

// Create the context
const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
);

// Create the provider component
export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const currentPath = usePathname();
  const [title, setTitle] = useState<string | null>(
    currentPath.toUpperCase().slice(1)
  );

  useEffect(() => {
    setTitle(currentPath.toUpperCase().slice(1));
  }, [currentPath]);

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
    <NavigationContext.Provider value={{ title, setTitle }}>
      {children}
    </NavigationContext.Provider>
  );
};

// Custom hook for accessing the context
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error("useNavigation must be used within a HeaderProvider");
  }
  return context;
};
