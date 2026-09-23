import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useApi } from "./ApiContext.jsx";
import api from "../api";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const { runApi, registerUnauthorisedHandler } = useApi();
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const storedToken = localStorage.getItem("authToken");

      if (!storedToken) {
        if (mounted) setAuthLoading(false);
        return;
      }

      await runApi(
        api.post("/api/auth/verify"),
        () => {
          if (mounted) setToken(storedToken);
        },
        "Invalid token",
        () => localStorage.removeItem("authToken")
      );

      if (mounted) setAuthLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [runApi]);

  // Persist token to localStorage
  useEffect(() => {
    if (authLoading) return;
    if (token) localStorage.setItem("authToken", token);
    else localStorage.removeItem("authToken");
  }, [token, authLoading]);

  const loginAsync = useCallback(
    async (email, password) => {
      return runApi(
        api.post("/api/users/login", { email, password }),
        (data) => setToken(data.token),
        "Error logging in"
      );
    },
    [runApi]
  );

  const logout = useCallback(() => {
    setToken(null);
  }, []);

  useEffect(() => {
    registerUnauthorisedHandler(() => {
      // Only do work if we actually had a token
      setToken((prev) => (prev ? null : prev));
    });
  }, [registerUnauthorisedHandler]);

  const isOptimisticallyLoggedIn = useMemo(() => {
    return authLoading
      ? localStorage.getItem("authToken") != null
      : token != null;
  }, [authLoading, token]);

  const value = useMemo(
    () => ({
      token,
      loginAsync,
      logout,
      isOptimisticallyLoggedIn,
    }),
    [token, loginAsync, logout, isOptimisticallyLoggedIn]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (ctx === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
