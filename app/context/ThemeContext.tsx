import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { Appearance } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "light" | "dark";

interface ThemeContextProps {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>("light");

  // Load theme từ AsyncStorage hoặc hệ thống
  useEffect(() => {
    const loadTheme = async () => {
      const saved = await AsyncStorage.getItem("app-theme");
      if (saved === "light" || saved === "dark") {
        setModeState(saved);
      } else {
        const systemTheme = Appearance.getColorScheme();
        setModeState(systemTheme === "dark" ? "dark" : "light");
      }
    };
    loadTheme();
  }, []);

  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem("app-theme", newMode);
  };

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
  };

  const value = useMemo(() => ({ mode, toggleTheme, setMode }), [mode]);

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context)
    throw new Error("useThemeMode must be used within ThemeProvider");
  return context;
};
