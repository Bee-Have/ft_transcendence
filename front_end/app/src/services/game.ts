import axios from "axios";

const API_URL = "http://localhost:3001/game";

const joinMatchmaking = async () => {
  return await axios.get(`${API_URL}/matchmaking`);
};

export default {
  joinMatchmaking,
};
