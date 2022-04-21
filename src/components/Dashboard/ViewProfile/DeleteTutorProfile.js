import React, { useState, useEffect } from "react";
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
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const DeleteTutorProfile = () => {
  const { userDetails, user, deleteAuthUser } = useUserAuth();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [password, setPassword] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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
    deleteAnnouncements();
    if (password !== "") {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential)
        .then(() => {
          // deleteSubmittedAssignments();
          // deleteAssignments();
          deleteAnnouncements();
          // deleteBookings();
          // deleteJoinedClasses();
          // deleteCreatedClasses();
        })
        .catch((err) => {
          if (err.message.includes("auth/wrong-password")) {
            setMessage("Incorrect Password!");
          }
          setSnackBarOpen(true);
        });
    } else {
      setSnackBarOpen(true);
      setMessage("Please, enter your Email and Password");
    }
  };

  const deleteTutorProfile = async () => {
    deleteDoc(doc(db, "tutors", user.uid)).catch((err) => {
      setSnackBarOpen(true);
      setMessage("An error occured, please try again");
      return;
    });
  };

  // delete createdClasses
  const deleteCreatedClasses = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("userUid", "==", user?.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "createdClasses", values)).catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occured, please try again");
        return;
      });
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
      return deleteDoc(doc(db, "bookings", values)).catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occured, please try again");
        return;
      });
    });
  };

  // delete joinedClasses
  const deleteJoinedClasses = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("userUid", "==", user?.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "joinedClasses", values)).catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occured, please try again");
        return;
      });
    });
  };

  // delete announcements
  const deleteAnnouncements = async () => {
    const classCodeArray = [];
    const dataArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("userUid", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      classCodeArray.push(doc.data().classCode);
    });

    classCodeArray.map(async (values) => {
      const q = query(
        collection(db, "announcements"),
        where("classCode", "==", values)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        dataArray.push(doc.id);
      });
    });

    // datasArray.map(async (value) => {
    // return deleteDoc(doc(db, "announcements", values)).catch((err) => {
    //   setSnackBarOpen(true);
    //   setMessage("An error occured, please try again");
    //   return;
    // });
    // });
  };

  // delete announcements
  const deleteAssignments = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("userUid", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.data().classCode);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "assignments", values)).catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occured, please try again");
        return;
      });
    });
  };

  // delete announcements
  const deleteSubmittedAssignments = async () => {
    const dataArray = [];
    const q = query(
      collection(db, "createdClasses"),
      where("userUid", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.data().classCode);
    });

    dataArray.map((values) => {
      return deleteDoc(doc(db, "submittedAssignments", values)).catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occured, please try again");
        return;
      });
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
                      color: "#0b0c10",
                    },
                    backgroundColor: "#FF4747",
                    color: "#fff",
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