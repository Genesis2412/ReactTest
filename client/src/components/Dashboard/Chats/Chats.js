import React from "react";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import Cookies from "universal-cookie";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "./Chats.css";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);

const Chats = () => {
  return (
    <>
      <div className="app__wrapper">
        <Chat client={client} theme="team light">
          <ChannelListContainer />
          <ChannelContainer />
        </Chat>
      </div>
    </>
  );
};

export default Chats;
