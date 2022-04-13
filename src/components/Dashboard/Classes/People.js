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
} from "firebase/firestore";
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Avatar,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { PeopleViewIcon } from ".././../GlobalStyles";
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
      deleteDoc(doc(db, "joinedClasses", personId))
        .then(() => {
          deleteUserSubmission(studentEmail)
            .then(() => {
              setSnackBarOpen(true);
              setMessage(firstName + " " + lastName + " removed from class");
            })
            .catch((err) => {
              setSnackBarOpen(true);
              setMessage(
                firstName +
                  " " +
                  lastName +
                  " could not removed from class ,please try again"
              );
            });
        })
        .catch((err) => {
          setSnackBarOpen(true);
          setMessage(
            firstName +
              " " +
              lastName +
              " could not removed from class ,please try again"
          );
        });
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
      where("classCode", "==", classCode)
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
        <Box>
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 2,
              boxShadow: 5,
              mt: 2,
            }}
          >
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                sx={{
                  backgroundColor: "#BCBCBC",
                  fontWeight: "bold",
                }}
              >
                <TableRow>
                  <TableCell style={headerStyles}>Name</TableCell>
                  <TableCell style={headerStyles}>Email</TableCell>
                  <TableCell style={headerStyles}>Chat</TableCell>
                  {userDetails?.accountType === "Tutor" && (
                    <>
                      <TableCell style={headerStyles}>Remove</TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody
                sx={{
                  backgroundColor: "#D7D7D7",
                  fontWeight: "bold",
                }}
              >
                {persons.map((person, index) => {
                  return (
                    <TableRow key={index}>
                      <TableCell style={bodyStyle}>
                        <Avatar
                          sx={{ backgroundColor: "orange" }}
                          alt={person.studentLastName}
                          src="/broken-image.jpg"
                        />
                        {person.studentFirstName + " " + person.studentLastName}
                      </TableCell>
                      <TableCell style={bodyStyle}>
                        <a
                          href={"mailto:" + person.studentEmail}
                          style={LinkStyles}
                        >
                          {person.studentEmail}
                        </a>
                      </TableCell>
                      <TableCell style={bodyStyle}>
                        <Link to="/dashboard/chats" style={LinkStyles}>
                          <ChatIcon />
                        </Link>
                      </TableCell>

                      {userDetails.accountType === "Tutor" && (
                        <>
                          <TableCell style={bodyStyle}>
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
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
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
