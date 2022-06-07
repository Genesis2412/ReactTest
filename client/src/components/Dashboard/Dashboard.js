import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "./Drawer/Drawer";
import Classes from "./Classes/Classes";
import ClassDetails from "./Classes/ClassDetails";
import Chats from "./Chats/Chats";
import Videocall from "./Videocall/Videocall";
import Notifications from "./Notifications/Notifications";
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

const Dashboard = () => {
  const { user, setUserDetails, setBookingCount, bookingCount } = useUserAuth();
  const [showLoader, setShowLoader] = useState(true);

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
        <Box sx={{ display: "flex" }}>
          <Drawer />
          <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
          >
            <Routes>
              <Route path="viewprofile" element={<ViewProfile />} />
              <Route path="classes" element={<Classes />} />
              <Route path="classesdetails/*" element={<ClassDetails />} />
              <Route path="chats" element={<Chats />} />
              <Route path="videocall" element={<Videocall />} />
              <Route path="notifications" element={<Notifications />} />
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
      )}
    </>
  );
};

export default Dashboard;
