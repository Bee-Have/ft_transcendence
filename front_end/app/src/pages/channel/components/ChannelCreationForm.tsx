import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';
import { BACKEND_URL } from 'src/pages/global/env';
import { useErrorContext } from 'src/context/ErrorContext';
import { errorHandler } from 'src/context/errorHandler';


const ChannelCreationForm = ({ onUpdate }: any) => {
	const [name, setName] = useState('');
	const [mode, setMode] = useState('PUBLIC');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	const [errorMessage, setErrorMessage] = useState<null | string>(null)
	const errorContext = useErrorContext();

	const [isLength, setIsLength] = useState(false)
	const [isMaj, setIsMaj] = useState(false)
	const [isMin, setIsMin] = useState(false)
	const [isNum, setIsNum] = useState(false)
	const [isMatch, setIsMatch] = useState(false)

	const navigate = useNavigate()

	const handleNameChange = (e: any) => {
		setName(e.target.value);
	};

	const handleModeChange = (e: any) => {
		setErrorMessage(null)
		setMode(e.target.value);
	};

	const handlePasswordChange = (e: any) => {
		setPassword(e.target.value);
	};

	const handlePasswordConfirmChange = (e: any) => {
		setPasswordConfirm(e.target.value);
	};

	useEffect(() => {
		setIsMatch(password === passwordConfirm)
		setIsMaj(!(password.search(/[A-Z]/) === -1))
		setIsMin(!(password.search(/[a-z]/) === -1))
		setIsNum(!(password.search(/[0-9]/) === -1))
		setIsLength(!(password.length < 8))
	}, [password, passwordConfirm])

	const handleSubmit = (e: any) => {
		e.preventDefault()
		setErrorMessage(null)
		if (mode === "PROTECTED" &&
			(!isMaj || !isMin || !isNum || !isLength || !isMatch)) {
			setErrorMessage('Password does not respect policy')
			return
		}

		if (name.length < 3) {
			setErrorMessage('Name length must be more than 2')
			return
		}
		axios.post(BACKEND_URL + '/channel',
			{ name, password, passwordConfirm, mode },
			{ withCredentials: true })
			.then((res: any) => {
				onUpdate();
				navigate("/chat/channel/" + res.data.channelId)
			})
			.catch((e) => {
				setErrorMessage(e.response.data.message);
				errorContext.newError?.(errorHandler(e))
			})
	}

	return (
		<div className='channel-form'>
			<form onSubmit={handleSubmit} id="formchannelcreation" >
				<div>
					<label>
						Name:
						<input name='jbfw' type="text" value={name} onChange={handleNameChange} />
					</label>
					<label>
						Mode:
						<select name="mode" id="mode-select" value={mode} onChange={handleModeChange}>
							<option value="PUBLIC">PUBLIC</option>
							<option value="PROTECTED">PROTECTED</option>
							<option value="PRIVATE">PRIVATE</option>
						</select>
					</label>
					{mode === 'PROTECTED' && (
						<div>
							<label>
								Password:
								<input name='jefsdbfw' type="password" value={password} onChange={handlePasswordChange} />
								<span className={isMaj ? "green" : "red"}>{"[ 1: A-Z ]"}</span>
								<span className={isMin ? "green" : "red"}>{"[ 1: a-z ]"}</span>
								<span className={isNum ? "green" : "red"}>{"[ 1: 0-9 ]"}</span>
								<span className={isLength ? "green" : "red"}>  Length {">"} 7</span>
							</label>

							<label>
								Confirm password:
								<input
									name='jbeffw'
									type="password"
									value={passwordConfirm}
									onChange={handlePasswordConfirmChange}
								/>
								<span className={isMatch ? "green" : "red"}>Passwords Match</span>

							</label>
						</div>
					)}
					{/* <label>
						Badge:
						<input type="file" onChange={handleFileChange} />
					</label> */}
					<button type="submit" className='channel-form-button'>Create</button><br></br>
					{errorMessage && <><span>{errorMessage}</span><br /></>}
				</div>
			</form>
		</div>
	);
};

export default ChannelCreationForm;