import { AxiosError } from "axios";
//mport { BACKEND_URL } from "../global/env";
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
}
interface Lead {
	place: string;
	user : Friend;
	//username: string;
	//id: number;
	score: number;
}

//  function UserCard({ user }: { user: LeaderboardProps }) {
//  	const navigate = useNavigate()

// 	return (
// 		// <div>
// 		// 	<button className="btn btn-light" onClick={() => navigate(`/profil/${user.id}`)}>
// 		// 		{user.username}
// 		// 	</button>
// 		// 	{user.score}<br />
// 		// </div>
// 		<div>

//         <p>
// 			<button className="btn btn-light" onClick={() => navigate(`/profil/${user.id}`)}> 
// 			{user.username}
// 			</button>
// 			 : {user.score} <br />
// 			 </p>
//         <hr />
//       </div>
// 	)
//  }
const UserCard: React.FC<Lead> = ({ place, user, score }) => {
	//const navigate = useNavigate()
	let rank = parseInt(place) +1 
	return (
		<div>
		<Box
			sx = {{
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				gap: "10px"
			}}
		>
			{rank} : 
			<InteractiveAvatar user={user} usage={"stranger"} />
        	<InteractiveUsername user={user} usage={"stranger"} />
			score : {score}
			</Box>
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
				<div className="lead" style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "flex-start",
					gap: "10px"
				}}>
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
		</div>
	);
}



export default Leaderboard;