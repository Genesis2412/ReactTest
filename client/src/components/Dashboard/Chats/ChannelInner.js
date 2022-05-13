import React, { useState } from "react";
import {
  MessageList,
  MessageInput,
  Thread,
  Window,
  useChannelActionContext,
  Avatar,
  useChannelStateContext,
  useChatContext,
} from "stream-chat-react";
import { Box, Typography, MenuItem, Menu } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PreviewIcon from "@mui/icons-material/Preview";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LogoutIcon from "@mui/icons-material/Logout";

export const GiphyContext = React.createContext({});

const ChannelInner = ({ setIsEditing }) => {
  const [giphyState, setGiphyState] = useState(false);
  const { sendMessage } = useChannelActionContext();

  const overrideSubmitHandler = (message) => {
    let updatedMessage = {
      attachments: message.attachments,
      mentioned_users: message.mentioned_users,
      parent_id: message.parent?.id,
      parent: message.parent,
      text: message.text,
    };

    if (giphyState) {
      updatedMessage = { ...updatedMessage, text: `/giphy ${message.text}` };
    }

    if (sendMessage) {
      sendMessage(updatedMessage);
      setGiphyState(false);
    }
  };

  return (
    <GiphyContext.Provider value={{ giphyState, setGiphyState }}>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Window>
          <TeamChannelHeader setIsEditing={setIsEditing} />
          <MessageList />
          <MessageInput overrideSubmitHandler={overrideSubmitHandler} />
        </Window>
        <Thread />
      </Box>
    </GiphyContext.Provider>
  );
};

const TeamChannelHeader = ({ setIsEditing }) => {
  const { channel, watcher_count } = useChannelStateContext();
  const { client } = useChatContext();

  console.log(channel.data.name);

  const leaveChat = async () => {
    try {
      let confirmAction = window.confirm(
        "Are you sure to leave " + channel.data.name + "?"
      );
      if (confirmAction) {
        await channel.removeMembers([client.userID]).then(() => {
          window.location.reload(false);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteChat = async () => {
    try {
      let confirmAction = window.confirm(
        "Are you sure to delete " + channel.data.name + "?"
      );
      if (confirmAction) {
        await channel.delete();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const MessagingHeader = () => {
    const members = Object.values(channel.state.members).filter(
      ({ user }) => user.id !== client.userID
    );

    const additionalMembers = members.length - 3;

    if (channel.type === "messaging") {
      return (
        <Box>
          {members.map(({ user }, i) => (
            <Box
              key={i}
              sx={{ display: "flex", alignItems: "center", mr: "8px" }}
            >
              <Avatar
                image={user.image}
                name={user?.name || user?.email}
                size={32}
              />
              <Typography sx={{ color: "0b0c10", fontSize: 15 }}>
                {user?.name || user?.email}
              </Typography>
            </Box>
          ))}

          {additionalMembers > 0 && (
            <Typography sx={{ color: "0b0c10", fontSize: 12 }}>
              and {additionalMembers} more
            </Typography>
          )}
        </Box>
      );
    }

    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "#2c2c30",
            mr: "8px",
          }}
        >
          # {channel.data.name}
        </Typography>
      </Box>
    );
  };

  const getWatcherText = (watchers) => {
    if (!watchers) return "No users online";
    if (watchers === 1) return "1 user online";
    return `${watchers} users online`;
  };

  return (
    <Box
      sx={{
        p: 2,
        boxShadow: 5,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <MessagingHeader />
      <Box
        sx={{
          textAlign: "right",
        }}
      >
        {channel?.data?.created_by?.id === client.userID && (
          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <>
                <MoreVertIcon
                  {...bindTrigger(popupState)}
                  sx={{ cursor: "pointer", color: "#1f2833" }}
                />
                {channel?.type === "team" && (
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem sx={{ color: "#0b0c10" }}>
                      <PreviewIcon sx={{ fontSize: 18, pr: 1 }} /> View Members
                    </MenuItem>
                    <MenuItem
                      sx={{ color: "#1f2833" }}
                      onClick={() => setIsEditing(true)}
                    >
                      <EditIcon sx={{ fontSize: 18, pr: 1 }} /> Edit Group
                    </MenuItem>

                    <MenuItem
                      sx={{ color: "red" }}
                      onClick={() => {
                        deleteChat();
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 18, pr: 1 }} /> Delete Group
                    </MenuItem>
                  </Menu>
                )}

                {/* Direct Message */}
                {channel?.type === "messaging" && (
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      sx={{ color: "red" }}
                      onClick={() => {
                        deleteChat();
                      }}
                    >
                      <DeleteIcon sx={{ fontSize: 16, pr: 1 }} /> Delete Chat
                    </MenuItem>
                  </Menu>
                )}
              </>
            )}
          </PopupState>
        )}

        {channel?.data?.created_by?.id !== client.userID &&
          channel?.type === "team" && (
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <>
                  <MoreVertIcon
                    {...bindTrigger(popupState)}
                    sx={{ cursor: "pointer", color: "#1f2833" }}
                  />
                  <Menu {...bindMenu(popupState)}>
                    <MenuItem
                      sx={{ color: "red" }}
                      onClick={() => {
                        leaveChat();
                      }}
                    >
                      <LogoutIcon sx={{ fontSize: 16, pr: 1 }} /> Leave Group
                    </MenuItem>
                  </Menu>
                </>
              )}
            </PopupState>
          )}

        {channel?.type === "team" && (
          <Typography sx={{ fontSize: "14px", color: "#858688", mt: 1 }}>
            {getWatcherText(watcher_count)}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default ChannelInner;
