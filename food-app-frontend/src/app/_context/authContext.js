"use client";

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  const getUser = async (localToken) => {
    try {
      const rawData = await fetch("http://localhost:4000/auth", {
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
    if (typeof window !== "undefined") {
      const localToken = localStorage.getItem("token");
      if (localToken) {
        getUser(localToken);
        return setToken(localToken);
      }
      return setToken("no token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, user }}>
      {children}
    </AuthContext.Provider>
  );
};
