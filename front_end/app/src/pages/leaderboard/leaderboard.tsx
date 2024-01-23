import { AxiosError } from "axios";
//mport { BACKEND_URL } from "../global/env";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useEffectOnce } from "src/components/useEffectOnce";
//import { Friend } from "../global/friend.dto";
import { useErrorContext } from "src/context/ErrorContext";
import userService from "src/services/user";
import { errorHandler } from "src/context/errorHandler";


// interface LeaderboardItemDTO {
// 	username: string;
// 	id: string;
// 	score: number;
// 	//avatar ?
// }

interface LeaderboardProps {
	username: string;
	id: number;
	score: number;
	//avatar ?
}

function UserCard({ user }: { user: LeaderboardProps }) {
	const navigate = useNavigate()

	return (
		<div>
			<button className="btn btn-light" onClick={() => navigate(`/profil/${user.id}`)}>
				{user.username}
			</button>
			{user.score}<br />
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
				console.log("error->", error)
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



export default Leaderboard;