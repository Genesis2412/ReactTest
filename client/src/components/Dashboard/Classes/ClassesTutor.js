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
import ScrumBoard from "../../../images/NoExistBanner/ScrumBoard.svg";
import { ClassesEmpty } from "../../GlobalStyles";
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
  updateDoc,
  deleteField,
  arrayUnion,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import CreateClass from "../CreateClass/CreateClass";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const ClassesTutor = () => {
  const { user, userDetails, classes, setClasses } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  useEffect(() => {
    const getCreatedClasses = async () => {
      try {
        setShowLoader(true);
        const data = query(
          collection(db, "createdClasses"),
          where("tutorEmail", "==", userDetails?.email)
        );
        const unsubscribe = onSnapshot(data, (querySnapshot) => {
          const newFiles = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setClasses(newFiles);
          setShowLoader(false);
        });
      } catch (err) {
        setShowLoader(false);
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    };
    getCreatedClasses();
  }, []);

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

  const deleteBookings = async (subject, grade, day, time) => {
    try {
      const data = [];
      const q = query(
        collection(db, "bookings"),
        where("tutorEmail", "==", userDetails?.email),
        where("subject", "==", subject),
        where("grade", "==", grade),
        where("day", "==", day),
        where("time", "==", time)
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

  const handleUpdateProfile = async () => {
    const classesArray = [];
    try {
      // delete field classes from tutor
      const tutorRef = doc(db, "tutors", user?.uid);
      await updateDoc(tutorRef, {
        classes: deleteField(),
      })
        .then(async () => {
          // check if there are any created classes by tutoremail
          const q = query(
            collection(db, "createdClasses"),
            where("tutorEmail", "==", userDetails?.email)
          );

          const querySnapshot = await getDocs(q);
          querySnapshot.forEach((doc) => {
            classesArray.push(doc.data());
          });
        })
        .then(() => {
          classesArray.map(async (classArray) => {
            // update profile and push subjects and grades in array
            await updateDoc(doc(db, "tutors", user?.uid), {
              classes: arrayUnion({
                subject: classArray?.subject,
                grade: classArray?.grade,
              }),
            });
          });
        });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const handleDelete = async (classCode, subject, grade, day, time) => {
    try {
      let confirmAction = window.confirm("Are you sure to delete?");
      if (confirmAction) {
        setShowLoader(true);

        await deleteSubmittedAssignments(classCode);
        await deleteAssignments(classCode);
        await deleteAnnouncements(classCode);
        await deleteJoinedClasses(classCode);
        await deleteBookings(subject, grade, day, time);
        await deleteDoc(doc(db, "createdClasses", classCode));
        await handleUpdateProfile();

        setShowLoader(false);
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      }
    } catch (err) {
      setShowLoader(false);
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  return (
    <>
      <CreateClass />
      <LoadingSpinner stateLoader={showLoader} />

      {!showLoader && classes.length !== 0 && (
        <Grid container rowSpacing={4} spacing={2} mt={1}>
          {classes.map((showClass) => {
            return (
              <Grid item xs={11} md={3} key={showClass.id}>
                <Card
                  variant="outlined"
                  style={{
                    backgroundColor: "#615F66",
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
                        classDay: showClass.day,
                        classTime: showClass.time,
                      }}
                      style={{ textDecoration: "none" }}
                    >
                      <CardMedia
                        component="img"
                        height="150"
                        image={ClassesBanner}
                        alt="picture"
                      />
                      <CardContent sx={{ height: "15vh" }}>
                        <Typography
                          sx={{
                            fontSize: 16,
                            fontWeight: "bold",
                            color: "#f6f6f6",
                          }}
                        >
                          {showClass.subject}
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "#f6f6f6" }}>
                          Grade: {showClass.grade}
                        </Typography>

                        <Typography sx={{ fontSize: 14, color: "#f6f6f6" }}>
                          {showClass.day + ", " + showClass.time}
                        </Typography>

                        <Typography
                          sx={{ pt: 3, fontSize: 15, color: "#66fcf1" }}
                        >
                          Description: {showClass.description}
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
                              sx={{ cursor: "pointer", color: "#52d6f4" }}
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
                                    showClass.classCode,
                                    showClass.subject,
                                    showClass.grade,
                                    showClass.day,
                                    showClass.time
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
      )}

      {!showLoader && classes.length === 0 && (
        <Box mt={5}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <ClassesEmpty src={ScrumBoard} alt={"image"} />
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              fontFamily: "Montserrat",
              fontSize: 19,
            }}
          >
            Let's begin the new adventure
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Montserrat",
              fontSize: 16,
            }}
          >
            Create your class
          </Typography>
        </Box>
      )}

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
