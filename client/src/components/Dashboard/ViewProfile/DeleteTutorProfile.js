import React, { useState } from "react";
import {
  MenuItem,
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { db } from "../../../firebase-config";
import {
  doc,
  deleteDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StreamChat } from "stream-chat";

const DeleteTutorProfile = () => {
  const { userDetails, user } = useUserAuth();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPassword("");
  };
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "#fff",
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
  };

  const handleDelete = async () => {
    setLoading(true);
    if (password !== "") {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential)
        .then(async () => {
          try {
            await deleteSubmittedAssignments();
            await deleteAssignments();
            await deleteAnnouncements();
            await deleteBookings();
            await deleteJoinedClasses();
            await deleteCreatedClasses();
            await deleteDoc(doc(db, "tutors", user?.uid));
            await deleteUser(user);
            await deleteUserChat();

            navigate("/");
            setLoading(false);
          } catch (error) {
            setSnackBarOpen(true);
            setMessage("An error occurred, please try again");
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.message.includes("auth/wrong-password")) {
            setSnackBarOpen(true);
            setMessage("Incorrect Password!");
            setLoading(false);
          }
        });
    } else {
      setSnackBarOpen(true);
      setMessage("Please, enter your password");
      setLoading(false);
    }
  };

  // delete submittedAssignments
  const deleteSubmittedAssignments = async () => {
    const dataArray = [];
    const newArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    for await (const data of dataArray) {
      const q = query(
        collection(db, "submittedAssignments"),
        where("classCode", "==", data)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        newArray.push(doc.id);
      });
    }

    newArray.map((values) => {
      return deleteDoc(doc(db, "submittedAssignments", values));
    });
  };

  // delete Assignments
  const deleteAssignments = async () => {
    const dataArray = [];
    const newArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    for await (const data of dataArray) {
      const q = query(
        collection(db, "assignments"),
        where("classCode", "==", data)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        newArray.push(doc.id);
      });
    }

    newArray.map((values) => {
      return deleteDoc(doc(db, "assignments", values));
    });
  };

  // delete Announcements
  const deleteAnnouncements = async () => {
    const dataArray = [];
    const newArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    for await (const data of dataArray) {
      const q = query(
        collection(db, "announcements"),
        where("classCode", "==", data)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        newArray.push(doc.id);
      });
    }

    newArray.map((values) => {
      return deleteDoc(doc(db, "announcements", values));
    });
  };

  // delete bookings
  const deleteBookings = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "bookings"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "bookings", values));
    });
  };

  // delete joinedClasses
  const deleteJoinedClasses = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "joinedClasses", values));
    });
  };

  // delete createdClasses
  const deleteCreatedClasses = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "createdClasses", values));
    });
  };

  const deleteUserChat = async () => {
    const URL = "http://localhost:5000/auth/deleteUser";
    var userId = client.userID;

    await axios
      .post(URL, {
        userId,
      })
      .then(async () => {
        await client.disconnectUser();
        window.sessionStorage.removeItem("tkxn");
        window.sessionStorage.removeItem("zpxn");
      });
  };

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <PersonRemoveIcon sx={{ mr: 1, fontSize: 20, color: "#45a29e" }} />{" "}
        Delete Account
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
                fontSize: 18,
              }}
            >
              Are you sure to delete your account?
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
                handleDelete();
              }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress color="secondary" />
              ) : (
                "Yes, i confirm"
              )}
            </Button>

            {!loading && (
              <Button
                fullWidth
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#c5c6c7",
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

export default DeleteTutorProfile;
