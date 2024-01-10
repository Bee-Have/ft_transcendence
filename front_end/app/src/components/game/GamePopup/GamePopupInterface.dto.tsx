import { Friend } from "src/pages/global/friend.dto";

interface GamePopupProps {
  emitter: Friend;
  receiver?: Friend;
  gameMode: string;
}

export default GamePopupProps;
