import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Snackbar,
  Box,
  MenuItem,
  Menu,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClassesBanner from "../../../images/ClassesBanner.jpg";
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
  arrayRemove,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { ClassesIcon } from "../../GlobalStyles";
import NoClassIcon from "../../../images/NoClassIcon.svg";

const ClassesTutor = () => {
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
    const getCreatedClasses = async () => {
      try {
        const data = query(
          collection(db, "createdClasses"),
          where("tutorUid", "==", user.uid)
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
    getCreatedClasses();
  }, []);

  const deleteAnnouncements = async (classCode) => {
    const data = [];
    try {
      const q = query(
        collection(db, "announcements"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (classId) => {
        await deleteDoc(doc(db, "announcements", classId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const deleteAssignments = async (classCode) => {
    const data = [];
    try {
      const q = query(
        collection(db, "assignments"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (classId) => {
        await deleteDoc(doc(db, "assignments", classId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const deleteSubmittedAssignments = async (classCode) => {
    const data = [];
    try {
      const q = query(
        collection(db, "submittedAssignments"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (classId) => {
        await deleteDoc(doc(db, "submittedAssignments", classId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const deleteJoinedClasses = async (classCode) => {
    try {
      const data = [];
      const q = query(
        collection(db, "joinedClasses"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        data.push(doc.id);
      });
      data.map(async (joinedClassesId) => {
        await deleteDoc(doc(db, "joinedClasses", joinedClassesId));
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const deleteClassProfile = async (classCode) => {
    try {
      const q = query(
        collection(db, "createdClasses"),
        where("classCode", "==", classCode)
      );
      const querySnapshot = await getDocs(q);
      const deleteDoc = doc(db, "tutors", user?.uid);
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        updateDoc(deleteDoc, {
          grades: arrayRemove(doc.data().grade),
          subjects: arrayRemove(doc.data().subject),
        });
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const handleDelete = async (classCode) => {
    try {
      let confirmAction = window.confirm("Are you sure to delete?");
      if (confirmAction) {
        await deleteSubmittedAssignments(classCode);
        await deleteAssignments(classCode);
        await deleteAnnouncements(classCode);
        await deleteJoinedClasses(classCode);
        await deleteClassProfile(classCode);
        await deleteDoc(doc(db, "createdClasses", classCode)).catch((err) => {
          setSnackBarOpen(true);
          setMessage("An error occurred, please try again");
        });
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
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
                    <CardMedia
                      component="img"
                      height="150"
                      image={ClassesBanner}
                      alt="picture"
                    />
                    <CardContent sx={{ height: "15vh" }}>
                      <Typography gutterBottom variant="body1" component="div">
                        {showClass.subject}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: 15 }}
                      >
                        Grade: {showClass.grade}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ pt: 1, fontSize: 13 }}
                      >
                        Class Code: {showClass.id}
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
                                handleDelete(showClass.classCode);
                              }}
                            >
                              <DeleteOutlineIcon
                                sx={{
                                  fontSize: "20px",
                                  mr: 1,
                                  color: "red",
                                }}
                              />
                              <span style={{ color: "#0b0c10" }}>
                                Delete Class
                              </span>
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

export default ClassesTutor;
