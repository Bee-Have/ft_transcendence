import { createContext, useContext, useState } from "react";
import React from "react";

import { socket } from "src/pages/global/websocket";
import { UserStatus } from "src/pages/global/friend.dto";

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

  React.useEffect(() => {
    const togglePopup = (data: UserStatus) => {
      if (
        data === UserStatus.offline ||
        data === UserStatus.ingame ||
        data === UserStatus.ingamesolo
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
  }, []);

  return (
    <GamePopupContext.Provider value={{ isVisible, setIsVisible }}>
      {children}
    </GamePopupContext.Provider>
  );
};

export const useGamePopup = () => useContext(GamePopupContext);
