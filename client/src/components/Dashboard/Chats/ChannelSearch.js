import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";
import { ResultsDropdown } from "./exportsFiles";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
    }
  }, [query]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const getChannels = async (text) => {
    try {
      const channelResponse = client.queryChannels({
        type: "team",
        name: { $autocomplete: text },
        members: { $in: [client.userID] },
      });

      const userResponse = client.queryUsers({
        id: { $ne: client.userID },
        name: { $autocomplete: text },
      });

      const [channels, { users }] = await Promise.all([
        channelResponse,
        userResponse,
      ]);

      if (channels.length) {
        setTeamChannels(channels);
      }
      if (users.length) {
        setDirectChannels(users);
      }
      setLoading(false);
    } catch (error) {
      if (!error.message.includes("$autocomplete")) {
        setSnackbarOpen(true);
        setSnackbarMessage("An error occurred, please try again");
      }
      setQuery("");
    }
  };

  const onSearch = (event) => {
    event.preventDefault();

    setLoading(true);
    setQuery(event.target.value);
    getChannels(event.target.value);
  };

  const setChannel = (channel) => {
    setQuery("");
    setActiveChannel(channel);
  };

  return (
    <>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pt: "16px",
        }}
      >
        <Box>
          <TextField
            label="Search"
            type="text"
            autoComplete="off"
            value={query}
            onChange={onSearch}
            size="small"
            sx={{
              input: {
                color: "#fff",
                backgroundColor: "rgba(255, 255, 255, 0.66)",
                borderRadius: 2,
              },
            }}
          />
        </Box>

        {query && (
          <ResultsDropdown
            teamChannels={teamChannels}
            directChannels={directChannels}
            loading={loading}
            setChannel={setChannel}
            setQuery={setQuery}
            setToggleContainer={setToggleContainer}
          />
        )}
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

export default ChannelSearch;
