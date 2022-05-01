import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  serverTimestamp,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Snackbar,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Logo } from "../../GlobalStyles";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { Link } from "react-router-dom";

const BookingOne = () => {
  const location = useLocation();
  const { email } = location.state;
  const [profiles, setProfiles] = useState([]);
  const [classes, setClasses] = useState([]);
  const { user, userDetails } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  //Styling
  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",
  };

  const btnStyles = {
    backgroundColor: "#45a29e",
    color: "#fff",
    marginTop: 4,
  };

  const typoStyles = {
    fontSize: 15,
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  //reading all tutors details
  useEffect(() => {
    const q = query(collection(db, "tutors"), where("email", "==", email));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newProfiles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfiles(newProfiles);
    });
  }, []);

  //reading all tutors details
  useEffect(() => {
    const q = query(
      collection(db, "createdClasses"),
      where("tutorEmail", "==", email),
      orderBy("subject"),
      orderBy("grade"),
      orderBy("day"),
      orderBy("time")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newClasses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setClasses(newClasses);
    });
  }, []);

  //check if booking exist
  const checkBooking = async (tutorEmail, classSubject, classGrade) => {
    const q = query(
      collection(db, "bookings"),
      where("tutorEmail", "==", tutorEmail),
      where("studentEmail", "==", userDetails?.email),
      where("subject", "==", classSubject),
      where("grade", "==", classGrade)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty === false) {
      return false;
    } else {
      return true;
    }
  };

  const addBooking = async (
    tutorEmail,
    classSubject,
    classGrade,
    classDay,
    classTime
  ) => {
    let confirmAction = window.confirm(
      "Are you sure to book " +
        "" +
        classSubject +
        ", for Grade " +
        classGrade +
        " on " +
        classDay +
        " at " +
        classTime +
        "?"
    );
    if (confirmAction) {
      checkBooking(tutorEmail, classSubject, classGrade).then(async (value) => {
        if (value === true) {
          try {
            await addDoc(collection(db, "bookings"), {
              subject: classSubject,
              grade: classGrade,
              day: classDay,
              time: classTime,
              dateOfBooking: serverTimestamp(),
              status: "Pending",
              studentFirstName: userDetails?.name?.firstName,
              studentLastName: userDetails?.name?.lastName,
              studentEmail: userDetails?.email,
              studentProfilePic: userDetails?.profilePic,
              tutorEmail: tutorEmail,
            });
            setSnackBarOpen(true);
            setMessage("Booked Successfully");
          } catch (err) {
            setSnackBarOpen(true);
            setMessage("An error occurred, please try again");
          }
        } else {
          setSnackBarOpen(true);
          setMessage(
            "You have already booked this tutor, check bookings to check status"
          );
        }
      });
    }
  };

  return (
    <>
      <Typography textAlign={"right"}>
        <Logo
          to="/dashboard/tutors"
          style={{ textAlign: "left", color: "#2f3c7e", fontSize: 30 }}
        >
          Tutorhuntz
        </Logo>
      </Typography>

      {profiles?.map((profile) => {
        return (
          <Box mt={5} key={profile?.email}>
            <Grid container spacing={4}>
              <Grid item md={4} xs={12}>
                <Box display="flex" justifyContent="center" alignItems="center">
                  <Avatar
                    sx={{
                      width: 250,
                      height: 250,
                    }}
                    alt={profile?.name?.firstName}
                    src={profile?.name?.profilePic}
                  />
                </Box>
              </Grid>
              <Grid item md={8} xs={12}>
                <Box>
                  <Paper sx={{ p: 2, boxShadow: 5 }}>
                    <Typography variant="h3" sx={{ fontSize: 18 }}>
                      {profile.title +
                        " " +
                        profile?.name?.firstName +
                        " " +
                        profile?.name?.lastName}
                    </Typography>
                    {classes?.map((availableClass, index) => {
                      return (
                        <Typography
                          sx={{ fontSize: 15, color: "#45a29e" }}
                          key={index}
                        >
                          {availableClass?.subject +
                            ", Grade " +
                            availableClass?.grade}
                        </Typography>
                      );
                    })}
                  </Paper>
                </Box>
                <Box mt={2}>
                  <Paper sx={{ p: 2, boxShadow: 5 }}>
                    <Typography variant="h3" sx={{ fontSize: 18 }}>
                      Description
                    </Typography>
                    <Typography sx={{ fontSize: 15 }}>
                      Hello {userDetails?.name?.firstName}, I enjoy teaching
                      children and watching them grow. I truly believe that
                      teaching should be a fun experience as children learn
                      easily through that way and they will take interest in
                      learning new things as well. Let's go
                    </Typography>
                  </Paper>
                  <Box mt={2}>
                    <Paper sx={{ p: 2, boxShadow: 5 }}>
                      <Typography variant="h3" sx={{ fontSize: 18 }}>
                        Get in contact:
                        <Typography sx={{ fontSize: 15 }}>
                          Call me on:{" "}
                          <a
                            href={"tel: " + profile?.contact?.mobileNumber}
                            style={LinkStyles}
                          >
                            {profile?.contact?.mobileNumber}
                          </a>
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                          Email me on:{" "}
                          <a
                            href={"mailto: " + profile.email}
                            style={LinkStyles}
                          >
                            {profile.email}
                          </a>
                        </Typography>
                        <Typography sx={{ fontSize: 15 }}>
                          Chat with me:{" "}
                          <Link to="/dashboard/chats">
                            <ChatIcon
                              sx={{
                                color: "#45a29e",
                                fontSize: 22,
                                position: "relative",
                                top: 8,
                              }}
                            />
                          </Link>
                        </Typography>
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
                <Box mt={2}>
                  <Paper sx={{ p: 2, boxShadow: 5 }}>
                    <Typography variant="h3" sx={{ fontSize: 18 }}>
                      Book your classes here
                    </Typography>
                    {classes?.map((availableClass, key) => {
                      return (
                        <>
                          <Typography mt={1} key={key}>
                            {availableClass?.subject +
                              ", Grade " +
                              availableClass?.grade}{" "}
                          </Typography>
                          <Grid container item spacing={2}>
                            {availableClass?.day && (
                              <Grid item>
                                <Button
                                  style={btnStyles}
                                  onClick={() => {
                                    addBooking(
                                      profile.email,
                                      availableClass.subject,
                                      availableClass.grade,
                                      availableClass.day,
                                      availableClass.time
                                    );
                                  }}
                                >
                                  <Typography style={typoStyles}>
                                    <>
                                      {availableClass?.day}
                                      <br />
                                      {availableClass?.time}
                                    </>
                                  </Typography>
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </>
                      );
                    })}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
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

export default BookingOne;
