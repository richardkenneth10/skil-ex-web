import { IUser } from "@/app/interfaces/user/user";
import Constants from "@/utils/constants";
import { getCookie } from "cookies-next";
import React, { createContext, useContext, useEffect, useState } from "react";

// Define the user type (adjust fields as per your app's user data)

// Define the context value type
interface UserContextType {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
}

// Create the context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create the provider component
export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    const user = getCookie(Constants.userKey);

    if (user) {
      try {
        setUser(JSON.parse(user.toString())); // Parse the cookie and set the user
      } catch (error) {
        console.error("Failed to parse user cookie:", error);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for accessing the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
