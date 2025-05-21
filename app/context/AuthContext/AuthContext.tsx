import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext<
  { user: any; setUser: React.Dispatch<React.SetStateAction<any>> } | undefined
>(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
