import axios, { AxiosError } from "axios";
//mport { BACKEND_URL } from "../global/env";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useEffectOnce } from "src/components/useEffectOnce";
//import { Friend } from "../global/friend.dto";
import { useErrorContext } from "src/context/ErrorContext";
import userService from "src/services/user";
import { errorHandler } from "src/context/errorHandler";
import { Menu } from "material-ui";


interface LeaderboardItemDTO {
	username: string;
	id: string;
	score: number;
	//avatar ?
}

interface LeaderboardProps {
	username: string;
	id: string;
	score: number;
	//avatar ?
}

function UserCard({ user }: { user: LeaderboardProps }) {

	return (
		<div>
			{user.id}
			{user.score}
			{user.username}
		</div>
	)
}


const Leaderboard: React.FC = () => {
	const [users, setUsers] = useState<LeaderboardProps[]>([]);
	const navigate = useNavigate();
	const errorContext = useErrorContext();

	useEffectOnce(() => {
		userService
			.getLeaderboard()
			.then((res) => {
				setUsers(res)
			})
			.catch((error: Error | AxiosError<unknown, any>) => {
				errorContext.newError?.(errorHandler(error))
			})
	})
	return (
		<div className="Leaderboard">
			<div className="header">
				<button className="btn btn-light" onClick={() => navigate("/")}>
					home
				</button>
			</div>
			<Menu />
			<div className="content">
				<div className="printCard">
					{Object.keys(users).map((i) => (
						<UserCard
							key={i}
							user={users[i]}
						/>
					))}
				</div>
			</div>
		</div>
	);
}

// async function fetchLeaderboard(): Promise<any>{
//     try {
//         const response = await axios.get(BACKEND_URL + '/user/leaderboard')
//         console.log('Leaderboard:', response.data)
//         return response.data
// } catch (e) {
//     console.log('Erreur dans la recupe du leaderboard', e)
// }
// }

// ////////////////////////////

// const Leaderboard: React.FC = () => {
// 	//const [leaderboard, setLeaderboard] = useState<LeaderBoardProps[]>([])
// 	const navigate = useNavigate();
//     const data = await fetchLeaderboard();

// 	useEffectOnce(() => {
// 		userService
// 	})
// 	return (
// 		<div className='content'>
// 			<div className="header">
// 				<button className="btn btn-light" onClick={() => navigate("/")}>home</button>
// 			</div>
//             { data }
// 		</div>
// 	);
// };

export default Leaderboard;