import React, {useCallback, useEffect, useState} from 'react';
import axios from 'axios';

import Input from '@mui/material/Input';
import { BACKEND_URL } from 'src/pages/global/env';
import { useErrorContext } from 'src/context/ErrorContext';
import { errorHandler } from 'src/context/errorHandler';
import { ReadCookie } from './ReadCookie';
import { useNavigate } from 'react-router';

interface FAEnableProps {
	popUp: (value : boolean) => void;
	btn: (value : boolean) => void;
}

const TFAConnection: React.FC<FAEnableProps> = ({ popUp, btn}) => {
	const [code, setCode] = useState('')
	const [isButtonDisabled, setIsButtonDisabled] = useState(false)
	const [timer, setTimer] = useState(-1)
	const [secondsLeft, setSecondsLeft] = useState(0)
	const errorContext = useErrorContext()
	const navigate = useNavigate()


	const click= () => {
		const test = document.getElementById('test')
		if (test)
			test.blur();
		axios.get(BACKEND_URL + '/auth/tfa?code=' + code, { headers: {Authorization: `Bearer ${ReadCookie("TfaToken")}`}, withCredentials: true })
		.then((res) => {
			if (res.status === 200){
                popUp(false);
				btn(true);
				navigate("/")
            }
		})
		.catch((e) =>  {
            console.log(e.request);
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

	return (
        <div className='overlay'>
		    <div className='QRCode'>
		        <h1>Two factor authentification :</h1>
		        <Input autoFocus onChange={(e) => updateCode(e)} placeholder="ENTER CODE HERE"/><br/>
		        <button id='test' disabled={isButtonDisabled} onClick={() => click()}>Validate</button>
		        { !!secondsLeft && secondsLeft }
		    </div>
        </div>
	);
};

export default TFAConnection;