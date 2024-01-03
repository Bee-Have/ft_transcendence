import React, {useState} from 'react';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';


interface CardProps {
	photo: string;
	name: string;
	onClick: () => void;
}

const Friend: React.FC<CardProps> = ({ photo, name, onClick }) => {
  const handleClick = () => {
    onClick();
  };

  return (
    <div className="friend" onClick={handleClick}>
      <Stack direction="row" spacing={5}>
        <Avatar className='avatar' alt={name} src={require("../asset/default.jpg")} />
        <div className='name'>
          {name}
        </div>
      </Stack>
    </div>
  );
};

const PrivateMessage: React.FC = () => {
  const [currentName, setCurrentName] = useState<string>('1st name');
	const [currentPicture, setCurrentPicture] = useState<string>('picture');

  const changeMp = (name: string, picture: string) => {
    setCurrentName(name);
		setCurrentPicture(picture);
  };

	return (
		<div className="channelPeople">
		  <PopupState variant="popover">
    	  {(popupState) => (
    	    <React.Fragment>
						<div className='privMsg'>
    	      	<Button variant="text" {...bindTrigger(popupState)} className='privMsg'>
								Private message +
    	      	</Button>
						</div>
            <Menu {...bindMenu(popupState)} PaperProps={{ style:{ backgroundColor: 'rgba(0, 0, 0, 0.60)', maxHeight: '400px', width:'18.5%'}}}>
							<div className='popup'>
								<MenuItem onClick={popupState.close} style={{color:'white'}}>
									<Friend photo={'./asset/default.jpg'} name={"test1"} onClick={() => changeMp("friend 1", "newPicture")}/>
								</MenuItem>
								<MenuItem onClick={popupState.close} style={{color:'white'}}>
									<Friend photo={'./asset/default.jpg'} name={"test1"} onClick={() => changeMp("friend 1", "newPicture")}/>
								</MenuItem>
								<MenuItem onClick={popupState.close} style={{color:'white'}}>
									<Friend photo={'./asset/default.jpg'} name={"test1"} onClick={() => changeMp("friend 1", "newPicture")}/>
								</MenuItem>
							</div>
    	      </Menu>
    	    </React.Fragment>
    	  )}
    	</PopupState>
			<List component="nav" aria-label="mailbox folders">
				<Friend photo={'./asset/default.jpg'} name={"friend 1"} onClick={() => changeMp("friend 1", "newPicture")}/>
				<Friend photo={'./asset/default.jpg'} name={"friend 2"} onClick={() => changeMp("friend 2", "newPicture")}/>
				<Friend photo={'./asset/default.jpg'} name={"friend 3"} onClick={() => changeMp("friend 3", "newPicture")}/>
				<Friend photo={'./asset/default.jpg'} name={"friend 4"} onClick={() => changeMp("friend 4", "newPicture")}/>
				<Friend photo={'./asset/default.jpg'} name={"friend 5"} onClick={() => changeMp("friend 5", "newPicture")}/>
			</List>
			<div className="title">
				<Friend photo={currentPicture} name={currentName} onClick={() => changeMp("friend 1", "newPicture")}/>
			</div>
		</div>
	);
};

export default PrivateMessage;