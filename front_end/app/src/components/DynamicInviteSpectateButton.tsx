import React from "react";
import Button from "@mui/material/Button";

import InviteGameModeDialogButton from "./game/GameModeDialog/InviteGameModeDialogButton";

function InviteSpectateButton() {
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
			<InviteGameModeDialogButton />
		);
	}
}

export default InviteSpectateButton;
