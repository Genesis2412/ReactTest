import React, { useState } from "react";
import { useChatContext } from "stream-chat-react";
import { MemberList } from "./exportsFiles";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";

const ViewMembers = ({ setIsViewing }) => {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { channel } = useChatContext();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

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
      setSnackbarOpen(true);
      setSnackbarMessage("An error occurred, please try again");
    }
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

export default ViewMembers;
