import axios from 'axios';
import React from 'react';
import { BACKEND_URL } from 'src/pages/global/env';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FADisable: React.FC<FAEnableProps> = ({popUp, btn}) => {
	const desactivate = () => {
		axios.get(BACKEND_URL + '/user/tfa/disable', { withCredentials: true })
		popUp(false); 
		btn(false);
	}

	return (
		<div className='overlay'>
			<div className='content'>
				<div className='QRCode'>
					<h1>Are you sure you want to remove 2FA?</h1>
					<br/><br/><br/><br/>
					<button onClick={() => desactivate()}>Yes</button>
					<button onClick={() => { popUp(false); btn(true)}}>No </button>
				</div>
			</div>
	</div>
	);
};

export default FADisable;