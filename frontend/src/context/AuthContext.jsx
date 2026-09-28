import { createContext, useContext, useEffect, useState } from "react";

import api from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("ef_token");
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me/")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("ef_token"))
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const res = await api.post("/auth/login/", { username, password });
    localStorage.setItem("ef_token", res.data.token);
    const me = await api.get("/auth/me/");
    setUser(me.data);
    return me.data;
  }

  async function register(username, password, role, telephone) {
    const res = await api.post("/auth/register/", { username, password, role, telephone });
    localStorage.setItem("ef_token", res.data.token);
    const me = await api.get("/auth/me/");
    setUser(me.data);
    return me.data;
  }

  function logout() {
    localStorage.removeItem("ef_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
