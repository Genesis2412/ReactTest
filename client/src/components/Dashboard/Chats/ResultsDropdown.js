import React from "react";
import { Avatar, useChatContext } from "stream-chat-react";
import { Box, Typography } from "@mui/material";

const channelByUser = async ({
  client,
  setActiveChannel,
  channel,
  setChannel,
}) => {
  const filters = {
    type: "messaging",
    member_count: 2,
    members: { $eq: [client.user.id, client.userID] },
  };

  const [existingChannel] = await client.queryChannels(filters);

  if (existingChannel) return setActiveChannel(existingChannel);

  const newChannel = client.channel("messaging", {
    members: [channel.id, client.userID],
  });

  setChannel(newChannel);

  return setActiveChannel(newChannel);
};

const SearchResult = ({
  channel,
  focusedId,
  type,
  setChannel,
  setToggleContainer,
}) => {
  const { client, setActiveChannel } = useChatContext();

  if (type === "channel") {
    return (
      <Box
        onClick={() => {
          setChannel(channel);
          if (setToggleContainer) {
            setToggleContainer((prevState) => !prevState);
          }
        }}
        sx={{
          ...(focusedId === channel.id && {
            width: "100%",
            height: "48px",
            display: "flex",
            alignItems: "center",
            background: "#005fff1a",
            cursor: "pointer",
          }),
          ...(focusedId !== channel.id && {
            width: "100%",
            height: "48px",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }),
        }}
      >
        <Box
          sx={{
            height: "24px",
            width: "28px",
            backgroundColor: "#1f2833",
            borderRadius: "24px",
            m: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Helvetica Neue, sans-serif",
            fontWeight: "bold",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#fff",
          }}
        >
          #
        </Box>
        <Typography
          sx={{
            width: "100%",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#2c2c30",
          }}
        >
          {channel.data.name}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      onClick={async () => {
        channelByUser({ client, setActiveChannel, channel, setChannel });
        if (setToggleContainer) {
          setToggleContainer((prevState) => !prevState);
        }
      }}
      sx={{
        ...(focusedId === channel.id && {
          width: "100%",
          height: "48px",
          display: "flex",
          alignItems: "center",
          background: "#005fff1a",
          cursor: "pointer",
        }),
        ...(focusedId !== channel.id && {
          width: "100%",
          height: "48px",
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
        }),
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", marginLeft: "12px" }}>
        <Avatar image={channel?.image} name={channel?.name} size={24} />
        <Typography
          sx={{
            width: "100%",
            fontSize: "14px",
            lineHeight: "120%",
            color: "#2c2c30",
          }}
        >
          {channel?.name}
        </Typography>
      </Box>
    </Box>
  );
};

const ResultsDropdown = ({
  teamChannels,
  directChannels,
  focusedId,
  loading,
  setChannel,
  setToggleContainer,
}) => {
  return (
    <Box
      sx={{
        position: "absolute",
        height: "fit-content",
        width: "220px",
        background: "#fff",
        border: "1px solid #e9e9ea",
        boxSizing: "border-box",
        boxShadow: 3,
        borderRadius: "8px",
        zIndex: 10,
        left: "11px",
        top: "58px",
      }}
    >
      <Typography
        sx={{
          pl: 1,
          pt: 0.5,
          fontSize: "14px",
          color: "#858688",
        }}
      >
        Groups
      </Typography>

      {loading && !teamChannels.length && (
        <Typography
          sx={{
            fontStyle: "italic",
            pl: 2,
            fontSize: "14px",
            color: "#000",
          }}
        >
          Loading...
        </Typography>
      )}

      {!loading && !teamChannels.length ? (
        <Typography
          sx={{
            fontStyle: "italic",
            pl: 2,
            fontSize: "14px",
            color: "#000",
          }}
        >
          No groups found
        </Typography>
      ) : (
        teamChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type="channel"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}

      {/* Users Display */}
      <Typography
        sx={{
          pl: 1,
          pt: 0.5,
          fontSize: "14px",
          color: "#858688",
        }}
      >
        Users
      </Typography>
      {loading && !directChannels.length && (
        <Typography
          sx={{
            fontStyle: "italic",
            pl: 2,
            fontSize: "14px",
            color: "#000",
          }}
        >
          Loading...
        </Typography>
      )}
      {!loading && !directChannels.length ? (
        <Typography
          sx={{
            fontStyle: "italic",
            pl: 2,
            fontSize: "14px",
            color: "#000",
          }}
        >
          No direct messages found
        </Typography>
      ) : (
        directChannels?.map((channel, i) => (
          <SearchResult
            channel={channel}
            focusedId={focusedId}
            key={i}
            setChannel={setChannel}
            type="user"
            setToggleContainer={setToggleContainer}
          />
        ))
      )}
    </Box>
  );
};

export default ResultsDropdown;
