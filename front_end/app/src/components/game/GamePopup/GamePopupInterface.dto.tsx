import { Friend } from "src/pages/global/friend.dto";

interface GamePopupProps {
  sender: Friend;
  receiver?: Friend;
  gameMode: string;
  acceptedInvite: boolean;
}

export default GamePopupProps;
