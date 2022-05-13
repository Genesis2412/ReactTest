import React from "react";
import { Channel, useChatContext, MessageTeam } from "stream-chat-react";
import {
  ChannelInner,
  CreateChannel,
  EditChannel,
  // TeamMessage,
} from "./exportsFiles";
import { Box, Typography } from "@mui/material";

const ChannelContainer = ({
  isCreating,
  setIsCreating,
  isEditing,
  setIsEditing,
  createType,
}) => {
  if (isCreating) {
    return (
      <Box sx={{ height: "100%", width: "100%" }}>
        <CreateChannel createType={createType} setIsCreating={setIsCreating} />
      </Box>
    );
  }

  if (isEditing) {
    return (
      <Box sx={{ height: "100%", width: "100%" }}>
        <EditChannel setIsEditing={setIsEditing} />
      </Box>
    );
  }

  const EmptyState = () => (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        flexDirection: "column",
        justifyContent: "flex-end",
        ml: "20px",
        mr: "20px",
        pb: "20px",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "18px",
          lineHeight: "120%",
          mt: 2,
          color: "#2c2c30",
          mb: "10px",
        }}
      >
        Begin your chat journey with MauTutorz
      </Typography>
      <Typography sx={{ fontSize: "14px", m: 0, color: "#858688" }}>
        Send messages, attachments, links, emojis, and more!
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Channel
        EmptyStateIndicator={EmptyState}
        Message={(messageProps, i) => <MessageTeam key={i} {...messageProps} />}
      >
        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </Box>
  );
};

export default ChannelContainer;
