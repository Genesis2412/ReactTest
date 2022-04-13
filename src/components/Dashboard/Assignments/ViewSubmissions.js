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
import { ViewSubmissionsImg } from "../../GlobalStyles";
import ViewSubmissionIcon from "../../../images/ViewSubmissionIcon.svg";

const ViewSubmissions = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { assignmentId } = location.state;
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

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

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const addMarks = async (submittedId, firstName, lastName) => {
    let marks = prompt("Please enter marks for " + firstName + " " + lastName);
    let updatedMarks = marks.toString();

    if (updatedMarks != null) {
      try {
        const marksRef = doc(db, "submittedAssignments", submittedId);
        await updateDoc(marksRef, {
          marks: updatedMarks,
        });
        setSnackBarOpen(true);
        setMessage("Marks added successfully");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const deleteMarks = async (submittedId, firstName, lastName) => {
    let confirmAction = window.confirm(
      "Are you sure to delete marks of " + firstName + " " + lastName + "?"
    );

    if (confirmAction) {
      try {
        const marksRef = doc(db, "submittedAssignments", submittedId);
        await updateDoc(marksRef, {
          marks: "",
        });
        setSnackBarOpen(true);
        setMessage("Marks deleted successfully");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
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

  if (submittedAssignments.length !== 0) {
    return (
      <>
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
                  <TableCell style={HeaderStyle}>
                    View Submitted Files
                  </TableCell>
                  <TableCell style={HeaderStyle}>Submission Status</TableCell>
                  <TableCell style={HeaderStyle}>Marks</TableCell>
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
                      <TableCell>
                        <a
                          href={"mailto:" + submittedAssignment.studentEmail}
                          style={LinkStyles}
                        >
                          {submittedAssignment.studentEmail}
                        </a>
                      </TableCell>
                      <TableCell>
                        {submittedAssignment.submittedFileName.map(
                          (fileName, index) => {
                            return (
                              <Box key={index}>
                                <a
                                  href={
                                    submittedAssignment.submittedFileUrl[index]
                                  }
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
                      <TableCell>
                        {submittedAssignment.status === "Not Submitted" && (
                          <Typography sx={{ color: "#8C0800" }}>
                            {submittedAssignment.status}
                          </Typography>
                        )}

                        {submittedAssignment.status === "Late" && (
                          <Typography sx={{ color: "#E98600" }}>
                            {submittedAssignment.status}
                          </Typography>
                        )}
                        {submittedAssignment.status === "On time" && (
                          <Typography sx={{ color: "#0DB000" }}>
                            {submittedAssignment.status}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {submittedAssignment.marks
                          ? submittedAssignment.marks
                          : "Null"}
                      </TableCell>
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
                          onClick={() => {
                            addMarks(
                              submittedAssignment.id,
                              submittedAssignment.studentFirstName,
                              submittedAssignment.studentlastName
                            );
                          }}
                        >
                          Add/ Update
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
                          onClick={() => {
                            deleteMarks(
                              submittedAssignment.id,
                              submittedAssignment.studentFirstName,
                              submittedAssignment.studentlastName
                            );
                          }}
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
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <ViewSubmissionsImg src={ViewSubmissionIcon} alt="icon" />
        <Typography>No Submissions yet</Typography>
      </Box>
    );
  }
};

export default ViewSubmissions;
