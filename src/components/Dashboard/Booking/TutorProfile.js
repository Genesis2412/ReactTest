import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  where,
  addDoc,
  serverTimestamp,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { useLocation } from "react-router-dom";
import { Grid, Box, Paper, Avatar, Typography, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Logo } from "../../GlobalStyles";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { Link } from "react-router-dom";

const BookingOne = () => {
  const location = useLocation();
  const { email } = location.state;
  const [profiles, setProfiles] = useState([]);

  const { user, userDetails } = useUserAuth();

  //Styling

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",

    "&:hover": {
      color: "#0b0c10",
      backgroundColor: "#c5c6c7",
    },
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

  //check if booking exist
  const checkBooking = async (tutorEmail, classSubject, classGrade) => {
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      where("tutorEmail", "==", tutorEmail),
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

  const addBooking = async (tutorEmail, classSubject, classGrade) => {
    const d = new Date();
    let confirmAction = window.confirm(
      "Are you sure to do booking for " +
        "" +
        classSubject +
        ", Grade " +
        classGrade +
        "?"
    );
    if (confirmAction) {
      checkBooking(tutorEmail, classSubject, classGrade).then((value) => {
        if (value === true) {
          try {
            const docRef = addDoc(collection(db, "bookings"), {
              tutorEmail: tutorEmail,
              userId: user.uid,
              subject: classSubject,
              grade: classGrade,
              dateOfBooking: serverTimestamp(),
              status: "Pending",
              firstName: userDetails?.name?.firstName,
              lastName: userDetails?.name?.lastName,
            });
            alert("Booked Successfully");
          } catch (err) {
            alert(err);
          }
        } else {
          alert(
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

      {profiles.map((profile) => {
        return (
          <Box key={profile?.email} mt={5}>
            <Grid container spacing={4}>
              <Grid item md={4} xs={12}>
                <Avatar
                  sx={{
                    width: 250,
                    height: 250,
                    position: "relative",
                    left: "20%",
                  }}
                />
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
                    {profile?.subjects.map((subject, index) => {
                      return (
                        <Typography
                          sx={{ fontSize: 15, color: "#45a29e" }}
                          key={index}
                        >
                          {subject}
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
                            href={"tel: " + profile.contact.mobileNumber}
                            style={LinkStyles}
                          >
                            {profile.contact.mobileNumber}
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
                      Book Here for your classes
                    </Typography>
                    {profile.subjects.map((subject, index) => {
                      return (
                        <Typography mt={1} key={index}>
                          {subject + ", Grade " + profile.grades[index]}{" "}
                          <Button
                            size="small"
                            sx={[
                              {
                                "&:hover": {
                                  color: "#0b0c10",
                                  backgroundColor: "#c5c6c7",
                                },
                                backgroundColor: "#45a29e",
                                color: "#fff",
                              },
                            ]}
                            onClick={() => {
                              addBooking(email, subject, profile.grades[index]);
                            }}
                          >
                            Book
                          </Button>
                        </Typography>
                      );
                    })}
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      })}
    </>
  );
};

export default BookingOne;
