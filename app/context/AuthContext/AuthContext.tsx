import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_STORAGE_KEY = "user_profile";

const AuthContext = createContext<
  | {
      user: any;
      setUser: React.Dispatch<React.SetStateAction<any>>;
      updateUserProfile: (updates: any) => Promise<void>;
    }
  | undefined
>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  const saveUserProfile = async (userData: any) => {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user profile:", error);
    }
  };

  const updateUserProfile = async (updates: any) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      await saveUserProfile(updatedUser);
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };

  // Override setUser to also save to storage
  const setUserWithStorage = async (userData: any) => {
    setUser(userData);
    if (userData) {
      await saveUserProfile(userData);
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser: setUserWithStorage,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
