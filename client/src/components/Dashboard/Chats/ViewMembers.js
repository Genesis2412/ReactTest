import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { MemberList } from "./exportsFiles";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Button } from "@mui/material";

const ViewMembers = ({ setIsViewing }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { channel } = useChatContext();

  const updateChannel = async (e) => {
    try {
      let confirmAction = window.confirm(
        "Are you sure to remove selected members?"
      );
      if (confirmAction) {
        await channel.removeMembers(selectedUsers).then(() => {
          window.location.reload(false);
          setSelectedUsers([]);
        });
      }
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
        <Typography sx={{ pl: 2, color: "#0b0c10" }}>View Members</Typography>
        <CloseIcon
          onClick={() => setIsViewing(false)}
          sx={{ cursor: "pointer" }}
        />
      </Box>

      <MemberList setSelectedUsers={setSelectedUsers} />
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
        Delete members
      </Button>
    </Box>
  );
};

export default ViewMembers;
