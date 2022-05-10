import React, { useState, useEffect } from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "stream-chat-react/dist/css/index.css";
import "./Chats.css";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);
const cookies = new Cookies();

const Chats = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      client.connectUser(
        {
          id: cookies.get("token"),
          id: cookies.get("userId"),
          // firstName: data?.firstName,
          // lastName: data?.lastName,
          // email: data?.email,
        },
        cookies.get("token")
      );
    };

    return () => {
      getUsers();
    };
  }, []);

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
