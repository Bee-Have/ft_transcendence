import axios from "axios";
import { BACKEND_URL } from "src/pages/global/env";

const API_URL = BACKEND_URL + "/user";

const getLeaderboard = async () => {
  return await axios
    .get(`${API_URL}/leaderboard`, {
      withCredentials: true,
    })
    .then((res: any) => res.data);
};

const sendFriendRequest = async (receiverId: number) => {
  return await axios
    .get(`${API_URL}/friend/create/${receiverId}`, {
      withCredentials: true,
    })
    .then((res: any) => res.data);
};

const removeFriend = async (receiverId: number) => {
  return await axios
    .post(
      `${API_URL}/friend/remove/${receiverId}`,
      {},
      {
        withCredentials: true,
      }
    )
    .then((res: any) => res.data);
};

const userService = {
  getLeaderboard,
  sendFriendRequest,
  removeFriend,
};

export default userService;
