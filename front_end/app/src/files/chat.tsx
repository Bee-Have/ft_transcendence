import	React from 'react';
import	ChannelList from './channelList';
import	ChannelPeople from './ChannelPeople';
import	TextArea from './textArea';

const Chat: React.FC = () => {

  return (
    <div className="chat">
      <ChannelList/>
			<ChannelPeople/>
			<TextArea/>
    </div>
  );
};

export default Chat;