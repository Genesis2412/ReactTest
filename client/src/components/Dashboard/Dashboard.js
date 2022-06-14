import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import { Box, Paper, Typography, Button, Snackbar } from "@mui/material";
import Drawer from "./Drawer/Drawer";
import Classes from "./Classes/Classes";
import ClassDetails from "./Classes/ClassDetails";
import Chats from "./Chats/Chats";
import Videocall from "./Videocall/Videocall";
import Tutors from "./TutorProfiles/Tutors";
import TutorProfile from "./TutorProfiles/TutorProfile";
import Bookings from "./Booking/Bookings";
import ViewSubmissions from "./Assignments/ViewSubmissions";
import { useUserAuth } from "../../Context/UserAuthContext";
import ViewProfile from "./ViewProfile/ViewProfile";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  onSnapshot,
  collection,
  query,
  where,
} from "firebase/firestore";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { motion } from "framer-motion";

const Dashboard = () => {
  const { user, setUserDetails, userDetails, setBookingCount, verifyEmail } =
    useUserAuth();
  const [showLoader, setShowLoader] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const verifyUserEmail = async () => {
    try {
      verifyEmail(user);
      setSnackBarOpen(true);
      setMessage("A verification has been sent to your email.");
    } catch (error) {
      console.log("An error occurred");
    }
  };

  //getting all user details
  useEffect(() => {
    const getUserDetails = async () => {
      setShowLoader(true);
      if (user.uid) {
        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (studentSnap.exists()) {
          const unsub = onSnapshot(doc(db, "students", user.uid), (doc) => {
            if (doc) {
              setUserDetails(doc.data());
              localStorage.setItem(
                "userStorageDetails",
                JSON.stringify(doc.data())
              );
              getStudentBookings(doc.data().email);
            }
            setShowLoader(false);
          });
        } else {
          const unsub = onSnapshot(doc(db, "tutors", user.uid), async (doc) => {
            if (doc) {
              setUserDetails(doc.data());
              localStorage.setItem(
                "userStorageDetails",
                JSON.stringify(doc.data())
              );
              getTutorBookings(doc.data().email);
            }
            setShowLoader(false);
          });
        }
      }
    };
    getUserDetails();
  }, []);

  // get all bookings
  const getTutorBookings = async (tutorEmail) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bookings"),
        where("tutorEmail", "==", tutorEmail),
        where("status", "==", "Pending")
      ),
      (querySnapshot) => {
        setBookingCount(querySnapshot.docs.length);
      }
    );
  };

  const getStudentBookings = async (studentEmail) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, "bookings"),
        where("studentEmail", "==", studentEmail)
      ),

      (querySnapshot) => {
        var count = 0;

        querySnapshot.docs.map((doc) => {
          if (
            doc.data()?.tutorUpdated === "Yes" &&
            doc.data()?.status === "Rejected"
          ) {
            count++;
          }
        });
        setBookingCount(count);
      }
    );
  };

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {!showLoader && (
        <>
          <Box sx={{ display: "flex" }}>
            <Drawer />
            <Box
              component="main"
              sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
            >
              {user?.emailVerified === false && (
                <Box
                  as={motion.div}
                  animate={{
                    y: [4, 0, 4],
                    transition: {
                      duration: 2,
                      ease: "linear",
                      repeat: "Infinity",
                    },
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      textAlign: "center",
                      backgroundColor: "#FFCC00",
                    }}
                  >
                    <Typography>
                      Please verify your email.
                      <Button
                        size="small"
                        sx={[
                          {
                            "&:hover": {
                              backgroundColor: "#c5c6c7",
                              color: "#000",
                            },
                            backgroundColor: "#45a29e",
                            color: "#fff",
                            ml: 2,
                          },
                        ]}
                        onClick={() => {
                          verifyUserEmail();
                        }}
                      >
                        Verify Here
                      </Button>
                    </Typography>
                  </Paper>
                </Box>
              )}

              {userDetails?.profilePic === "" && (
                <Box
                  as={motion.div}
                  animate={{
                    y: [4, 0, 4],
                    transition: {
                      duration: 2,
                      ease: "linear",
                      repeat: "Infinity",
                    },
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      mb: 2,
                      textAlign: "center",
                      backgroundColor: "#FFCC00",
                    }}
                  >
                    <Typography>
                      Please upload your face as your profile picture
                      <Link
                        to="/dashboard/viewprofile"
                        style={{ textDecoration: "none" }}
                      >
                        <Button
                          size="small"
                          sx={[
                            {
                              "&:hover": {
                                backgroundColor: "#c5c6c7",
                                color: "#000",
                              },
                              backgroundColor: "#45a29e",
                              color: "#fff",
                              ml: 2,
                            },
                          ]}
                        >
                          Click Here
                        </Button>
                      </Link>
                    </Typography>
                  </Paper>
                </Box>
              )}
              <Routes>
                <Route path="viewprofile" element={<ViewProfile />} />
                <Route path="classes" element={<Classes />} />
                <Route path="classesdetails/*" element={<ClassDetails />} />
                <Route path="chats" element={<Chats />} />
                <Route path="videocall" element={<Videocall />} />
                <Route path="tutors/*" element={<Tutors />} />
                <Route path="tutors/tutor" element={<TutorProfile />} />
                <Route path="bookings" element={<Bookings />} />
                <Route
                  path="classesdetails/assignments/viewsubmissions"
                  element={<ViewSubmissions />}
                />
              </Routes>
            </Box>
          </Box>
        </>
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

export default Dashboard;
