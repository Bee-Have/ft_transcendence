import	React from 'react';
import	ChannelList from './channelList';
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import Conversations from './Conversation';

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