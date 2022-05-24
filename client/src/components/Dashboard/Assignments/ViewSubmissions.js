import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Button,
  Typography,
  Snackbar,
  Grid,
  Modal,
  CircularProgress,
  TextField,
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
import CloseIcon from "@mui/icons-material/Close";

const ViewSubmissions = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { assignmentId } = location.state;
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const [loading, setLoading] = useState(false);
  const [marks, setMarks] = useState("");
  const [remarks, setRemarks] = useState("");
  const [studentId, setStudentId] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => setOpenModal(false);
  const handleCancel = () => {
    setOpenModal(false);
    setMarks("");
    setRemarks("");
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    bgcolor: "rgba(255, 255, 255, 0.8)",
    p: 4,
    borderRadius: 2,
    textAlign: "center",
  };

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

  const addMarks = async (submittedId, marks) => {
    try {
      const marksRef = doc(db, "submittedAssignments", submittedId);
      await updateDoc(marksRef, {
        marks: marks,
      });
      setSnackBarOpen(true);
      setMessage("Marks added successfully");
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const addRemarks = async (submittedId, remarks) => {
    try {
      const marksRef = doc(db, "submittedAssignments", submittedId);
      await updateDoc(marksRef, {
        remarks: remarks,
      });
      setSnackBarOpen(true);
      setMessage("Remarks added successfully");
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
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

  const deleteRemarks = async (submittedId, firstName, lastName) => {
    let confirmAction = window.confirm(
      "Are you sure to delete remarks of " + firstName + " " + lastName + "?"
    );

    if (confirmAction) {
      try {
        const marksRef = doc(db, "submittedAssignments", submittedId);
        await updateDoc(marksRef, {
          remarks: "",
        });
        setSnackBarOpen(true);
        setMessage("Remarks removed successfully");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const updateSubmittedDetails = async () => {
    if (marks.length !== 0) {
      await addMarks(studentId, marks);
    }

    if (remarks.length !== 0) {
      await addRemarks(studentId, remarks);
    }

    handleModalClose();
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
                    {submittedAssignment.marks.length !== 0 && (
                      <Box sx={{ display: "inline-flex" }}>
                        <Typography>{submittedAssignment.marks}</Typography>
                        <CloseIcon
                          sx={{ pl: 2, color: "red", cursor: "pointer" }}
                          onClick={() => {
                            deleteMarks(
                              submittedAssignment.id,
                              submittedAssignment.studentFirstName,
                              submittedAssignment.studentLastName
                            );
                          }}
                        />
                      </Box>
                    )}
                    {submittedAssignment.marks.length === 0 && (
                      <Typography>Not yet posted</Typography>
                    )}
                  </Grid>

                  <Grid item md={2} xs={6}>
                    <Typography style={HeaderStyle}>Remarks</Typography>
                    {submittedAssignment.remarks.length !== 0 && (
                      <Box sx={{ display: "inline-flex" }}>
                        <Typography>{submittedAssignment.remarks}</Typography>
                        <CloseIcon
                          sx={{ pl: 2, color: "red", cursor: "pointer" }}
                          onClick={() => {
                            deleteRemarks(
                              submittedAssignment.id,
                              submittedAssignment.studentFirstName,
                              submittedAssignment.studentLastName
                            );
                          }}
                        />
                      </Box>
                    )}
                    {submittedAssignment.remarks.length === 0 && (
                      <Typography>Not yet posted</Typography>
                    )}
                  </Grid>

                  <Grid item md={2} xs={12}>
                    <Typography style={HeaderStyle}>Correction</Typography>

                    <Typography>
                      {submittedAssignment.correctionFiles
                        ? submittedAssignment.correctionFiles
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
                      onClick={() => {
                        handleModalOpen();
                        setStudentId(submittedAssignment.id);
                      }}
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

      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <Box sx={style}>
            <Typography
              sx={{
                textAlign: "center",
                fontSize: 16,
              }}
            >
              Please enter your Password and your new Email
            </Typography>
            <TextField
              label="Enter marks"
              type="text"
              fullWidth
              sx={{ mt: 1 }}
              value={marks}
              onChange={(e) => setMarks(e.target.value)}
            />

            <TextField
              label="Enter remarks"
              type="text"
              fullWidth
              sx={{ mt: 1 }}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
            />

            <Button
              fullWidth
              sx={[
                {
                  "&:hover": {
                    backgroundColor: "#c5c6c7",
                    color: "#0b0c10",
                  },
                  backgroundColor: "#45a29e",
                  color: "#fff",
                  mt: 1,
                },
              ]}
              onClick={() => {
                updateSubmittedDetails();
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress color="secondary" /> : "Submit"}
            </Button>

            {!loading && (
              <Button
                fullWidth
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#c5c6c7",
                      color: "#0b0c10",
                    },

                    border: "2px solid #45a29e",
                    color: "#0b0c10",
                    mt: 1,
                  },
                ]}
                onClick={() => {
                  handleCancel();
                }}
              >
                Cancel
              </Button>
            )}
          </Box>
        </>
      </Modal>

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
