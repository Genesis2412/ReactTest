import React from "react";
import ClassesTutor from "./ClassesTutor";
import ClassesStudents from "./ClassesStudents";
import { useUserAuth } from "../../../Context/UserAuthContext";

const Classes = () => {
  const { userDetails } = useUserAuth();
  return (
    <>
      {userDetails.accountType === "Tutor" && <ClassesTutor />}
      {userDetails.accountType === "Student" && <ClassesStudents />}
    </>
  );
};

export default Classes;
