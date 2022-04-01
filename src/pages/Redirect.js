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
import FormClasses from "../components/Dashboard/FormClasses/FormClasses";

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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute>
                <Classes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Chats"
            element={
              <ProtectedRoute>
                <Chats />
              </ProtectedRoute>
            }
          />
          <Route
            path="/videocall"
            element={
              <ProtectedRoute>
                <Videocall />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formclasses"
            element={
              <ProtectedRoute>
                <FormClasses />
              </ProtectedRoute>
            }
          />

          {/* Test routes */}
          <Route path="/insert" element={<Insert />} />
          <Route path="/read" element={<Read />} />
        </Routes>
      </UserAuthContextProvider>
    </>
  );
};

export default Redirect;
