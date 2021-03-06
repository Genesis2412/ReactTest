import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { UserList } from "./exportsFiles";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

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
        label=" Change group name"
        fullWidth
      />

      <Typography sx={{ mt: 2 }}>Add members</Typography>
    </Box>
  );
};

const EditChannel = ({ setIsEditing }) => {
  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const updateChannel = async (e) => {
    e.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if (nameChanged) {
      try {
        await channel.update(
          { name: channelName },
          { text: `Channel Name changed to ${channelName}` }
        );
      } catch (error) {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred, please try again");
      }
    }

    if (selectedUsers.length) {
      await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  };

  return (
    <>
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
          <Typography sx={{ pl: 2, color: "#0b0c10" }}>Edit Group</Typography>
          <CloseIcon
            onClick={() => setIsEditing(false)}
            sx={{ cursor: "pointer" }}
          />
        </Box>
        <ChannelNameInput
          channelName={channelName}
          setChannelName={setChannelName}
        />
        <UserList setSelectedUsers={setSelectedUsers} />
        <Button
          onClick={updateChannel}
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
          Save Changes
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default EditChannel;
