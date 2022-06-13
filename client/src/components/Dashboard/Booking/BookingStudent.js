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
import DeleteIcon from "@mui/icons-material/Delete";
import { useUserAuth } from "../../../Context/UserAuthContext";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import { StudentBookingEmpty } from "../../GlobalStyles";
import StudentBookingBoard from "../../../images/NoExistBanner/StudentBookingBoard.svg";
import { Link } from "react-router-dom";

const BookingStudent = () => {
  const { user, userDetails } = useUserAuth();
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
    setShowLoader(true);
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
                        <DeleteIcon />
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
                    {bookings?.status === "Rejected" ? (
                      <span style={{ color: "#FF3D75" }}>
                        {bookings.status}
                      </span>
                    ) : (
                      <span style={{ color: "#66fcf1" }}>
                        {bookings.status}
                      </span>
                    )}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
        </Box>
      )}

      {!showLoader && userBookings.length === 0 && (
        <Box mt={5}>
          <Box display="flex" justifyContent="center" alignItems="center">
            <StudentBookingEmpty src={StudentBookingBoard} alt={"image"} />
          </Box>

          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              fontFamily: "Montserrat",
              fontSize: 19,
            }}
          >
            No bookings made
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Montserrat",
              fontSize: 16,
            }}
          >
            Book your{" "}
            <Link
              to="/dashboard/tutors"
              style={{ color: "#45a29e", textDecoration: "none" }}
            >
              tutors
            </Link>{" "}
            now!
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

export default BookingStudent;
