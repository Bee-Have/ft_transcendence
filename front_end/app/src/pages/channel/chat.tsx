import { List } from '@mui/material';
import	React from 'react';
import { useParams } from 'react-router-dom';
import ChannelTextArea from 'src/components/channel.text-area';
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import ChannelList from 'src/components/channelList';







const Channel: React.FC = () => {

	const { id } = useParams()



  return (
    <div className="chat">
    	<ChannelList/>
		<div className="channelPeople">
			<List component="nav" aria-label="mailbox folders">
				{/* ChannelMembers */}
			</List>
			<p>{id}</p>
			<ChannelTextArea currentChannelId={1} userId={2}/>
		</div>
    </div>
  );
};

export default Channel;