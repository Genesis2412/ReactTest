import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  where,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  Box,
  Paper,
  Button,
  Grid,
  Snackbar,
  Avatar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { PeopleViewIcon } from "../../GlobalStyles";
import PeopleEmptyIcon from "../../../images/PeopleEmptyIcon.svg";

const People = () => {
  const [persons, setPersons] = useState([]);
  const location = useLocation();
  const { classCode } = location.state;
  const { userDetails } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const headerStyles = {
    color: "#000",
    fontSize: 16,
    textAlign: "center",
    border: "1px solid #fff",
  };

  const bodyStyle = {
    textAlign: "center",
    border: "1px solid #fff",
  };

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",

    "&:hover": {
      color: "#0b0c10",
      backgroundColor: "#c5c6c7",
    },
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const deleteStudent = async (personId, firstName, lastName, studentEmail) => {
    let confirmAction = window.confirm(
      "Are you sure to remove " + firstName + " " + lastName + "?"
    );
    if (confirmAction) {
      try {
        await deleteDoc(doc(db, "joinedClasses", personId));
        await deleteUserSubmission(studentEmail);
        setSnackBarOpen(true);
        setMessage(firstName + " " + lastName + " removed from class");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const deleteUserSubmission = async (studentEmail) => {
    var studentAssignmentsIds = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("studentEmail", "==", studentEmail)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      studentAssignmentsIds.push(doc.id);
    });

    {
      studentAssignmentsIds.map((studentAssignmentsId) => {
        deleteDoc(doc(db, "submittedAssignments", studentAssignmentsId));
      });
    }
  };

  useEffect(() => {
    const q = query(
      collection(db, "joinedClasses"),
      where("classCode", "==", classCode),
      orderBy("studentLastName")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPersons(data);
    });
  }, []);

  if (persons.length !== 0) {
    return (
      <>
        <Box sx={{ mt: 4, ml: 1 }}>
          <Grid container spacing={1}>
            {persons?.map((person, key) => {
              return (
                <Grid
                  item
                  xs={12}
                  md={3}
                  key={key}
                  sx={{
                    p: 1,
                    borderRadius: 3,
                    boxShadow: 10,
                  }}
                >
                  {userDetails.accountType === "Tutor" && (
                    <Box sx={{ float: "right" }}>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        onClick={() => {
                          deleteStudent(
                            person.id,
                            person.studentFirstName,
                            person.studentLastName,
                            person.studentEmail
                          );
                        }}
                      >
                        <DeleteSweepIcon />
                      </Button>
                    </Box>
                  )}

                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 4 }}
                  >
                    <Avatar
                      sx={{ backgroundColor: "orange", height: 60, width: 60 }}
                      alt={person?.studentLastName}
                      src={person?.studentProfilePic}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      {person?.studentFirstName + " " + person?.studentLastName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      <a
                        href={"mailto:" + person?.studentEmail}
                        style={LinkStyles}
                      >
                        {person?.studentEmail}
                      </a>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      Chat:
                      <Link to="/dashboard/chats" style={LinkStyles}>
                        <ChatIcon
                          sx={{ position: "relative", top: 7, left: 2 }}
                        />
                      </Link>
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        <Snackbar
          open={snackBarOpen}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        />
      </>
    );
  } else {
    return (
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <PeopleViewIcon src={PeopleEmptyIcon} alt="icon" />
        <Typography>No one in Class</Typography>
      </Box>
    );
  }
};

export default People;
