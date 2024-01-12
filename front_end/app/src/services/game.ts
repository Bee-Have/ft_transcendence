import axios from "axios";

const API_URL = "http://localhost:3001/game";

const joinMatchmaking = async (userId: number, gameMode: string) => {
  return await axios.post(`${API_URL}/matchmaking/${userId}`, { gameMode });
};

const leaveMatchmaking = async (userId: number) => {
  return await axios.get(`${API_URL}/matchmaking/leave/${userId}`);
};

const getUserInvites = async (userId: number) => {
  return await axios.get(`${API_URL}/invites/${userId}`);
};

const deleteUserInvites = async (userId: number) => {
  return await axios.post(`${API_URL}/deleteInvites/${userId}`);
}

const sendInvite = async (userId: number, invitedUserId: number, gameMode: string) => {
	  return await axios.post(`${API_URL}/sendInvite/${userId}`, { invitedUserId, gameMode });
}

export default {
  joinMatchmaking,
  leaveMatchmaking,
  getUserInvites,
  deleteUserInvites,
  sendInvite,
};
