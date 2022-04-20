import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  doc,
  deleteDoc,
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
  Snackbar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useUserAuth } from "../../../Context/UserAuthContext";

const BookingStudent = () => {
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bookings"),
        where("studentEmail", "==", userDetails?.email)
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
                    {bookings.status !== "Joined" && (
                      <Button
                        sx={{ color: "red" }}
                        onClick={() => {
                          deleteBookingStudent(bookings.id);
                        }}
                      >
                        <CloseIcon />
                      </Button>
                    )}
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

export default BookingStudent;
