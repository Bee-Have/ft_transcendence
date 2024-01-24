import { Button, Menu } from "@mui/material";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router";
import InviteGameModeDialogButton from "src/components/game/GameModeDialog/InviteGameModeDialogButton";
import styles from "../../../components/game/GameModeDialog/InviteGameModeDialogButton.module.css";
import { BACKEND_URL } from '../../global/env';
import { MemberProps } from "../types/MemberProps.types";
import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";

function PopUpChannel({
	member,
	clicker,
	anchorEl,
	setAnchorEl,
	memberIsBlocked,
	setMemberIsBlocked,
	memberIsFriend,
	setMemberIsFriend }: any) {

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

			<ProfilButton member={member} handleClose={handleClose} navigate={navigate} />
			<ChatButton member={member} handleClose={handleClose} navigate={navigate} />
			<AddFriendButton
				member={member}
				clicker={clicker}
				handleClose={handleClose}
				memberIsFriend={memberIsFriend}
				setMemberIsFriend={setMemberIsFriend} />
			<BlockUserButton
				member={member}
				clicker={clicker}
				handleClose={handleClose}
				memberIsBlocked={memberIsBlocked}
				setMemberIsBlocked={setMemberIsBlocked} />
			<InviteGameModeDialogButton user={
				{
					id: member.userId,
					username: member.username,
					userstatus: null,
					photo: BACKEND_URL + '/user/image/' + member.userId,
				}} />

			<SetAsAdminButton member={member} clicker={clicker} handleClose={handleClose} />
			<UnsetAdminButton member={member} clicker={clicker} handleClose={handleClose} />
			<RestrictUserButton member={member} clicker={clicker} handleClose={handleClose} />

		</Menu>
	);
}

const ProfilButton = ({ member, handleClose, navigate }: any) => {

	return (
		<PopUpButton name={"Profil"} callback={() => navigate("/profil/" + member.userId)} />
	)
}


const AddFriendButton = ({ member, clicker, handleClose, memberIsFriend, setMemberIsFriend }: any) => {

	const errorContext = useErrorContext();

	const sendFriendRequest = () => {
		axios.get(BACKEND_URL + '/user/friend/create/' + member.userId,
			{ withCredentials: true })
			.then((res) => { setMemberIsFriend(true) })
			.catch((e) => { errorContext.newError?.(errorHandler(e)); setMemberIsFriend(true) })
		handleClose()
	}

	return (
		<>
			{
				!memberIsFriend && <PopUpButton name={"Add Friend"} callback={sendFriendRequest} />
			}
		</>
	)
}

const ChatButton = ({ member, handleClose, navigate }: any) => {

	const errorContext = useErrorContext();

	const chatWithUser = () => {
		axios.post(BACKEND_URL + '/privatemessage/conversations/' + member.userId, {}, { withCredentials: true })
			.then((res) => {
				navigate("/chat/" + res.data.conversation.id)
			})
			.catch((e) => {
				errorContext.newError?.(errorHandler(e))
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

const manageRole = (manageRoleObject: ManageRole, errorContext: any) => {


	axios.post(BACKEND_URL + '/channel/manage/role',
		manageRoleObject,
		{ withCredentials: true })
		.then((res) => {})
		.catch((e) => errorContext.newError?.(errorHandler(e)))
}

const SetAsAdminButton = ({ member, clicker, handleClose }: ButtonParamProps) => {

	const errorContext = useErrorContext();

	const setAdmin = () => {
		manageRole({
			channelId: member.channelId,
			memberId: member.memberId,
			role: "ADMIN"
		}, errorContext)
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

	const errorContext = useErrorContext();

	const setMember = () => {
		manageRole({
			channelId: member.channelId,
			memberId: member.memberId,
			role: "NONADMIN"
		}, errorContext)
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

	const errorContext = useErrorContext();

	const restrictUser = (restriction: Restriction) => {
		const restrictedUser: RestrictUserInterface = {
			channelId: member.channelId,
			restrictedUserId: member.userId,
			restriction
		}


		axios.post(BACKEND_URL + '/channel/restrict',
			restrictedUser,
			{ withCredentials: true })
			.then((res) => {})
			.catch((e) => errorContext.newError?.(errorHandler(e)))
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

const BlockUserButton = ({ member, clicker, handleClose, memberIsBlocked, setMemberIsBlocked }: any) => {

	const errorContext = useErrorContext();

	const blockUser = () => {

		const Url = BACKEND_URL + '/user/friend/' + (memberIsBlocked ? "unblock/" : "block/") + member.userId

		axios.post(Url, {}, { withCredentials: true })
			.then((res) => {
				setMemberIsBlocked(!memberIsBlocked)
			})
			.catch((e) => {
				errorContext.newError?.(errorHandler(e))
			})
		handleClose()
	}

	return (
		<>
			<PopUpButton name={memberIsBlocked ? "Unblock" : "Block"} callback={blockUser} />
		</>
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