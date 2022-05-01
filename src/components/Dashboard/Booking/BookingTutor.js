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
import {
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  Snackbar,
  Typography,
} from "@mui/material";
import CommentIcon from "@mui/icons-material/Comment";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useUserAuth } from "../../../Context/UserAuthContext";

const BookingTutor = () => {
  const { user, userDetails } = useUserAuth();
  const [userBookings, setUserBookings] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const HeaderStyle = {
    color: "#66fcf1",
    fontSize: 16,
  };

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",

    "&:hover": {
      color: "#0b0c10",
      backgroundColor: "#c5c6c7",
    },
  };

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
        });
        setSnackBarOpen(true);
        setMessage("Rejected Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const getClassCode = async (subject, grade) => {
    var classCode = "";
    const q = query(
      collection(db, "createdClasses"),
      where("subject", "==", subject),
      where("grade", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      classCode = doc.id;
    });
    return classCode;
  };

  const addToClass = async (
    bookingId,
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
      try {
        getClassCode(subject, grade).then((classCode) => {
          const joinedRef = collection(db, "joinedClasses");
          setDoc(doc(joinedRef), {
            classCode: classCode,
            subject: subject,
            grade: grade,
            day: day,
            time: time,

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
          const bookingsRef = doc(db, "bookings", bookingId);
          updateDoc(bookingsRef, {
            status: "Joined",
          });
          setSnackBarOpen(true);
          setMessage("Added to Class");
        });
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  //reading all tutors details
  useEffect(() => {
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
      }
    );
  }, []);

  return (
    <>
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
                        sx={{ position: "relative", top: 8, color: "#66fcf1" }}
                      />
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        );
      })}

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
