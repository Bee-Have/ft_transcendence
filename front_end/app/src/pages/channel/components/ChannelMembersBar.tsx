import { Avatar, Box, List, ListItem, ListSubheader } from "@mui/material";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { BACKEND_URL } from "src/pages/global/env";
import { userId } from "src/pages/global/userId";
import { MemberProps } from "../types/MemberProps.types";
import ChannelSettingPanel from "./ChannelSettingPannel";
import InteractiveAvatarChannel from "./InteractiveAvatarChannel";
import InteractiveUsernameChannel from "./InteractiveUsernameChannel";
import { errorHandler } from "src/context/errorHandler";
import { useErrorContext } from "src/context/ErrorContext";
import { useSessionContext } from "src/context/SessionContext";

const MemberList = ({
  headerName,
  members,
  clicker,
}: {
  headerName: string;
  members: MemberProps[];
  clicker: MemberProps;
}) => {
  return (
    <>
      <ListSubheader>{headerName}</ListSubheader>
      {members.map((member) => (
        <ListItem key={member.userId}>
          {member.userId === userId ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar
                src={BACKEND_URL + "/user/image/" + member.userId}
                alt={member.username}
                sx={{ width: 60, height: 60 }}
              />
              <div className="private-message-name">{member.username}</div>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <InteractiveAvatarChannel member={member} clicker={clicker} />
              <InteractiveUsernameChannel member={member} clicker={clicker} />
            </Box>
          )}
        </ListItem>
      ))}
    </>
  );
};

const ChannelMembersBar = ({
  channelMembers,
  channelId,
}: {
  channelMembers: MemberProps[];
  channelId: number;
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [owner, setOwner] = useState<MemberProps[]>([]);
  const [admins, setAdmins] = useState<MemberProps[]>([]);
  const [members, setMembers] = useState<MemberProps[]>([]);
  const [clicker, setClicker] = useState<MemberProps>();
  const [leaveMessage, setLeaveMessage] = useState("Leave");
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const errorContext = useErrorContext();
  const session = useSessionContext();

  useEffect(() => {
    let own = [];
    const adms = [];
    const membs = [];
    for (const member of channelMembers) {
      if (member.role === "OWNER") own.push(member);
      else if (member.role === "ADMIN") adms.push(member);
      else membs.push(member);
    }
    setOwner(own);
    setAdmins(adms);
    setMembers(membs);
    setClicker(
      channelMembers.filter((member) => {
        return member.userId === userId;
      })[0]
    );
  }, [channelMembers]);

  useEffect(() => {
    const listenNewMember = (info: MemberProps) => {
      if (info.channelId === channelId)
        setMembers((prev: MemberProps[]) => [...prev, info]);
    };

    const listenLeaveMember = (info: MemberProps) => {
      if (info.channelId === channelId) {
        if (info.role === "OWNER") {
          navigate("/404");
        } else if (info.role === "ADMIN")
          setAdmins((prev: MemberProps[]) =>
            prev.filter((member) => {
              return member.userId !== info.userId;
            })
          );
        else
          setMembers((prev: MemberProps[]) =>
            prev.filter((member) => {
              return member.userId !== info.userId;
            })
          );

        if (info.userId === userId) navigate("/chat");
      }
    };

    const listenRole = (info: MemberProps) => {
      if (info.userId === userId) setClicker(info);
      if (info.role === "ADMIN") {
        setMembers((prev: MemberProps[]) =>
          prev.filter((member) => {
            return member.userId !== info.userId;
          })
        );
        setAdmins((prev: MemberProps[]) => [...prev, info]);
      }
      if (info.role === "NONADMIN") {
        setAdmins((prev: MemberProps[]) =>
          prev.filter((member) => {
            return member.userId !== info.userId;
          })
        );
        setMembers((prev: MemberProps[]) => [...prev, info]);
      }
    };

    session.socket?.on("new-channel-member", listenNewMember);
    session.socket?.on("leave-channel-member", listenLeaveMember);
    session.socket?.on("channel-role", listenRole);

    return () => {
      session.socket?.off("new-channel-member", listenNewMember);
      session.socket?.off("leave-channel-member", listenLeaveMember);
      session.socket?.off("channel-role", listenRole);
    };
  }, [session.socket, channelId, navigate]);

  const displayOverlay = () => {
    setShowOverlay(true);
  };
  const hideOverlay = () => {
    setShowOverlay(false);
  };

  const yesClick = () => {
    setShowButton(false);
    if (leaveMessage === "Do you hold your breath ?")
      setLeaveMessage("Your lying start over");
    if (leaveMessage === "leave for real ;( ;( ;(")
      setLeaveMessage("Wrong Answer Restart pls");
    if (leaveMessage === "Just Kidding, Leave for Real ?")
      axios
        .get(BACKEND_URL + "/channel/leave/" + channelId, {
          withCredentials: true,
        })
        .then(() => {
          navigate("/chat");
        })
        .catch((e: Error | AxiosError) =>
          errorContext.newError?.(errorHandler(e))
        );
    if (leaveMessage === "Press Escape")
      setLeaveMessage("Hold your breath from now");
    if (leaveMessage === "Are you sure you want to quit ?") {
      setLeaveMessage("Really Sure ?");
      setShowButton(true);
    }
    if (leaveMessage === "Really Sure ?") {
      setLeaveMessage("Sure Sure SURE ?");
      setShowButton(true);
    }
    if (leaveMessage === "Sure Sure SURE ?") {
      setLeaveMessage("Press Escape");
      setShowButton(true);
    }
  };
  const noClick = () => {
    setShowButton(false);
    if (leaveMessage === "Do you hold your breath ?")
      setLeaveMessage("Ultimate click (We'll miss you)");
    if (leaveMessage === "leave for real ;( ;( ;(")
      setLeaveMessage("Thank you so much");
    if (leaveMessage === "Press Escape")
      setLeaveMessage("Hold your breath from now");
    if (leaveMessage === "Are you sure you want to quit ?")
      setLeaveMessage("Thank you so much");
    if (leaveMessage === "Really Sure ?") setLeaveMessage("Thank you so much");
    if (leaveMessage === "Sure Sure SURE ?")
      setLeaveMessage("Thank you so much");
    if (leaveMessage === "Just Kidding, Leave for Real ?")
      setLeaveMessage("Thank you so much");
  };

  const leave = () => {
    if (leaveMessage === "Leave") setLeaveMessage("Hold your breath from now");
    if (leaveMessage === "Hold your breath from now")
      setLeaveMessage("Why you want to quit");

    if (leaveMessage === "Why you want to quit") {
      setLeaveMessage("Are you sure you want to quit ?");
      setShowButton(true);
    }
    if (leaveMessage === "Press Escape") {
      setShowButton(false);
      setLeaveMessage("Hold your breath from now");
    }
    if (leaveMessage === "You can leave") {
      setShowButton(false);
      setLeaveMessage("Or Not");
    }
    if (leaveMessage === "Or Not") setLeaveMessage("Give me one more click");
    if (leaveMessage === "Give me one more click") {
      setLeaveMessage("Do you hold your breath ?");
      setShowButton(true);
    }
    if (leaveMessage === "Your lying start over") setLeaveMessage("Leave");
    if (leaveMessage === "Ultimate click (We'll miss you)")
      setLeaveMessage("Or not");
    if (leaveMessage === "Or not")
      setLeaveMessage("Nobody wants you here anyway");
    if (leaveMessage === "Nobody wants you here anyway")
      setLeaveMessage("Please dont leave");
    if (leaveMessage === "Please dont leave") {
      setLeaveMessage("leave for real ;( ;( ;(");
      setShowButton(true);
    }
    if (leaveMessage === "Wrong Answer Restart pls") {
      setLeaveMessage("Just Kidding, Leave for Real ?");
      setShowButton(true);
    }
    if (leaveMessage === "Thank you so much") setLeaveMessage("Leave");
  };

  useEffect(() => {
    const listener = (e: any) => {
      if (e.key === "Escape") {
        setShowButton(false);
        setLeaveMessage("You can leave");
      }
    };
    if (leaveMessage === "Press Escape")
      window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, [leaveMessage]);

  return (
    <div className="channel-member-bar">
      {showOverlay && (
        <div className="channel-overlay">
          <div className="channel-overlay-wrapper">
            <ChannelSettingPanel
              channelId={channelId}
              hideOverlay={hideOverlay}
            />
          </div>
        </div>
      )}
      <div className="channel-setting-button-wrapper">
        {owner[0]?.userId === userId && (
          <div className="channel-setting-button" onClick={displayOverlay}>
            <p>Setting +</p>
          </div>
        )}
        <div className="channel-setting-button leave" onClick={leave}>
          <p>{leaveMessage}</p>
        </div>
        {showButton && (
          <div className="channel-troll-button-wrapper">
            <button className="channel-troll-button yes" onClick={yesClick}>
              Yes
            </button>
            <button className="channel-troll-button no" onClick={noClick}>
              No
            </button>
          </div>
        )}
      </div>
      <List>
        {clicker && (
          <MemberList headerName="Owner" members={owner} clicker={clicker} />
        )}
        {admins.length !== 0 && clicker && (
          <MemberList
            headerName={admins.length > 1 ? "Admins" : "Admin"}
            members={admins}
            clicker={clicker}
          />
        )}
        {members.length !== 0 && clicker && (
          <MemberList
            headerName={members.length > 1 ? "Members" : "Member"}
            members={members}
            clicker={clicker}
          />
        )}
      </List>
    </div>
  );
};

export default ChannelMembersBar;
