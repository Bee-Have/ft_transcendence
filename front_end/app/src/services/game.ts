import axios from "axios";

const API_URL = "http://localhost:3001/game";

const joinMatchmaking = async (userId: number) => {
  return await axios.post(`${API_URL}/matchmaking/${userId}`);
};

const leaveMatchmaking = async (userId: number) => {
  return await axios.get(`${API_URL}/matchmaking/leave/${userId}`);
};

const getUserInvites = async (userId: number) => {
  return await axios.get(`${API_URL}/invites/${userId}`);
};

export default {
  joinMatchmaking,
  leaveMatchmaking,
  getUserInvites,
};
