import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api, { tokenStore } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On load, if we have a token, fetch the current user.
  useEffect(() => {
    const init = async () => {
      if (!tokenStore.access) return setLoading(false);
      try {
        const { data } = await api.get("/auth/me");
        setUser(data.data);
      } catch {
        tokenStore.clear();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const login = useCallback(async (identifier, password) => {
    const { data } = await api.post("/auth/login", { identifier, password });
    tokenStore.set(data.data);
    setUser(data.data.user);
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    tokenStore.set(data.data);
    setUser(data.data.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout", { refreshToken: tokenStore.refresh });
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
