import React from "react";
import { Navigate } from "react-router-dom";
import { useUserAuth } from "../Context/UserAuthContext";

const ProtectedRoutesRedirect = ({ children }) => {
  let { user } = useUserAuth();

  if (user) {
    return <Navigate to="/dashboard/classes" />;
  }
  return children;
};

export default ProtectedRoutesRedirect;
