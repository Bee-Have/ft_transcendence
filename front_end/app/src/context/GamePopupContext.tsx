import { createContext, useContext, useState } from "react";
import React from "react";

import { UserStatus, UserStatusEventDto } from "src/pages/global/friend.dto";

import { useSessionContext } from "./SessionContext";
import { userId } from "src/pages/global/userId";

interface GamePopupContextProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const defaultGamePopupContext: GamePopupContextProps = {
  isVisible: false,
  setIsVisible: () => { },
};

const GamePopupContext = createContext<GamePopupContextProps>(
  defaultGamePopupContext
);

export const GamePopupProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const session = useSessionContext();


  React.useEffect(() => {
    console.log("mounting context, socket == ", session.socket);

    const togglePopup = (data: UserStatusEventDto) => {
    console.log("toggle popup ", data);
      if (userId !== data.userId) return ;
      if (
        data.userstatus === UserStatus.offline ||
        data.userstatus === UserStatus.ingame ||
        data.userstatus === UserStatus.ingamesolo
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      if (data.userstatus === UserStatus.offline) {
        session.disconnectSocket();
      }
    };

    session.socket?.on("user-status", togglePopup);

    return () => {
      session.socket?.off("user-status", togglePopup);
    };
  }, [session.socket]);

  return (
    <GamePopupContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </GamePopupContext.Provider>
  );
};

export const useGamePopup = () => useContext(GamePopupContext);
