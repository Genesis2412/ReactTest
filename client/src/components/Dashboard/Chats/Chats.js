import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "stream-chat-react/dist/css/index.css";
import "./Chats.css";
import { Box } from "@mui/material";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);

const Chats = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flex: 1,
          height: "100%",
          boxShadow: 5,
        }}
      >
        <Chat client={client} theme="team light">
          <ChannelListContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            setCreateType={setCreateType}
            setIsEditing={setIsEditing}
          />
          <ChannelContainer
            isCreating={isCreating}
            setIsCreating={setIsCreating}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            createType={createType}
            setIsViewing={setIsViewing}
            isViewing={isViewing}
          />
        </Chat>
      </Box>
    </>
  );
};

export default Chats;
