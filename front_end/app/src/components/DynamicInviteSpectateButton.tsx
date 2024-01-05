import React from "react";
import Button from "@mui/material/Button";

import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";

interface InviteSpectateButtonProps {
	username: string;
	// image user icon
}

function InviteSpectateButton({ username /*TODO:, user icon here */ }: InviteSpectateButtonProps) {
	// this is will be the querried value
	const [isPlaying, setStatus] = React.useState(false);

	{/* do user status querry here */ }
	React.useEffect(() => {
		setStatus(false);
	}, []);

	if (isPlaying === true) {
		return (
			<Button>
				spectate
			</Button>
		);
	}
	else {
		return (
			<InviteGameModeDialogButton username={username} /*TODO: user icon here *//>
		);
	}
}

export default InviteSpectateButton;
