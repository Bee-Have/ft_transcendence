import { createContext, useContext, useState } from "react";
import React from "react";

interface GamePopupContextProps {
	isVisible: boolean;
	setIsVisible: (isVisible: boolean) => void;
}

const defaultGamePopupContext: GamePopupContextProps = {
	isVisible: false,
	setIsVisible: () => {}
};

const GamePopupContext = createContext<GamePopupContextProps>(
  defaultGamePopupContext
);

export const GamePopupProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  return (
	<GamePopupContext.Provider value={{ isVisible, setIsVisible }}>
	  {children}
	</GamePopupContext.Provider>
  );
};

export const useGamePopup = () => useContext(GamePopupContext);
