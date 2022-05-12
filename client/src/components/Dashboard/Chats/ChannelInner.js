import React, { useState } from "react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import InfoIcon from "@mui/icons-material/Info";
import { Box, Typography } from "@mui/material";

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }

    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </Box>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    const additionalMembers = members.length - 3;

    if (channel.type === "messaging") {
      return (
        <Box>
          {members.map(({ user }, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", mr: "8px" }}
            >
              <Avatar
                image={user.image}
                name={user?.name || user?.email}
                size={32}
              />
              <Typography sx={{ color: "0b0c10", fontSize: 15 }}>
                {user?.name || user?.email}
              </Typography>
            </Box>
          ))}

          {additionalMembers > 0 && (
            <Typography sx={{ color: "0b0c10", fontSize: 12 }}>
              and {additionalMembers} more
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "#2c2c30",
            mr: "8px",
          }}
        >
          # {channel.data.name}
        </Typography>

        <Box style={{ display: "flex" }} onClick={() => setIsEditing(true)}>
          <InfoIcon sx={{ color: "#45a29e", cursor: "pointer" }} />
        </Box>
      </Box>
    );
  };

  const getWatcherText = (watchers) => {
    if (!watchers) return "No users online";
    if (watchers === 1) return "1 user online";
    return `${watchers} users online`;
  };

  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <MessagingHeader />
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        <Typography sx={{ fontSize: "14px", color: "#858688" }}>
          {getWatcherText(watcher_count)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChannelInner;
