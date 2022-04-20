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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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

  return (
    <>
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
                    {bookings.studentFirstName + " " + bookings.studentLastName}
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
                          bookings.studentFirstName,
                          bookings.studentLastName,
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
