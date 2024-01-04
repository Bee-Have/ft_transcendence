import React from 'react';
import '../css/profil.css';
import sendBack from './sendBack';

const Profil: React.FC = () => {

	const info_promise = sendBack("localhost:3001/user/profile/106520");
	const info = async () => await info_promise;
	console.log(info);
	

	const realName = "real Name";
	const nickName = "current Nickname";

  return (
    <div className='content'>
		<div className='profil'>
			<center>
  				<div className="PP">
  					<img src={require('../asset/default.jpg')} alt="profile picture" className="person-image"/>
  				</div>
			</center>
  			<div className='information'>
  				<div className='fs-2'>
  					{nickName}<br/><br/>
  					{realName}<br/><br/>
  					Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut similique accusantium eaque neque ipsum modi aliquid error sunt tenetur voluptatibus incidunt quae ea ratione, et impedit perferendis sapiente reprehenderit iusto!
  				</div>
  			</div>
		</div>
    </div>
  );
};

export default Profil;