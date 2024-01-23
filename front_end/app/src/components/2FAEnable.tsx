import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import Input from '@mui/material/Input';
import { BACKEND_URL } from 'src/pages/global/env';
import { useErrorContext } from 'src/context/ErrorContext';
import { errorHandler } from 'src/context/errorHandler';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const FAEnable: React.FC<FAEnableProps> = ({ popUp, btn}) => {
	const [qrCode, setQrCode] = useState('')
	const [code, setCode] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [timer, setTimer] = useState(-1)
	const [secondsLeft, setSecondsLeft] = useState(0)
	const errorContext = useErrorContext()

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
		.catch((e) =>  {
			errorContext.newError?.(errorHandler(e));
			if (e.response?.status === 429) {
				setIsButtonDisabled(true)
				setTimer(30000)
			}
		})
	}

	useEffect(() => {
		let id: any;
		if (timer > -1)
			id = setInterval(() => {
			setIsButtonDisabled(false)
			setTimer(-2)
		}, timer)

		return () => {
			clearInterval(id)
		}

	}, [timer])

	useEffect (() => {
		let id: any
		if (timer > -1){
			setSecondsLeft(timer / 1000)
			id = setInterval(() => {
				setSecondsLeft(r => r - 1)
			}, 1000)
		}

		return () => {
			clearInterval(id)
		}
	}, [timer])

	const updateCode = (e: any) => {
		setCode(e.target.value)
	}

	const getQrCode = () => {
		axios.get(BACKEND_URL + '/user/tfa/enable', { withCredentials: true })
			.then((res: any) => {
				if (res.data) {
					setQrCode(res.data);
				} else {
					setQrCode('Qrcode not Available')
				}
			})
			.catch(e =>  errorContext.newError?.(errorHandler(e)))
	}
	

	const handleKeyPress = useCallback((event: KeyboardEvent) => {
	if (event.key === 'Escape')
		popUp(false);
	if (event.key === 'Enter'){
		event.preventDefault();
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
				<button id='test' disabled={isButtonDisabled} onClick={() => click()}>Validate</button>
				{ !!secondsLeft && secondsLeft }
				</div>
			</div>
		</div>
	);
};

export default FAEnable;