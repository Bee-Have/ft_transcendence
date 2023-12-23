import	React from 'react';
import	ChannelList from '../components/channelList';
import	PrivateMessage from '../components/privateMessage';
import	TextArea from '../components/textArea';

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