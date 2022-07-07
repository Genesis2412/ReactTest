import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  setDoc,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import Typography from "@mui/material/Typography";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useUserAuth } from "../../../Context/UserAuthContext";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { TutorBookingEmpty } from "../../GlobalStyles";
import TutorBookingBoard from "../../../images/NoExistBanner/TutorBookingBoard.svg";

const BookingTutor = () => {
  const { userDetails } = useUserAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const deleteBookingTutor = async (bookingId) => {
    let confirmAction = window.confirm("Are you sure to reject this booking?");
    if (confirmAction) {
      const bookingsRef = doc(db, "bookings", bookingId);
      try {
        await updateDoc(bookingsRef, {
          status: "Rejected",
          tutorUpdated: "Yes",
        });
        setSnackBarOpen(true);
        setMessage("Rejected Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const getAssignmentCode = async (classCode) => {
    const assignmentCode = [];

    const q = query(
      collection(db, "assignments"),
      where("classCode", "==", classCode)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      assignmentCode.push(doc.id);
    });

    return assignmentCode;
  };

  const addToClass = async (
    bookingId,
    classCode,
    subject,
    grade,
    day,
    time,
    studentEmail,
    studentFirstName,
    studentLastName,
    studentProfilePic
  ) => {
    let confirmAction = window.confirm("Are you sure to add this student?");
    if (confirmAction) {
      setShowLoader(true);
      try {
        const joinedRef = collection(db, "joinedClasses");
        await setDoc(doc(joinedRef), {
          classCode: classCode,
          subject: subject,
          grade: grade,
          day: day,
          time: time,
          tutorUpdated: "Yes",

          tutorTitle: userDetails?.title,
          tutorFirstName: userDetails?.name.firstName,
          tutorLastName: userDetails?.name.lastName,
          tutorProfilePic: userDetails?.profilePic,
          tutorEmail: userDetails?.email,

          studentFirstName: studentFirstName,
          studentLastName: studentLastName,
          studentEmail: studentEmail,
          studentProfilePic: studentProfilePic,
        });

        await getAssignmentCode(classCode).then(async (assignmentCode) => {
          if (assignmentCode.length !== 0) {
            assignmentCode?.map(async (assignmentCodei) => {
              await setDoc(doc(collection(db, "submittedAssignments")), {
                classCode: classCode,
                studentFirstName: studentFirstName,
                studentLastName: studentLastName,
                studentEmail: studentEmail,
                assignmentCode: assignmentCodei,
                submittedFileName: [],
                submittedFileUrl: [],
                submittedTimestamp: "",
                status: "Not Submitted",
                marks: "",
                remarks: "",
                correctedFileName: [],
                correctedUrl: [],
              });
            });
          }
        });

        const bookingsRef = doc(db, "bookings", bookingId);
        await updateDoc(bookingsRef, {
          status: "Joined",
        });

        setSnackBarOpen(true);
        setMessage("Added to Class");
      } catch (err) {
        setShowLoader(false);
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  //reading all tutor's pending bookings
  useEffect(() => {
    setShowLoader(true);
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bookings"),
        where("tutorEmail", "==", userDetails?.email),
        where("status", "==", "Pending")
      ),
      (querySnapshot) => {
        const bookingsData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setUserBookings(bookingsData);
        setShowLoader(false);
      }
    );
  }, []);

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {!showLoader && userBookings.length !== 0 && (
        <Box>
          {userBookings?.map((bookings, key) => {
            return (
              <Box sx={{ mt: 2 }} key={key}>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ float: "right" }}>
                    <Button
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#45a29e",
                            color: "#0b0c10",
                          },
                          backgroundColor: "#c5c6c7",
                          color: "green",
                          mr: 1,
                        },
                      ]}
                      onClick={() => {
                        addToClass(
                          bookings?.id,
                          bookings?.classCode,
                          bookings?.subject,
                          bookings?.grade,
                          bookings?.day,
                          bookings?.time,
                          bookings?.studentEmail,
                          bookings?.studentFirstName,
                          bookings?.studentLastName,
                          bookings?.studentProfilePic
                        );
                      }}
                    >
                      <AddIcon />
                    </Button>
                    <Button
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#45a29e",
                          },
                          backgroundColor: "#c5c6c7",
                          color: "red",
                        },
                      ]}
                      onClick={() => {
                        deleteBookingTutor(bookings.id);
                      }}
                    >
                      <DeleteIcon />
                    </Button>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={1}>
                      <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Avatar
                          sx={{ width: 60, height: 60 }}
                          alt={
                            bookings.studentFirstName +
                            " " +
                            bookings.studentLastName
                          }
                          src={bookings.studentProfilePic}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={11}>
                      <Paper
                        sx={{ p: 2, backgroundColor: "#1f2833", color: "#fff" }}
                      >
                        <Typography>
                          <span style={{ color: "#45a29e" }}>
                            {bookings.studentFirstName +
                              " " +
                              bookings.studentLastName +
                              " "}
                          </span>
                          wants to join your{" "}
                          <span style={{ color: "#45a29e" }}>
                            {bookings.day + " " + bookings.time}
                          </span>
                          , Grade{" "}
                          <span style={{ color: "#45a29e" }}>
                            {bookings?.grade + " " + bookings?.subject}
                          </span>{" "}
                          class
                        </Typography>
                        <Typography>
                          Contact Here:{" "}
                          <a
                            href={"mailto:" + bookings?.studentEmail}
                            style={{ textDecoration: "none", color: "#66fcf1" }}
                          >
                            {bookings?.studentEmail}
                          </a>
                        </Typography>
                        <Typography>
                          Or Chat Here:{" "}
                          <CommentIcon
                            sx={{
                              position: "relative",
                              top: 8,
                              color: "#66fcf1",
                            }}
                          />
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            );
          })}
        </Box>
      )}

      {!showLoader && userBookings.length === 0 && (
        <Box mt={5}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <TutorBookingEmpty src={TutorBookingBoard} alt={"image"} />
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              fontFamily: "Montserrat",
              fontSize: 19,
            }}
          >
            No bookings available
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

export default BookingTutor;
