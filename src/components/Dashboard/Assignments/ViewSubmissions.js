import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
} from "@mui/material";
import { db } from "../../../firebase-config";
import {
  doc,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  getDocs,
} from "firebase/firestore";

const ViewSubmissions = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { assignmentId } = location.state;
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [joinedUsers, setJoinedUsers] = useState([]);

  const HeaderStyle = {
    color: "#66fcf1",
    fontSize: 16,
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

  // reading all submitted assignments
  useEffect(() => {
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("assignmentCode", "==", assignmentId)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSubmittedAssignments(data);
    });
  }, []);

  var emailsArray = [];

  if (joinedUsers && submittedAssignments) {
    {
      joinedUsers.map((value) => {
        {
          submittedAssignments.map((val) => {
            if (value.studentEmail !== val.studentEmail) {
              emailsArray.push(value.studentEmail);
            }
          });
        }
      });
    }
  }

  //   list all users in that class
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
      {
        setJoinedUsers(data);
      }
    });
  }, []);

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 5, mt: 2 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: "#1f2833",
              fontWeight: "bold",
            }}
          >
            <TableRow>
              <TableCell style={HeaderStyle}></TableCell>
              <TableCell style={HeaderStyle}>Student Name</TableCell>
              <TableCell style={HeaderStyle}>Student Email</TableCell>
              <TableCell style={HeaderStyle}>View Submitted Files</TableCell>
              <TableCell style={HeaderStyle}>Submission Status</TableCell>
              <TableCell style={HeaderStyle}>Add marks</TableCell>
              <TableCell style={HeaderStyle}>Delete marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submittedAssignments.map((submittedAssignment, index) => {
              return (
                <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {submittedAssignment.studentFirstName +
                      " " +
                      submittedAssignment.studentlastName}
                  </TableCell>
                  <TableCell>{submittedAssignment.studentEmail}</TableCell>
                  <TableCell>
                    {submittedAssignment.submittedFileName.map(
                      (fileName, index) => {
                        return (
                          <Box key={index}>
                            <a
                              href={submittedAssignment.submittedFileUrl[index]}
                              target={"blank"}
                              style={LinkStyles}
                            >
                              {fileName}
                            </a>
                          </Box>
                        );
                      }
                    )}
                  </TableCell>
                  <TableCell>{submittedAssignment.status}</TableCell>
                  <TableCell>
                    <Button
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#c5c6c7",
                            color: "#000",
                          },
                          backgroundColor: "#45a29e",
                          color: "#fff",
                        },
                      ]}
                    >
                      Add
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#c5c6c7",
                            color: "#000",
                          },
                          backgroundColor: "red",
                          color: "#fff",
                        },
                      ]}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/*  Users */}

      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 5, mt: 2 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: "#1f2833",
              fontWeight: "bold",
            }}
          >
            <TableRow>
              <TableCell style={HeaderStyle}></TableCell>
              <TableCell style={HeaderStyle}>Student Name</TableCell>
              <TableCell style={HeaderStyle}>Student Email</TableCell>
              <TableCell style={HeaderStyle}>View Submitted Files</TableCell>
              <TableCell style={HeaderStyle}>Submission Status</TableCell>
              <TableCell style={HeaderStyle}>Add marks</TableCell>
              <TableCell style={HeaderStyle}>Delete marks</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {joinedUsers
              .filter((joinedUser) => {
                {
                  if (emailsArray.includes(joinedUser.studentEmail)) {
                    return joinedUser;
                  }
                }
              })
              .map((joinedUser, index) => {
                return (
                  <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {joinedUser.studentFirstName +
                        " " +
                        joinedUser.studentLastName}
                    </TableCell>
                    <TableCell>{joinedUser.studentEmail}</TableCell>
                    <TableCell>Null</TableCell>
                    <TableCell>Null</TableCell>
                    <TableCell>
                      <Button
                        sx={[
                          {
                            "&:hover": {
                              backgroundColor: "#c5c6c7",
                              color: "#000",
                            },
                            backgroundColor: "#45a29e",
                            color: "#fff",
                          },
                        ]}
                      >
                        Add
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        sx={[
                          {
                            "&:hover": {
                              backgroundColor: "#c5c6c7",
                              color: "#000",
                            },
                            backgroundColor: "red",
                            color: "#fff",
                          },
                        ]}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ViewSubmissions;
