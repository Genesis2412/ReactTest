import React, { useEffect } from "react";
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
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const Dashboard = () => {
  const { user, setUserDetails, userDetails } = useUserAuth();

  //getting all user details
  useEffect(() => {
    const getUserDetails = async () => {
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
            }
          });
        } else {
          const unsub = onSnapshot(doc(db, "tutors", user.uid), (doc) => {
            if (doc) {
              setUserDetails(doc.data());
              localStorage.setItem(
                "userStorageDetails",
                JSON.stringify(doc.data())
              );
            }
          });
        }
      }
    };
    getUserDetails();
  }, []);

  return (
    <>
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
    </>
  );
};

export default Dashboard;
