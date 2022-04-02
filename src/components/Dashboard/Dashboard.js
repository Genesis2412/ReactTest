import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "./Drawer/Drawer";
import Paper from "@mui/material/Paper";
import Classes from "./Classes/Classes";
import Chats from "./Chats/Chats";
import Videocall from "./Videocall/Videocall";
import Notifications from "./Notifications/Notifications";
import CreateClass from "./Forms/CreateClass";

import { useUserAuth } from "../../Context/UserAuthContext";
import { db } from "../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const Dashboard = () => {
  const { user, setUserDetails } = useUserAuth();

  //getting all user details
  useEffect(() => {
    const getUserDetails = async () => {
      if (user.uid) {
        const tutorRef = doc(db, "tutors", user?.uid);
        const tutorSnap = await getDoc(tutorRef);
        if (tutorSnap.exists()) {
          setUserDetails(tutorSnap.data());
        } else {
          const studentRef = doc(db, "students", user.uid);
          const studentSnap = await getDoc(studentRef);
          if (studentSnap.exists()) {
            setUserDetails(studentSnap.data());
          } else {
            return;
          }
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
            <Route path="classes" element={<Classes />} />
            <Route path="chats" element={<Chats />} />
            <Route path="videocall" element={<Videocall />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="create" element={<CreateClass />} />
          </Routes>
        </Box>
      </Box>
      {/* </div> */}
    </>
  );
};

export default Dashboard;
