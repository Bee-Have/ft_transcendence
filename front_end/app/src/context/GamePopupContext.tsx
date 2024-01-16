import { createContext, useContext, useState } from "react";
import React from "react";

import { socket } from "src/pages/global/websocket";
import { UserStatus, UserStatusEventDto } from "src/pages/global/friend.dto";

import { useEffectOnce } from "src/components/useEffectOnce";

interface GamePopupContextProps {
  isVisible: boolean;
  setIsVisible: (isVisible: boolean) => void;
}

const defaultGamePopupContext: GamePopupContextProps = {
  isVisible: false,
  setIsVisible: () => {},
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

  useEffectOnce(() => {
    const togglePopup = (data: UserStatusEventDto) => {
      if (
        data.userstatus === UserStatus.offline ||
        data.userstatus === UserStatus.ingame ||
        data.userstatus === UserStatus.ingamesolo
      ) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    socket?.on("user-status", togglePopup);

    return () => {
      socket?.off("user-status", togglePopup);
    };
  });

  return (
    <GamePopupContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </GamePopupContext.Provider>
  );
};

export const useGamePopup = () => useContext(GamePopupContext);
