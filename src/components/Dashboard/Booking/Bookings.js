import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { Logo } from "../../GlobalStyles";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { Image } from "./BookingElements";

const Bookings = () => {
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

  //reading all tutors details
  useEffect(() => {
    var q = "";
    if (userDetails?.accountType === "Student") {
      const unsubscribe = onSnapshot(
        query(collection(db, "bookings"), where("userId", "==", user.uid)),
        (querySnapshot) => {
          const bookingsData = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          setUserBookings(bookingsData);
        }
      );
    }

    if (userDetails?.accountType === "Tutor") {
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
    }
  }, []);

  const deleteBookingStudent = async (bookingId) => {
    let confirmAction = window.confirm("Are you sure to delete this booking?");
    if (confirmAction) {
      try {
        await deleteDoc(doc(db, "bookings", bookingId));
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
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
    email,
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
            title: userDetails?.title,
            firstName: userDetails?.name.firstName,
            lastName: userDetails?.name.lastName,
            profilePic: userDetails?.profilePic,
            userUid: user.uid,
            subject: subject,
            grade: grade,
            studentEmail: email,
            classCode: classCode,
            studentFirstName: studentFirstName,
            studentLastName: studentLastName,
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

  return (
    <>
      <Box>
        <Logo
          to="/dashboard/classes"
          style={{ position: "absolute", color: "#fff" }}
        >
          Tutorhuntz
        </Logo>
        <Image
          src="https://www.incimages.com/uploaded_files/image/1920x1080/getty_509646667_126517.jpg"
          alt="bannerImg"
        />
      </Box>

      {userDetails?.accountType === "Student" && (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 5, mt: 1 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#1f2833",
                fontWeight: "bold",
              }}
            >
              <TableRow>
                <TableCell style={HeaderStyle}>Subject</TableCell>
                <TableCell style={HeaderStyle}>Grade</TableCell>
                <TableCell style={HeaderStyle} sx={{ textAlign: "center" }}>
                  Status
                </TableCell>
                <TableCell style={HeaderStyle}>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userBookings.map((bookings, index) => {
                return (
                  <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                    <TableCell>{bookings.subject}</TableCell>
                    <TableCell>{bookings.grade}</TableCell>
                    <TableCell sx={{ textAlign: "center" }}>
                      <Typography
                        sx={{
                          backgroundColor: "#4f4f4f",
                          padding: "4px",
                          borderRadius: 8,
                          color: "#fff",
                        }}
                      >
                        {bookings.status}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={{ color: "red" }}
                        onClick={() => {
                          deleteBookingStudent(bookings.id);
                        }}
                      >
                        <CloseIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Tutor Display */}
      {userDetails?.accountType === "Tutor" && (
        <TableContainer
          component={Paper}
          sx={{ borderRadius: 2, boxShadow: 5, mt: 1 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#1f2833",
                fontWeight: "bold",
              }}
            >
              <TableRow>
                <TableCell style={HeaderStyle}>Name</TableCell>
                <TableCell style={HeaderStyle}>Email</TableCell>
                <TableCell style={HeaderStyle}>Subject</TableCell>
                <TableCell style={HeaderStyle}>Grade</TableCell>
                <TableCell style={HeaderStyle}>Add to class</TableCell>
                <TableCell style={HeaderStyle}>Reject</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userBookings.map((bookings, index) => {
                return (
                  <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                    <TableCell>
                      {bookings.firstName + " " + bookings.lastName}
                    </TableCell>
                    <TableCell>
                      <a
                        href={"mailto: " + bookings.studentEmail}
                        style={LinkStyles}
                      >
                        {bookings.studentEmail}
                      </a>
                    </TableCell>
                    <TableCell>{bookings.subject}</TableCell>
                    <TableCell>{bookings.grade}</TableCell>
                    <TableCell>
                      <Button
                        sx={{ color: "green" }}
                        onClick={() => {
                          addToClass(
                            bookings.id,
                            bookings.subject,
                            bookings.grade,
                            bookings.studentEmail,
                            bookings.firstName,
                            bookings.lastName,
                            bookings.studentProfilePic
                          );
                        }}
                      >
                        <AddIcon />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={{ color: "red" }}
                        onClick={() => {
                          deleteBookingTutor(bookings.id);
                        }}
                      >
                        <CloseIcon />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
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

export default Bookings;
