import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "../Context/UserAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Landing from "../pages/Home";
import Dashboard from "../components/Dashboard/Dashboard";

// Testing
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

          {/* Test routes */}
          <Route path="/insert" element={<Insert />} />
          <Route path="/read" element={<Read />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </UserAuthContextProvider>
    </>
  );
};

export default Redirect;
