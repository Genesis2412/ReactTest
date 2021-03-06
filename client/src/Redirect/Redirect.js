import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "../Context/UserAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import Home from "../components/Hero/Home";
import ErrorPage from "../components/ErrorPage/ErrorPage";

const Redirect = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </UserAuthContextProvider>
    </>
  );
};

export default Redirect;
