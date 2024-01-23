import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import Input from '@mui/material/Input';
import { BACKEND_URL } from 'src/pages/global/env';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FAEnable: React.FC<FAEnableProps> = ({ popUp, btn}) => {
	const [qrCode, setQrCode] = useState('')
	const [code, setCode] = useState('')

	const click= () => {
		const test = document.getElementById('test')
		if (test)
			test.blur();
		axios.get(BACKEND_URL + '/user/tfa/enable/callback?code=' + code, { withCredentials: true })
		.then((res) => {
			if (res.status === 200){
                popUp(false);
				btn(true);
            }
		})
		.catch(e => console.log(e));
	}

	const updateCode = (e: any) => {
		setCode(e.target.value)
	}

	const getQrCode = () => {
		axios.get(BACKEND_URL + '/user/tfa/enable', { withCredentials: true })
			.then((res: any) => {
				if (res.data) {
					setQrCode(res.data);
				} else {
					console.error("QR Code data is undefined");
				}
			})
			.catch(e => console.log(e))
	}
	

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
	if (event.key === 'Escape')
		popUp(false);
	if (event.key === 'Enter'){
		event.preventDefault();
		click();
	}
	}, [popUp]);
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
			return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	  }, [handleKeyPress]);


	useEffect(() => {
		getQrCode();
	}, [popUp])

	return (
		<div className='overlay'>
			<div className='content'>
				<div className='QRCode'>
				<h1>Two factor authentification :</h1>
				<img alt="qrcode" src={qrCode}></img>
				<Input autoFocus onChange={(e) => updateCode(e)} placeholder="ENTER CODE HERE"/><br/>
				<button id='test' onClick={() => click()}>Validate</button>
				</div>
			</div>
		</div>
	);
};

export default FAEnable;