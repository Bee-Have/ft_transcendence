import { Button, Menu } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import InviteSpectateButton from "src/components/DynamicInviteSpectateButton";
import styles from "../../../components/game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { BACKEND_URL } from '../../global/env';
import axios from "axios";

function PopUpConversation({ member, anchorEl, setAnchorEl }: any) {

	const navigate = useNavigate();

	const open = Boolean(anchorEl);
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<Menu
			id="basic-menu"
			anchorEl={anchorEl}
			open={open}
			onClose={handleClose}
			MenuListProps={{
				"aria-labelledby": "basic-button",
			}}
			anchorOrigin={{
				vertical: "bottom",
				horizontal: "center",
			}}
			transformOrigin={{
				vertical: "top",
				horizontal: "center",
			}}
		>
			<Button
				className={styles.ButtonDialogOpen}
				onClick={() => navigate("/profil")}
			>
				{/* TODO */}
				Profile
			</Button>

			<InviteSpectateButton user={
				{
					id: member.memberId,
					username: member.username,
					userstatus: null,
					photo: BACKEND_URL + '/member/image/' + member.memberId
				}} />

			<Button
				className={styles.ButtonDialogOpen}
				onClick={() => navigate("/chat")}
			>
				{/* TODO */}
				Chat
			</Button>

			<AddFriendButton member={member} handleClose={handleClose} />
			<BlockUserButton member={member} handleClose={handleClose} />

		</Menu>
	);
}

interface ButtonParamProps {
	member: any,
	handleClose: any
}

const AddFriendButton = ({ member, handleClose }: ButtonParamProps) => {

	const sendFriendRequest = () => {
		axios.get(BACKEND_URL + '/user/friend/create/' + member.userId,
			{ withCredentials: true })
			.then((res) => { })
			.catch((e) => { console.log(e.response.data) })
		handleClose()
	}

	return (
		<>
			<PopUpButton name={"Add Friend"} callback={sendFriendRequest} />
		</>
	)
}


const BlockUserButton = ({ member, handleClose }: ButtonParamProps) => {

	const blockUser = () => {
		axios.post(BACKEND_URL + '/user/friend/block/' + member.userId, {}, { withCredentials: true })
			.then((res) => {
			})
			.catch((e) => {
				console.log(e.response.data.message)
			})
		handleClose()
	}

	return (
		<PopUpButton name={"Block"} callback={blockUser} />
	)
}

const PopUpButton = ({ name, callback }: { name: string, callback: (...args: any[]) => any }) => {
	return (
		<Button
			className={styles.ButtonDialogOpen}
			onClick={callback}>
			{name}
		</Button>
	)
}

export default PopUpConversation;