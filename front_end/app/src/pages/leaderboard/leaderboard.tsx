import { AxiosError } from "axios";
import { BACKEND_URL } from "../global/env";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useEffectOnce } from "src/components/useEffectOnce";
//import { Friend } from "../global/friend.dto";
import { useErrorContext } from "src/context/ErrorContext";
import userService from "src/services/user";
import { errorHandler } from "src/context/errorHandler";
import { Friend } from "../global/friend.dto";
import { Box } from "@mui/material";
import InteractiveAvatar from "src/components/interactive/InteractiveAvatar";
import InteractiveUsername from "src/components/interactive/InteractiveUsername";
import "../../css/leaderboard.css"

interface LeaderboardProps {
	username: string;
	id: number;
	score: number;
}

interface Lead {
	place: string;
	user: Friend;
	//username: string;
	//id: number;
	score: number;
}

const UserCard: React.FC<Lead> = ({ place, user, score }) => {
	let rank = parseInt(place) + 1
	const t = {...user, photo: BACKEND_URL + '/user/image/' + user.id}

	return (
			<Box className='user-box'>
				<div className='user-box-rank'>
					{rank}
				</div>
				<div className="user-info-leaderboard">
					<InteractiveAvatar user={t} usage={"stranger"} />
					<InteractiveUsername user={user} usage={"stranger"} />
				</div>
				<div className='user-box-score'>
					score : {score}
				</div>
			</Box>
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
			<div className="user-box-wrapper">
				{Object.keys(users).map((i) => (
					<UserCard
						key={i}
						place={i}
						user={users[i]}
						score={users[i].score}
					/>
				))}
			</div>
		</div>
	);
}

export default Leaderboard;