import	React from 'react';
import	ChannelList from './channelList';
import	PrivateMessage from './privateMessage';
import	TextArea from './textArea';

const Chat: React.FC = () => {
  return (
    <div className="chat">
      <ChannelList/>
			<PrivateMessage/>
			<TextArea/>
    </div>
  );
};

export default Chat;