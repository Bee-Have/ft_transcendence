import React from "react";
// import { useNavigate } from "react-router-dom";
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import Conversations from "../../components/Conversation";
// import ChannelList from "src/components/channelList";

const Chat: React.FC = () => {
//   const navigate = useNavigate();

  return (
    <div className="chat">
      <Conversations />
    </div>
  );
};

export default Chat;
