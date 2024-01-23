import axios from "axios";
import { BACKEND_URL } from "src/pages/global/env";

const API_URL = BACKEND_URL + "/user"

const getLeaderboard = async () => {
    return await axios
    .get(`${API_URL}/leaderboard`)
    .then((res) => res.data);
}

const userService = {
    getLeaderboard
}

export default userService