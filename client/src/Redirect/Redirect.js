import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserAuthContextProvider } from "../Context/UserAuthContext";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../components/Login/Login";
import Register from "../components/Register/Register";
import Dashboard from "../components/Dashboard/Dashboard";
import HeroMain from "../components/Hero/HeroMain";
import HeroSection from "../components/Hero/HeroSelection";
import HeroStudent from "../components/Hero/HeroStudent";
import HeroTutor from "../components/Hero/HeroTutor";

// Testing
import Insert from "../components/Test/Insert";
import Read from "../components/Test/Read";
import ErrorPage from "../components/ErrorPage";

const Redirect = () => {
  return (
    <>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<HeroMain />} />
          <Route path="/select" element={<HeroSection />} />
          <Route path="/forstudent" element={<HeroStudent />} />
          <Route path="/fortutor" element={<HeroTutor />} />

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

          {/* Test routes */}
          <Route path="/insert" element={<Insert />} />
          <Route path="/read" element={<Read />} />
          <Route path="/error" element={<ErrorPage />} />
        </Routes>
      </UserAuthContextProvider>
    </>
  );
};

export default Redirect;
