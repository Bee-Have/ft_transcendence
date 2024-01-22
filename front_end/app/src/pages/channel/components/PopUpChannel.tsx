import { Button, Menu } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router";
import InviteSpectateButton from "src/components/DynamicInviteSpectateButton";
import styles from "../../../components/game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { BACKEND_URL } from '../../global/env';
import { PopUpChannelProps } from "../types/PopUpChannelProps.types";
import { MemberProps } from "../types/MemberProps.types";
import axios from "axios";

function PopUpChannel({ member, clicker, anchorEl, setAnchorEl }: PopUpChannelProps) {

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

			<ChatButton member={member} handleClose={handleClose} navigate={navigate} />
			<AddFriendButton  member={member} clicker={clicker} handleClose={handleClose} />
			
			<SetAsAdminButton member={member} clicker={clicker} handleClose={handleClose} />
			<UnsetAdminButton member={member} clicker={clicker} handleClose={handleClose} />
			<RestrictUserButton member={member} clicker={clicker} handleClose={handleClose} />
			<BlockUserButton member={member} clicker={clicker} handleClose={handleClose} />

		</Menu>
	);
}

const AddFriendButton = ({ member, clicker, handleClose }: ButtonParamProps) => {

	const sendFriendRequest = () => {
		axios.get(BACKEND_URL + '/user/friend/create/' + member.userId,
		{withCredentials: true})
		.then((res) => {})
		.catch((e) => {console.log(e.response.data)})
		handleClose()
	}

	return (
		<>
			<PopUpButton name={"Add Friend"} callback={sendFriendRequest} />
		</>
	)
}

const ChatButton = ({ member, handleClose, navigate }: any) => {

	const chatWithUser = () => {
		axios.post(BACKEND_URL + '/privatemessage/conversations/' + member.userId, {}, { withCredentials: true })
			.then((res) => {
				navigate("/chat/" + res.data.conversation.id)
			})
			.catch((e) => {
				console.log(e.response.data.message)
			})
		handleClose()
	}

	return (
		<PopUpButton name={"Chat"} callback={chatWithUser} />
	)
}

interface ButtonParamProps {
	member: MemberProps,
	clicker: MemberProps,
	handleClose: () => void
}

interface ManageRole {
	channelId: number,
	memberId: number,
	role: "ADMIN" | "NONADMIN"

}

interface RestrictUserInterface {
	channelId: number,
	restrictedUserId: number
	restriction: Restriction
}

enum Restriction {
	KICKED = "KICKED",
	BANNED = "BANNED",
	MUTED = "MUTED"
}

const manageRole = (manageRoleObject: ManageRole) => {
	axios.post(BACKEND_URL + '/channel/manage/role',
		manageRoleObject,
		{ withCredentials: true })
		.then((res) => { console.log(res) })
		.catch((e) => console.log(e.response.data))
}

const SetAsAdminButton = ({ member, clicker, handleClose }: ButtonParamProps) => {

	const setAdmin = () => {
		manageRole({
			channelId: member.channelId,
			memberId: member.memberId,
			role: "ADMIN"
		})
		handleClose()
	}

	return (
		<div>
			{(clicker.role === "OWNER" && member.role === "NONADMIN") ?
				<PopUpButton name={'Set As Admin'} callback={setAdmin} />
				: null}
		</div>
	)
}

const UnsetAdminButton = ({ member, clicker, handleClose }: ButtonParamProps) => {

	const setMember = () => {
		manageRole({
			channelId: member.channelId,
			memberId: member.memberId,
			role: "NONADMIN"
		})
		handleClose()
	}

	return (
		<>
			{(clicker.role === "OWNER" && member.role === "ADMIN") ?
				<PopUpButton name={'Set as members'} callback={setMember} />
				: null}
		</>
	)
}

const RestrictUserButton = ({ member, clicker, handleClose }: ButtonParamProps) => {
	const restrictUser = (restriction: Restriction) => {
		const restrictedUser: RestrictUserInterface = {
			channelId: member.channelId,
			restrictedUserId: member.userId,
			restriction
		}
		axios.post(BACKEND_URL + '/channel/restrict',
			restrictedUser,
			{ withCredentials: true })
			.then((res) => { console.log(res) })
			.catch((e) => console.log(e))
		handleClose()
	}

	const mute = () => {
		restrictUser(Restriction.MUTED)
	}

	const ban = () => {
		restrictUser(Restriction.BANNED)
	}

	const kick = () => {
		restrictUser(Restriction.KICKED)
	}

	return (
		<>
			{(((clicker.role === "ADMIN" || clicker.role === "OWNER") && member.role === "NONADMIN")
				|| (clicker.role === "OWNER" && member.role === "ADMIN"))
				?
				<>
					<PopUpButton name={'Mute 5 minutes'} callback={mute} />
					<PopUpButton name={'Kick'} callback={kick} />
					<PopUpButton name={'Ban'} callback={ban} />
				</>
				: null}
		</>
	)
}

const BlockUserButton = ({ member, clicker, handleClose }: ButtonParamProps) => {

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

export default PopUpChannel;