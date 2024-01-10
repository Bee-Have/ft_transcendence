import React from "react";
import { useNavigate } from "react-router-dom";
// import	ChannelPeople from './ChannelPeople';
// import	TextArea from './textArea';
import Conversations from "../../components/Conversation";
import ChannelList from "src/components/channelList";

const Chat: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="chat">
      <div className="header">
        <button className="btn btn-light" onClick={() => navigate("/")}>
          home
        </button>
      </div>
      <ChannelList />
      <Conversations />
      {/* <TextArea/> */}
    </div>
  );
};

export default Chat;
