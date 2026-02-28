"use client";

import { createContext, useEffect, useState } from "react";

const backend_url = process.env.PUBLIC_BACKEND_URL;

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const getUser = async (localToken) => {
    try {
      const rawData = await fetch(`${backend_url}/auth`, {
        method: "GET",
        headers: {
          Authorization: `${localToken}`,
        },
      });

      const data = await rawData.json();
      console.log("dataaaa", data);

      setUser(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncAuth = () => {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
        getUser(localToken);
        return;
      }
      setToken("");
      setUser(null);
    };

    syncAuth();
    window.addEventListener("auth:changed", syncAuth);
    window.addEventListener("storage", syncAuth);
    return () => {
      window.removeEventListener("auth:changed", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
};
