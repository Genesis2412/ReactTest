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
import { Box, Paper, Button, Typography, Snackbar } from "@mui/material";
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

  return (
    <>
      {userBookings?.map((bookings, key) => {
        return (
          <Box sx={{ mt: 2 }} key={key}>
            <Paper sx={{ p: 2, backgroundColor: "#1f2833", color: "#fff" }}>
              <Box sx={{ float: "right" }}>
                {bookings.status !== "Joined" && (
                  <Button
                    sx={[
                      {
                        "&:hover": {
                          backgroundColor: "#45a29e",
                        },
                        backgroundColor: "#fff",
                        color: "red",
                      },
                    ]}
                    size={"small"}
                    onClick={() => {
                      deleteBookingStudent(bookings.id);
                    }}
                  >
                    <CloseIcon />
                  </Button>
                )}
              </Box>
              <Typography>
                You have scheduled a{" "}
                <span style={{ color: "#45a29e" }}>
                  Grade {bookings?.grade + " " + bookings?.subject}
                </span>{" "}
                class on{" "}
                <span style={{ color: "#45a29e" }}>{bookings?.day}</span> at{" "}
                <span style={{ color: "#45a29e" }}>{bookings?.time}</span>.
              </Typography>
              <Typography>
                Status of booking:{" "}
                <span style={{ color: "#66fcf1" }}>{bookings.status}</span>
              </Typography>
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

export default BookingStudent;
