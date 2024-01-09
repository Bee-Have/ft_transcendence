import React from "react";

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
// import CardActions from '@mui/material/CardActions';

import CircularProgress from '@mui/material/CircularProgress';

import UnknownUser from '@mui/icons-material/Help';
import CloseIcon from '@mui/icons-material/Close';

import styles from './GamePopup.module.css' 

function MatchmakingPopup() {
	return (
		<Card className={styles.CardPopup}>
			<CardContent>
			<div className={styles.InteractiveContent}>
				<CircularProgress className={styles.CircularProgress} />
				<CloseIcon className={styles.CancelButton} />
				<UnknownUser className={styles.UserIcon}/>
			</ div>
			<div className={styles.GameMode}>
				Game Mode
			</ div>
			</CardContent>
		</Card>
	)
}

export default MatchmakingPopup;
