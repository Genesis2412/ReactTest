import React from "react";
import DeleteTutorProfile from "./DeleteTutorProfile";
import DeleteStudentProfile from "./DeleteStudentProfile";
import { useUserAuth } from "../../../Context/UserAuthContext";

const DeleteProfile = () => {
  const { userDetails } = useUserAuth();

  return (
    <>
      {userDetails?.accountType === "Tutor" && <DeleteTutorProfile />}
      {userDetails?.accountType === "Student" && <DeleteStudentProfile />}
    </>
  );
};

export default DeleteProfile;
