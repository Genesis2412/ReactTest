import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Grid,
} from "@mui/material";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  where,
  query,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { ViewSubmissionsImg } from "../../GlobalStyles";
import ViewSubmissionIcon from "../../../images/ViewSubmissionIcon.svg";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const ViewSubmissions = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { assignmentId } = location.state;
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const HeaderStyle = {
    color: "#5B5EA6",
    fontSize: 16,
    fontWeight: "bold",
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
    setShowLoader(true);
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
      setShowLoader(false);
    });
  }, []);

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {!showLoader && submittedAssignments.length !== 0 && (
        <Box>
          <Paper sx={{ mt: 1, p: 1, boxShadow: 2 }}>
            {submittedAssignments.map((submittedAssignment, index) => {
              return (
                <Grid
                  container
                  spacing={2}
                  key={index}
                  sx={{ textAlign: "center" }}
                >
                  <Grid item md={1} xs={12}>
                    <Typography sx={{ fontStyle: "italic" }}>
                      {submittedAssignment.studentFirstName +
                        " " +
                        submittedAssignment.studentLastName}
                    </Typography>
                  </Grid>

                  <Grid item md={2} xs={6}>
                    <Typography style={HeaderStyle}>Submitted Files</Typography>
                    {submittedAssignment.submittedFileName.map(
                      (fileName, key) => {
                        if (fileName) {
                          return (
                            <Box key={key}>
                              <Typography>
                                <a
                                  href={
                                    submittedAssignment.submittedFileUrl[index]
                                  }
                                  target={"blank"}
                                >
                                  {fileName}
                                </a>
                              </Typography>
                            </Box>
                          );
                        }
                      }
                    )}
                  </Grid>

                  <Grid item md={2} xs={6}>
                    <Typography style={HeaderStyle}>
                      Submission Status
                    </Typography>
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
                  </Grid>

                  <Grid item md={1} xs={6}>
                    <Typography style={HeaderStyle}>Marks</Typography>
                    <Typography>
                      {submittedAssignment.marks
                        ? submittedAssignment.marks
                        : "Not yet posted"}
                    </Typography>
                  </Grid>

                  <Grid item md={2} xs={6}>
                    <Typography style={HeaderStyle}>Remarks</Typography>
                    <Typography>
                      {submittedAssignment.remarks
                        ? submittedAssignment.remarks
                        : "Not yet posted"}
                    </Typography>
                  </Grid>

                  <Grid item md={2} xs={12}>
                    <Typography style={HeaderStyle}>Correction</Typography>

                    <Typography>
                      {submittedAssignment.remarks
                        ? submittedAssignment.remarks
                        : "No files posted"}
                    </Typography>
                  </Grid>

                  <Grid item md={2} xs={12}>
                    <Button
                      size={"small"}
                      sx={[
                        {
                          "&:hover": {
                            backgroundColor: "#c5c6c7",
                            color: "#0b0c10",
                          },
                          backgroundColor: "#45a29e",
                          color: "#fff",
                        },
                      ]}
                    >
                      Add marks/ remarks/ corrected files
                    </Button>
                  </Grid>
                </Grid>
              );
            })}
          </Paper>
        </Box>
      )}

      {!showLoader && submittedAssignments.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <ViewSubmissionsImg src={ViewSubmissionIcon} alt="icon" />
          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              fontFamily: "Montserrat",
              fontSize: 19,
            }}
          >
            No assignment submitted
          </Typography>
          <Typography
            sx={{
              textAlign: "center",
              fontFamily: "Montserrat",
              fontSize: 16,
            }}
          >
            No student available in class
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default ViewSubmissions;
