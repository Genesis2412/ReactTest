import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "../Context/UserAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Landing from "./Home";
import Home from "../components/Dashboard/Home/Home";
import Classes from "../components/Dashboard/Classes/Classes";
import Chats from "../components/Dashboard/Chats/Chats";
import Videocall from "../components/Dashboard/Videocall/Videocall";
import Notifications from "../components/Dashboard/Notifications/Notifications";

// Testing
import Test from "../components/Test/Test";
import Insert from "../components/Test/Insert";
import Read from "../components/Test/Read";

const Redirect = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/test"
            element={
              <ProtectedRoute>
                <Test />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          {/* <AnimatePresence> */}
          <Route path="/dashboard" element={<Home />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/Chats" element={<Chats />} />
          <Route path="/videocall" element={<Videocall />} />
          <Route path="/notifications" element={<Notifications />} />
          {/* </AnimatePresence> */}

          {/* Test routes */}
          <Route path="/insert" element={<Insert />} />
          <Route path="/read" element={<Read />} />
        </Routes>
      </UserAuthContextProvider>
    </>
  );
};

export default Redirect;
