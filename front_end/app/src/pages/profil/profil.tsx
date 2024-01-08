import React, { useEffect } from 'react';
import Menu from '../../components/menu';
import '../../css/profil.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ReadCookie, deleteCookie } from 'src/components/ReadCookie';

const Profil: React.FC = () => {

	var realName: string = "real Name";
	var nickName: string = "current Nickname";
	const navigate = useNavigate();


	axios.get(`http://localhost:3001/user/profile/${ReadCookie("userId")}`, {withCredentials: true})
	.then( function (response)
	{
		console.log(response.data);
		realName = response.data.username;
		if (response.data.nickname == null)
			nickName = response.data.username;
		else
			nickName = response.data.nickname;
		console.log("realName : " + realName)
	})
	.catch(err => {
		console.log(err);
		//throw err;
	});

	useEffect(() => {
		console.log("realName = " + realName)
	}, [realName, nickName])

	return (
		<div className='content'>
			<div className="header">
                <button className="btn btn-light">invit to game</button>
                <button className="btn btn-light">add friend</button>
                <button className="btn btn-light" onClick={() => navigate("/profil/edit-Profil")}>edit profil</button>
                <button className="btn btn-light" onClick={() => {
					axios.post("http://localhost:3001/auth/logout", {}, {headers: {Authorization: `Bearer ${ReadCookie("access_token")}`}, withCredentials: true}).then( () =>
					{
						deleteCookie("access_token");
						deleteCookie("refresh_token");
						deleteCookie("TfaEnable");
						deleteCookie("userId");
						navigate("/")
					})
				}}>Logout</button>
                <button className="btn btn-light" onClick={() => navigate("/")}>home</button>
            </div>
			<Menu/>
			<div className='profil'>
				<center>
					<div className="PP">
						<img src={require('../../asset/default.jpg')} alt="test" className="person-image" />
					</div>
				</center>
				<div className='information'>
					<div className='fs-2'>
						{nickName}<br /><br />
						{realName}<br /><br />
						En mathématiques, on définit une notion à partir de notions antérieurement définies.<br />
						Les notions de bases étant les symboles non logiques du langage considéré, dont l'usage est défini par les axiomes de la théorie.<br />
						Se pose la question de la différence entre une définition et un axiome.<br />
						Pour exemple, dans l'arithmétique de Peano, l'addition et la multiplication sont des symboles du langage et leur fonctionnement est régi par des axiomes.<br />
						Mais on pourrait tout à fait réduire le langage de l arithmétique en supprimant les symboles « + » et « * » et les définir à partir de 0 et de la fonction successeur d'une manière similaire.<br />
						Cela nous donnerait une autre théorie arithmétique, mais essentiellement équivalente sur toutes ses propriétés élémentaires.
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profil;