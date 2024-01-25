import { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

import { ReadCookie, deleteCookie } from "src/components/ReadCookie";

import { BACKEND_URL } from "src/pages/global/env";

import React from "react";

export interface ISessionContext {
  socket?: Socket | null;
  aToken?: string | null;
  rToken?: string | null;
  updateTokens?: () => void;
  logout?: () => void;
}

export const defaultSessionContext: ISessionContext = {
  socket: null,
  aToken: null,
  rToken: null,
};

const SessionContext = createContext<ISessionContext>(defaultSessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [aToken, setAToken] = useState<string | null>(null);
  const [rToken, setRToken] = useState<string | null>(null);

  React.useEffect(() => {
	console.log("SessionProvider useEffect: ", aToken, rToken, socket);
    if (socket === null && aToken !== null) {
      setSocket(
        aToken
          ? io(BACKEND_URL + "/user", { extraHeaders: { id: aToken } })
          : null
      );
    }
  }, [aToken]);

  const updateTokens = () => {
    setAToken(ReadCookie("access_token"));
    setRToken(ReadCookie("refresh_token"));
  };

  const logout = () => {
    socket?.disconnect();
    setSocket(null);
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("TfaEnable");
    deleteCookie("userId");
	setAToken(null);
	setRToken(null);
  };

  return (
    <SessionContext.Provider
      value={{ socket, aToken, rToken, updateTokens, logout }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSessionContext() {
  return useContext(SessionContext);
}
