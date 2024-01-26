import { createContext, useContext, useState } from "react";
import { io, Socket } from "socket.io-client";

import { ReadCookie, deleteCookie } from "src/components/ReadCookie";

import { BACKEND_URL } from "src/pages/global/env";
import { UserStatus } from "src/pages/global/friend.dto";

import { resetUserId } from "src/pages/global/userId";

import React from "react";

export interface ISessionContext {
  socket?: Socket | null;
  aToken?: string | null;
  rToken?: string | null;
  isLogged: boolean;
  updateTokens: () => void;
  login: () => void;
  logout: () => void;
  disconnectSocket: () => void;
}

export const defaultSessionContext: ISessionContext = {
  socket: null,
  aToken: ReadCookie("access_token"),
  rToken: ReadCookie("refresh_token"),
  isLogged: false,
  updateTokens: () => { },
  login: () => { },
  logout: () => { },
  disconnectSocket: () => { },
};

const SessionContext = createContext<ISessionContext>(defaultSessionContext);

export const SessionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [aToken, setAToken] = useState<string | null>(ReadCookie("access_token"));
  const [rToken, setRToken] = useState<string | null>(ReadCookie("refresh_token"));
  const [isLogged, setIsLogged] = useState<boolean>(false);

  React.useEffect(() => {
    if (socket === null) {
      setSocket(
        aToken
          ? io(BACKEND_URL + "/user", { extraHeaders: { id: aToken } })
          : null
      );
    }
    resetUserId();
  }, [aToken]);

  const updateTokens = () => {
    setAToken(ReadCookie("access_token"));
    setRToken(ReadCookie("refresh_token"));
  };

  const login = () => {
    updateTokens();
    setIsLogged(true);
  }

  const logout = () => {
    socket?.emit("update-user-status", UserStatus[UserStatus.offline])
    deleteCookie("access_token");
    deleteCookie("refresh_token");
    deleteCookie("TfaEnable");
    deleteCookie("userId");
    setAToken(null);
    setRToken(null);
    setIsLogged(false);
  };

  const disconnectSocket = () => {
    socket?.disconnect();
    setSocket(null);
  }

  return (
    <SessionContext.Provider
      value={{ socket, aToken, rToken, isLogged, updateTokens, login, logout, disconnectSocket }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export function useSessionContext() {
  return useContext(SessionContext);
}
