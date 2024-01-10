import React from 'react';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FADisable: React.FC<FAEnableProps> = ({popUp, btn}) => {
	return (
		<div className='overlay'>
			<div className='content'>
				<div className='QRCode'>
					<h1>Are you sure you want to remove 2FA?</h1>
					<br/><br/><br/><br/>
					<button onClick={() => { popUp(false); btn(false)}}>Yes</button>
					<button onClick={() => { popUp(false); btn(true)}}>No </button>
				</div>
			</div>
	</div>
	);
};

export default FADisable;