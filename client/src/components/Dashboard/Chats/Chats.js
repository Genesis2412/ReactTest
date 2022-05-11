import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "stream-chat-react/dist/css/index.css";
import "./Chats.css";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);

const Chats = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className="app__wrapper">
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
          />
        </Chat>
      </div>
    </>
  );
};

export default Chats;