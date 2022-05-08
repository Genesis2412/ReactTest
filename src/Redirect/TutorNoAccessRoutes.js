import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../Context/UserAuthContext";

const TutorNoAccessRoutes = ({ children }) => {
  let { user, userDetails } = useUserAuth();

  if (user && userDetails?.accountType === "Tutor") {
    return <Navigate to="/error" />;
  }
  return children;
};

export default TutorNoAccessRoutes;
