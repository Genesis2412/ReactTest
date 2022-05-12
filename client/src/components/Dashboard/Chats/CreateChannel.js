import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./exportsFiles";
import CancelIcon from "@mui/icons-material/Cancel";
import { Button, Typography, Box, TextField } from "@mui/material";

const ChannelNameInput = ({ channelName = "", setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  };

  return (
    <Box sx={{ p: 3, boxShadow: "0px 1px 0px rgba(0, 0, 0, 0.1)" }}>
      <TextField
        value={channelName}
        onChange={handleChange}
        label="Enter Group Name"
        fullWidth
      />
    </Box>
  );
};

const CreateChannel = ({ createType, setIsCreating }) => {
  const { client, setActiveChannel } = useChatContext();
  const [selectedUsers, setSelectedUsers] = useState([client.userID || ""]);
  const [channelName, setChannelName] = useState("");

  const createChannel = async (event) => {
    event.preventDefault();

    try {
      const newChannel = await client.channel(createType, channelName, {
        name: channelName,
        members: selectedUsers,
      });

      await newChannel.watch();
      setChannelName("");
      setIsCreating(false);
      setSelectedUsers([client.userID]);
      setActiveChannel(newChannel);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "62px",
          paddingRight: "20px",
          boxShadow: 2,
        }}
      >
        <Typography sx={{ pl: 2, color: "#0b0c10" }}>
          {createType === "team"
            ? "Create a New Group"
            : "Send a Direct Message"}
        </Typography>
        <CancelIcon setIsCreating={setIsCreating} sx={{ float: "right" }} />
      </Box>

      {createType === "team" && (
        <ChannelNameInput
          channelName={channelName}
          setChannelName={setChannelName}
        />
      )}
      <UserList setSelectedUsers={setSelectedUsers} />
      <Button
        onClick={createChannel}
        sx={[
          {
            "&:hover": {
              backgroundColor: "#c5c6c7",
              color: "#0b0c10",
            },
            backgroundColor: "#45a29e",
            color: "#fff",
          },
        ]}
      >
        {createType === "team" ? "Create Group" : "Create Message"}
      </Button>
    </Box>
  );
};

export default CreateChannel;
