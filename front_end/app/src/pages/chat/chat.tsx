import	React from 'react';
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import Conversations from '../../components/Conversation';
import ChannelList from 'src/components/channelList';

const Chat: React.FC = () => {

  return (
    <div className="chat">
    	<ChannelList/>
		<Conversations/>
			{/* <TextArea/> */}
    </div>
  );
};

export default Chat;