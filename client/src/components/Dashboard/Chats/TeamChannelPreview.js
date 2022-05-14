import React from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { Box, Typography } from "@mui/material";

const TeamChannelPreview = ({
  setActiveChannel,
  setIsCreating,
  setIsEditing,
  setIsViewing,
  setToggleContainer,
  channel,
  type,
}) => {
  const { channel: activeChannel, client } = useChatContext();
  const ChannelPreview = () => (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        p: 1.5,
        height: "100%",
        width: "100%",
        textOverflow: "ellipsis",
        wordBreak: "break-all",
      }}
    >
      <Typography sx={{ fontSize: "14px", color: "#fff" }}>
        # {channel?.data?.name || channel?.data?.id}
      </Typography>
    </Box>
  );

  const DirectPreview = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          height: "100%",
          width: "100%",
          textOverflow: "ellipsis",
          wordBreak: "break-all",
        }}
      >
        <Avatar
          image={members[0]?.user?.image}
          name={members[0]?.user?.name || members[0]?.user?.first_name}
          size={24}
        />
        <Typography sx={{ fontSize: "14px", color: "#fff" }}>
          {members[0]?.user?.name || members[0]?.user?.email}
        </Typography>
      </Box>
    );
  };

  return (
    <Box
      onClick={() => {
        setIsCreating(false);
        setIsEditing(false);
        setIsViewing(false);
        setActiveChannel(channel);

        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
      sx={{
        ...(channel?.id === activeChannel?.id && {
          backgroundColor: "#474F58",
          cursor: "pointer",
        }),

        ...(channel?.id !== activeChannel?.id && {
          "&:hover": {
            backgroundColor: "#474F58",
            cursor: "pointer",
            transition: "0.5s",
          },
        }),
      }}
    >
      {type === "team" ? <ChannelPreview /> : <DirectPreview />}
    </Box>
  );
};

export default TeamChannelPreview;
