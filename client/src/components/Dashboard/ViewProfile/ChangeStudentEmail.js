import React, { useState } from "react";
import {
  MenuItem,
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
} from "@mui/material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../../Context/UserAuthContext";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import { StreamChat } from "stream-chat";

const ChangeStudentEmail = () => {
  const { user, userDetails } = useUserAuth();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [loading, setLoading] = useState(false);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
    setEmail("");
    setPassword("");
  };

  const handleUpdateEmail = async () => {
    setLoading(true);
    var regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (password) {
      if (email.toString().toLowerCase().match(regex)) {
        if (
          email.toString().toLowerCase() !== userDetails?.email.toLowerCase()
        ) {
          const credential = EmailAuthProvider.credential(user.email, password);
          await reauthenticateWithCredential(user, credential)
            .then(async () => {
              await updateSubmittedAssignments(email);
              await updateBookings(email);
              await updateJoinedClasses(email);
              await updateProfile(email);
              await updateStreamEmail(email);
              await updateEmail(user, email)
                .then(() => {
                  setSnackBarOpen(true);
                  setMessage("Email changed successfully");
                  setLoading(false);
                  setPassword("");
                  setEmail("");
                })
                .catch((error) => {
                  setSnackBarOpen(true);
                  setMessage("An error occurred, please try again");
                  setLoading(false);
                });
            })
            .catch((err) => {
              if (err.message.includes("auth/wrong-password")) {
                setSnackBarOpen(true);
                setMessage("Incorrect Password!");
                setLoading(false);
              } else {
                setSnackBarOpen(true);
                setMessage("An error occurred, please try again");
                setLoading(false);
              }
            });
        } else {
          setSnackBarOpen(true);
          setMessage(
            "You cannot update your new email with your current email"
          );
          setLoading(false);
        }
      } else {
        setSnackBarOpen(true);
        setMessage("Please, enter valid email");
        setLoading(false);
      }
    } else {
      setSnackBarOpen(true);
      setMessage("Please, enter password");
      setLoading(false);
    }
  };

  // updateSubmittedAssignments
  const updateSubmittedAssignments = async (newEmail) => {
    const dataArray = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("studentEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map(async (values) => {
      const submittedRef = doc(db, "submittedAssignments", values);
      await updateDoc(submittedRef, {
        studentEmail: newEmail,
      });
    });
  };

  // updateBookings
  const updateBookings = async (newEmail) => {
    const dataArray = [];
    const q = query(
      collection(db, "bookings"),
      where("studentEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map(async (values) => {
      const bookingRef = doc(db, "bookings", values);
      await updateDoc(bookingRef, {
        studentEmail: newEmail,
      });
    });
  };

  // updatejoinedClasses
  const updateJoinedClasses = async (newEmail) => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("studentEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map(async (values) => {
      const joinedRef = doc(db, "joinedClasses", values);
      await updateDoc(joinedRef, {
        studentEmail: newEmail,
      });
    });
  };

  // updateProfile
  const updateProfile = async (newEmail) => {
    const classesRef = doc(db, "students", user?.uid);
    await updateDoc(classesRef, {
      email: newEmail,
    });
  };

  const updateStreamEmail = async (email) => {
    client.partialUpdateUser({
      id: client.userID,
      set: {
        email: email,
      },
    });
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <AlternateEmailIcon sx={{ mr: 1, fontSize: 16, color: "#45a29e" }} />
        Change Email
      </MenuItem>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Please enter your Password and your new Email
            </Typography>
            <TextField
              label="Enter your password"
              type="password"
              required
              fullWidth
              sx={{ mt: 1 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <TextField
              label="Enter your new email"
              type="email"
              required
              fullWidth
              sx={{ mt: 1 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              fullWidth
              sx={[
                {
                  "&:hover": {
                    backgroundColor: "#c5c6c7",
                    color: "#0b0c10",
                  },
                  backgroundColor: "#45a29e",
                  color: "#fff",
                  mt: 1,
                },
              ]}
              onClick={() => {
                handleUpdateEmail();
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress color="secondary" /> : "Submit"}
            </Button>

            {!loading && (
              <Button
                fullWidth
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#c5c6c7",
                      color: "#0b0c10",
                    },

                    border: "2px solid #45a29e",
                    color: "#0b0c10",
                    mt: 1,
                  },
                ]}
                onClick={() => {
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
          <Snackbar
            open={snackBarOpen}
            autoHideDuration={3000}
            onClose={handleSnackClose}
            message={message}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          />
        </>
      </Modal>
    </>
  );
};

export default ChangeStudentEmail;
