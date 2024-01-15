import axios from "axios";

const API_URL = "http://localhost:3001/game";

const joinMatchmaking = async (userId: number, gameMode: string) => {
  return await axios
    .post(`${API_URL}/matchmaking/${userId}`, { gameMode })
    .then((res) => res.data);
};

const leaveMatchmaking = async (userId: number) => {
  return await axios
    .get(`${API_URL}/matchmaking/leave/${userId}`)
    .then((res) => res.data);
};

const getUserInvites = async (userId: number) => {
  return await axios
    .get(`${API_URL}/invites/${userId}`)
    .then((res) => res.data);
};

const deleteUserInvites = async (userId: number) => {
  return await axios
    .post(`${API_URL}/deleteInvites/${userId}`)
    .then((res) => res.data);
};

const sendInvite = async (
  userId: number,
  invitedUserId: number,
  gameMode: string
) => {
  return await axios
    .post(`${API_URL}/sendInvite/${userId}`, {
      invitedUserId,
      gameMode,
    })
    .then((res) => res.data);
};

const declineInvite = async (userId: number, declinedUserId: number) => {
  return await axios
    .post(`${API_URL}/declineInvite/${userId}`, {
      declinedUserId,
    })
    .then((res) => res.data);
};

const acceptInvite = async (userId: number, acceptedUserId: number) => {
  return await axios
    .post(`${API_URL}/acceptInvite/${userId}`, {
      acceptedUserId,
    })
    .then((res) => res.data);
};

const getMatchHistory = async (userId: number) => {
  return await axios
    .get(`${API_URL}/matchHistory/${userId}`)
    .then((res) => res.data);
};

export default {
  joinMatchmaking,
  leaveMatchmaking,
  getUserInvites,
  deleteUserInvites,
  sendInvite,
  declineInvite,
  acceptInvite,
  getMatchHistory,
};
