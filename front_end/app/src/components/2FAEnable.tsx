import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import Input from '@mui/material/Input';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FAEnable: React.FC<FAEnableProps> = ({ popUp, btn}) => {
	const [qrCode, setQrCode] = useState('')
	const [code, setCode] = useState('')

	const click= () => {
		console.log('http://localhost:3001/user/tfa/enable/callback?code=' + code)
		axios.get('http://localhost:3001/user/tfa/enable/callback?code=' + code, { withCredentials: true })
		.then((res) => console.log(res))
		.catch(e => console.log(e))

		//popUp(false);
		//btn(true);
	}

	const updateCode = (e: any) => {
		setCode(e.target.value)
		console.log(code)
	}

	const getQrCode = () => {
		axios.get('http://localhost:3001/user/tfa/enable', { withCredentials: true })
		.then((res: any) => {
			setQrCode(res.data);
			console.log(res.data);
		})
		.catch(e => console.log(e))
	}

	

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
	if (event.key === 'Escape')
		{}
	}, []);
	
	useEffect(() => {
		window.addEventListener('keydown', handleKeyPress);
			return () => {
		  window.removeEventListener('keydown', handleKeyPress);
		};
	  }, [handleKeyPress]);


	useEffect(() => {
		getQrCode();
	}, [])

	return (
		<div className='overlay'>
			<div className='content'>
				<div className='QRCode'>
				<h1>Two factor authentification :</h1>
				<img src={qrCode}></img>
				<Input onChange={(e) => updateCode(e)} placeholder="ENTER CODE HERE"/><br/>
				<button onClick={() => click()}>Validate</button>
				</div>
			</div>
		</div>
	);
};

export default FAEnable;