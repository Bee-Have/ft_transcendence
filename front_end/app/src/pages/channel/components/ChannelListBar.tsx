import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useErrorContext } from "src/context/ErrorContext";
import { errorHandler } from "src/context/errorHandler";
import { BACKEND_URL } from "src/pages/global/env";
import { userId } from "src/pages/global/userId";
import { useSessionContext } from "src/context/SessionContext";

const ChannelIcon = ({
  channel,
  selectedId,
}: {
  channel: ChannelProps;
  selectedId: number;
}) => {
  const [imageKey, setImageKey] = useState(0);
  const [name, setName] = useState(channel.name);
  const navigate = useNavigate();
  const session = useSessionContext();

  useEffect(() => {
    const listenNewBadge = (info: { channelId: number }) => {
      if (channel.id === info.channelId) setImageKey((prev) => prev + 1);
    };

    const listenNewInfo = (info: {
      channelName: string;
      mode: string;
      channelId: number;
    }) => {
      if (channel.id === info.channelId) setName(info.channelName);
    };

    session.socket?.on("new-channel-badge", listenNewBadge);
    session.socket?.on("new-channel-info", listenNewInfo);

    return () => {
      session.socket?.off("new-channel-badge", listenNewBadge);
      session.socket?.off("new-channel-info", listenNewInfo);
    };
  }, [channel.id, session.socket]);

  useEffect(() => {
    setName(channel.name);
  }, [channel]);

  return (
    <li
      className="channel-bar-button"
      onClick={() => {
        navigate("/chat/channel/" + channel.id);
      }}
    >
      <img
        src={BACKEND_URL + "/channel/badge/" + channel.id + `?${imageKey}`}
        alt={name}
        className={
          selectedId === channel.id ? "channel-badge selected" : "channel-badge"
        }
      />
      <div className="channel-show-name">{name}</div>
    </li>
  );
};

const HomeButton = ({ navigate }: any) => {
  return (
    <li
      className="channel-bar-button"
      onClick={() => {
        navigate("/chat");
      }}
    >
      <img
        src={BACKEND_URL + "/user/image/" + userId}
        alt={userId + " image"}
        className="channel-badge"
      />
      <div className="channel-show-name">Chat</div>
    </li>
  );
};

interface ChannelProps {
  name: string;
  mode: "PUBLIC" | "PRIVATE" | "PROTECTED";
  id: number;
  role: "NONADMIN" | "OWNER" | "ADMIN";
  ownerId: number;
}

const ChannelListBar = ({ update }: { update: boolean }) => {
  const [channels, setChannels] = useState<ChannelProps[]>([]);
  const [selectedChannelId, setSelectedChannelId] = useState<number>(-1);

  const errorContext = useErrorContext();
  const navigate = useNavigate();
  const location = useLocation();
  const session = useSessionContext();

  useEffect(() => {
    axios
      .get(BACKEND_URL + "/channel", { withCredentials: true })
      .then((res: any) => {
        setChannels(res.data);
      })
      .catch((e) => errorContext.newError?.(errorHandler(e)));
  }, [update]);

  useEffect(() => {
    const id = window.location.pathname.split("/");
    const i = Number(id[3]);

    if (!isNaN(i)) setSelectedChannelId(i);
    else setSelectedChannelId(-1);
  }, [location.pathname]);

  useEffect(() => {
    const listenLeaveMember = (info: any) => {
      if (info.userId === userId || info.role === "OWNER")
        setChannels((prev) =>
          prev.filter((channel) => {
            return channel.id !== info.channelId;
          })
        );
    };

    session.socket?.on("leave-channel-member", listenLeaveMember);

    return () => {
      session.socket?.off("leave-channel-member", listenLeaveMember);
    };
  }, [session.socket]);

  return (
    <nav className="channel-list-bar">
      <div className="channel-list-bar-ul">
        <HomeButton navigate={navigate} />
        <div className="separator"></div>
        {Object.keys(channels).map((index) => (
          <ChannelIcon
            key={index}
            channel={channels[index]}
            selectedId={selectedChannelId}
          />
        ))}
        <li
          className="channel-bar-button"
          onClick={() => {
            navigate("/chat/channel");
          }}
        >
          <AddCircleOutlineIcon className="channel-badge channel-add-cross" />
          <div className="channel-show-name">Create/Add</div>
        </li>
      </div>
    </nav>
  );
};

export default ChannelListBar;
