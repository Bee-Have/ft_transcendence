import axios from "axios";
import { BACKEND_URL } from "../global/env";
import React from "react";
import { useNavigate } from "react-router";

async function fetchLeaderboard(): Promise<any>{
    try {
        const response = await axios.get(BACKEND_URL + '/user/leaderboard')
        console.log('Leaderboard:', response.data)
        return response.data
} catch (e) {
    console.log('Erreur dans la recupe du leaderboard', e)
}
}

////////////////////////////

const Leaderboard: React.FC = () => {
	const navigate = useNavigate();
    const data = fetchLeaderboard();

	return (
		<div className='content'>
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
			</div>
            { data }
		</div>
	);
};

export default Leaderboard;