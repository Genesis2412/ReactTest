import React from "react";
import { AddChannel } from "./AddChannel";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const TeamChannelList = ({
  setToggleContainer,
  children,
  error = false,
  loading,
  type,
  isCreating,
  setIsCreating,
  setCreateType,
  setIsEditing,
  setIsViewing,
}) => {
  if (error) {
    return type === "team" ? (
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Typography sx={{ color: "#fff", padding: "0 16px" }}>
          Connection error, please wait a moment and try again
        </Typography>
      </Box>
    ) : null;
  }

  if (loading) {
    return (
      <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <Box sx={{ height: "115px" }}>
          <Typography sx={{ fontSize: "14px", color: "#fff" }}>
            {type === "team" ? "Channels" : "Messages"} loading...
          </Typography>
        </Box>
      </Box>
    );
  }
  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          mt: 2,
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            fontSize: "13px",
            height: "16px",
            color: "rgba(255, 255, 255, 0.66)",
            mb: "5px",
          }}
        >
          {type === "team" ? "Groups" : "Direct Messages"}
        </Typography>
        <AddChannel
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          setCreateType={setCreateType}
          setIsEditing={setIsEditing}
          setIsViewing={setIsViewing}
          type={type === "team" ? "team" : "messaging"}
          setToggleContainer={setToggleContainer}
        />
      </Box>
      {children}
    </Box>
  );
};

export default TeamChannelList;
