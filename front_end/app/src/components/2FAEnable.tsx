import React, {useCallback, useEffect} from 'react';
import QRCode from 'qrcode.react';

import Input from '@mui/material/Input';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FAEnable: React.FC<FAEnableProps> = ({ popUp, btn}) => {
	const handleKeyPress = useCallback((event: KeyboardEvent) => {
	if (event.key === 'Escape')
	popUp(false);
	}, []);
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
			return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	  }, [handleKeyPress]);

	return (
		<div className='overlay'>
			<div className='content'>
				<div className='QRCode'>
				<h1>Two factor authentification :</h1>
				<QRCode value="https://www.google.com"/><br/>
				<Input placeholder="ENTER CODE HERE"/><br/>
				<button onClick={() => {popUp(false); btn(true)}}>Validate</button>
				</div>
			</div>
		</div>
	);
};

export default FAEnable;