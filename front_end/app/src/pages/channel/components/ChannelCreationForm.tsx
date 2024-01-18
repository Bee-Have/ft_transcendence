import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router';
import { BACKEND_URL } from 'src/pages/global/env';


const ChannelCreationForm = ({ onUpdate }: any) => {
	const [name, setName] = useState('');
	const [mode, setMode] = useState('PUBLIC');
	const [password, setPassword] = useState('');
	const [passwordConfirm, setPasswordConfirm] = useState('');
	// const [file, setFile] = useState(null)
	const [errorMessage, setErrorMessage] = useState<null | string>(null)

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

	// const handleFileChange = (e: any) => {
	// 	setFile(e.target.files[0])
	// }

	const handleSubmit = (e: any) => {
		e.preventDefault()
		setErrorMessage(null)

		axios.post(BACKEND_URL + '/channel',
			{ name, password, passwordConfirm, mode },
			{ withCredentials: true })
			.then((res: any) => {
				onUpdate();
				navigate("/chat/channel/" + res.data.channelId)
				// if (file)
				// 	axios.postForm(BACKEND_URL + '/channel/upload/badge/' + res.data.channelId,
				// 		{ 'badge': file },
				// 		{ withCredentials: true })
				// 		.then(() => setbadgeUpload('badge upload success'))
				// 		.catch((e) => setErrorMessage(e.response.data.message))
			})
			.catch((e) => setErrorMessage(e.response.data.message))
	}

	return (
		<div className='channel-form'>
			<form onSubmit={handleSubmit} >
				<div>
					<label>
						Name:
						<input type="text" value={name} onChange={handleNameChange} />
					</label>
					<label>
						Mode:
						<select value={mode} onChange={handleModeChange}>
							<option value="PUBLIC">PUBLIC</option>
							<option value="PROTECTED">PROTECTED</option>
							<option value="PRIVATE">PRIVATE</option>
						</select>
					</label>
					{mode === 'PROTECTED' && (
						<div>
							<label>
								Password:
								<input type="password" value={password} onChange={handlePasswordChange} />
							</label>

							<label>
								Confirm password:
								<input
									type="password"
									value={passwordConfirm}
									onChange={handlePasswordConfirmChange}
								/>
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