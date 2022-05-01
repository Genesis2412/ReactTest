import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  CardActions,
  Snackbar,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import { AvatarContainer } from "./ClassesElements";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { db } from "../../../firebase-config";
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const ClassesStudents = () => {
  const { user, userDetails, classes, setClasses } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  useEffect(() => {
    const read = async () => {
      try {
        const data = query(
          collection(db, "joinedClasses"),
          where("studentEmail", "==", userDetails?.email)
        );
        const unsubscribe = onSnapshot(data, (querySnapshot) => {
          const newFiles = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setClasses(newFiles);
        });
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    };
    read();
  }, []);

  const deleteSubmittedAssignments = async (classCode) => {
    const data = [];
    try {
      const q = query(
        collection(db, "submittedAssignments"),
        where("classCode", "==", classCode),
        where("studentEmail", "==", userDetails?.email)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (assignmentId) => {
        await deleteDoc(doc(db, "submittedAssignments", assignmentId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const deleteBookings = async (subject, grade) => {
    try {
      const data = [];
      const q = query(
        collection(db, "bookings"),
        where("studentEmail", "==", userDetails?.email),
        where("subject", "==", subject),
        where("grade", "==", grade)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (bookingsId) => {
        await deleteDoc(doc(db, "bookings", bookingsId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const handleDelete = async (joinedClassesId, classCode, subject, grade) => {
    try {
      let confirmAction = window.confirm("Are you sure to delete?");
      if (confirmAction) {
        await deleteSubmittedAssignments(classCode);
        await deleteBookings(subject, grade);
        await deleteDoc(doc(db, "joinedClasses", joinedClassesId)).catch(
          (err) => {
            setSnackBarOpen(true);
            setMessage("An error occurred, please try again");
          }
        );
        setSnackBarOpen(true);
        setMessage("Unenrolled Successfully");
      }
    } catch (err) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  return (
    <>
      <Grid container rowSpacing={4} spacing={2}>
        {classes.map((showClass) => {
          return (
            <Grid item xs={11} md={3} key={showClass.id}>
              <Card
                variant="outlined"
                style={{
                  backgroundColor: "#c5c6c7",
                  borderRadius: 10,
                }}
              >
                <CardActionArea>
                  <Link
                    to={"/dashboard/classesdetails/streams"}
                    state={{
                      classCode: showClass.classCode,
                      classSubject: showClass.subject,
                      classGrade: showClass.grade,
                    }}
                    style={{ color: "#000", textDecoration: "none" }}
                  >
                    <CardContent
                      sx={{
                        backgroundImage:
                          "url(https://wallpaperaccess.com/full/187161.jpg)",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <AvatarContainer
                          alt={showClass.tutorFirstName}
                          src={showClass.tutorProfilePic}
                        />
                      </Box>
                    </CardContent>

                    <CardContent sx={{ height: "10vh" }}>
                      <Typography>
                        {showClass.tutorTitle +
                          " " +
                          showClass.tutorFirstName +
                          " " +
                          showClass.tutorLastName}
                      </Typography>
                      <Typography sx={{ pt: 1, fontSize: 15 }}>
                        {showClass.subject}
                      </Typography>

                      <Typography sx={{ fontSize: 15 }}>
                        Grade: {showClass.grade}
                      </Typography>
                    </CardContent>
                  </Link>
                </CardActionArea>
                <CardActions>
                  <Box sx={{ position: "relative", left: "90%" }}>
                    <PopupState variant="popover" popupId="demo-popup-menu">
                      {(popupState) => (
                        <>
                          <MoreVertIcon
                            {...bindTrigger(popupState)}
                            sx={{ cursor: "pointer", color: "#1f2833" }}
                          />
                          <Menu {...bindMenu(popupState)}>
                            <MenuItem>
                              <Link
                                size="small"
                                style={{
                                  textDecoration: "none",
                                }}
                                to="/dashboard/chats"
                              >
                                <ChatIcon
                                  sx={{
                                    color: "#45a29e",
                                    fontSize: "20px",
                                    mr: 1,
                                    position: "relative",
                                    top: 5,
                                  }}
                                />
                                <span style={{ color: "#0b0c10" }}>Chat</span>
                              </Link>
                            </MenuItem>
                            <MenuItem>
                              <Link
                                size="small"
                                style={{
                                  textDecoration: "none",
                                }}
                                to="/dashboard/videocall"
                              >
                                <VideoCallIcon
                                  sx={{
                                    color: "#45a29e",
                                    fontSize: "20px",
                                    mr: 1,
                                    position: "relative",
                                    top: 5,
                                  }}
                                />
                                <span style={{ color: "#0b0c10" }}>
                                  Videocall
                                </span>
                              </Link>
                            </MenuItem>
                            <MenuItem
                              onClick={() => {
                                handleDelete(
                                  showClass.id,
                                  showClass.classCode,
                                  showClass.subject,
                                  showClass.grade
                                );
                              }}
                            >
                              <DeleteOutlineIcon
                                sx={{
                                  fontSize: "20px",
                                  mr: 1,
                                  color: "red",
                                }}
                              />
                              <span style={{ color: "#0b0c10" }}>Unenroll</span>
                            </MenuItem>
                          </Menu>
                        </>
                      )}
                    </PopupState>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default ClassesStudents;
