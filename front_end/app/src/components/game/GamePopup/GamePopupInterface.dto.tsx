import { Friend } from "src/pages/global/friend.dto";

interface GamePopupProps {
  sender: Friend;
  receiver?: Friend;
  gameMode: string;
}

export default GamePopupProps;
