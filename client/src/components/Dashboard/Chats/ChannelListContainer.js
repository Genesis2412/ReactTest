import React, { useState } from "react";
import { ChannelList, useChatContext } from "stream-chat-react";
import {
  ChannelSearch,
  TeamChannelList,
  TeamChannelPreview,
} from "./exportsFiles";
import { Logo } from "../../GlobalStyles";
import Box from "@mui/material/Box";

const customChannelTeamFilter = (channels) => {
  return channels.filter((channel) => channel.type === "team");
};

const customChannelMessagingFilter = (channels) => {
  return channels.filter((channel) => channel.type === "messaging");
};

const CompanyHeader = () => {
  return (
    <Box sx={{ textAlign: "left", pt: 2 }}>
      <Logo to="/dashboard/classes" style={{ color: "#fff", fontSize: 25 }}>
        MauTutorz
      </Logo>
    </Box>
  );
};

const ChannelListContent = ({
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setIsViewing,
  setToggleContainer,
}) => {
  const { client } = useChatContext();

  const filters = { members: { $in: [client.userID] } };
  return (
    <>
      <div
        className="channel-list__list__wrapper"
        style={{ background: "#63666A" }}
      >
        <CompanyHeader />
        <ChannelSearch setToggleContainer={setToggleContainer} />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelTeamFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="team"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setIsViewing={setIsViewing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setIsViewing={setIsViewing}
              setToggleContainer={setToggleContainer}
              type="team"
            />
          )}
        />
        <ChannelList
          filters={filters}
          channelRenderFilterFn={customChannelMessagingFilter}
          List={(listProps) => (
            <TeamChannelList
              {...listProps}
              type="messaging"
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setIsViewing={setIsViewing}
              setToggleContainer={setToggleContainer}
            />
          )}
          Preview={(previewProps) => (
            <TeamChannelPreview
              {...previewProps}
              setIsCreating={setIsCreating}
              setIsEditing={setIsEditing}
              setIsViewing={setIsViewing}
              setToggleContainer={setToggleContainer}
              type="messaging"
            />
          )}
        />
      </div>
    </>
  );
};

const ChannelListContainer = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  setIsViewing,
}) => {
  const [toggleContainer, setToggleContainer] = useState(false);
  return (
    <>
      <div className="channel-list__container">
        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setIsViewing={setIsViewing}
        />
      </div>
      <div
        className="channel-list__container-responsive"
        style={{
          left: toggleContainer ? "20%" : "-65%",
          backgroundColor: "#005ff",
        }}
      >
        <Box
          sx={{
            display: "block",
            height: "50px",
            width: "50px",
            background: "#45a29e",
            position: "absolute",
            right: "-5%",
            top: "50%",
            borderRadius: "50%",
            zIndex: 2,
          }}
          onClick={() =>
            setToggleContainer((prevToggleContainer) => !prevToggleContainer)
          }
        ></Box>

        <ChannelListContent
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setToggleContainer={setToggleContainer}
          setIsViewing={setIsViewing}
        />
      </div>
    </>
  );
};

export default ChannelListContainer;
