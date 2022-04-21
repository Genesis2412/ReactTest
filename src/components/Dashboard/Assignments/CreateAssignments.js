import React, { useRef, useState, useEffect } from "react";
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
import PageviewIcon from "@mui/icons-material/Pageview";
import CloseIcon from "@mui/icons-material/Close";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { storage } from "../../../firebase-config";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
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
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ViewAssignmentsStudent from "./ViewAssignmentsStudent";

const CreateAssignments = () => {
  const [images, setImages] = useState([]);
  const [assignmentValue, setAssignmentValue] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const fileInputRef = useRef();
  const [progress, setProgress] = useState(0);
  const location = useLocation();
  const { classCode } = location.state;
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [assignmentId, setAssignmentId] = useState("");
  const { userDetails } = useUserAuth();
  const [joinedStudents, setJoinedStudents] = useState([]);

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

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = async () => {
    var d1 = Date.parse(startDate);
    var d2 = Date.parse(endDate);
    if (d1 > d2) {
      setSnackBarOpen(true);
      setMessage("End Date must be greater than Start Date");
      return;
    }

    if (
      assignmentValue &&
      images.length != 0 &&
      startDate &&
      startTime &&
      endDate &&
      endTime
    ) {
      images.map((image) => {
        const storageRef = ref(
          storage,
          "/assignments/" + classCode + "/" + image.name
        );
        const uploadTask = uploadBytesResumable(storageRef, image);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const prog = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(prog);
          },
          (err) => alert(err),
          // on Success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              await fetchAssignment().then(async (response) => {
                if (response) {
                  const updateRef = doc(db, "assignments", response);
                  await updateDoc(updateRef, {
                    fileName: arrayUnion(image.name),
                    fileUrl: arrayUnion(url),
                  });
                } else {
                  await setDoc(doc(collection(db, "assignments")), {
                    title: assignmentValue,
                    classCode: classCode,
                    startDate: startDate,
                    startTime: startTime,
                    endDate: endDate,
                    endTime: endTime,
                    fileName: [image.name],
                    fileUrl: [url],
                  }).then(async () => {
                    await createSubmission();
                  });
                }
              });
            });
          }
        );
      });

      setImages((prevState) => []);
      fileInputRef.current.value = "";
      setAssignmentId("");
      setAssignmentValue("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    } else if (
      assignmentValue &&
      images.length === 0 &&
      startDate &&
      startTime &&
      endDate &&
      endTime
    ) {
      updateAssignment();
    } else {
      setSnackBarOpen(true);
      setMessage("Please, fill in values correctly");
    }
  };

  const fetchAssignment = async () => {
    var docId = "";
    const q = query(
      collection(db, "assignments"),
      where("classCode", "==", classCode),
      where("title", "==", assignmentValue)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    return docId;
  };

  const updateAssignment = async () => {
    const assignmentRef = doc(db, "assignments", assignmentId);

    updateDoc(assignmentRef, {
      title: assignmentValue,
      startDate: startDate,
      startTime: startTime,
      endDate: endDate,
      endTime: endTime,
    })
      .then(() => {
        setProgress(100);
        setSnackBarOpen(true);
        setMessage("Updated Successfully");
        setAssignmentId("");
        setAssignmentValue("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      })
      .catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      });
  };

  const handleUpdate = async (
    aAssignmentId,
    aTitle,
    aStartDate,
    aStartTime,
    aEndDate,
    aEndTime
  ) => {
    let confirmAction = window.confirm("Are you sure to update?");

    if (confirmAction) {
      setSnackBarOpen(true);
      setMessage("Edit in the form above");
      setAssignmentId(aAssignmentId);
      setAssignmentValue(aTitle);
      setStartDate(aStartDate);
      setStartTime(aStartTime);
      setEndDate(aEndDate);
      setEndTime(aEndTime);
    }
  };

  const handleDeleteAssignment = async (docId) => {
    let confirmAction = window.confirm(
      "Are you sure to delete? This will delete submission of students also"
    );

    if (confirmAction) {
      deleteDoc(doc(db, "assignments", docId))
        .then(() => {
          handleDeleteSubmission(docId)
            .then(() => {
              setSnackBarOpen(true);
              setMessage("Deleted Successfully");
            })
            .catch((err) => {
              setSnackBarOpen(true);
              setMessage("Assignment could not be deleted, please try again");
            });
        })
        .catch((err) => {
          setSnackBarOpen(true);
          setMessage("Assignment could not be deleted, please try again");
        });
    }
  };

  const handleDeleteSubmission = async (assignmentCode) => {
    const docIds = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("assignmentCode", "==", assignmentCode)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
    });

    {
      docIds.map((dId) => {
        deleteDoc(doc(db, "submittedAssignments", dId));
      });
    }
  };

  const handleDeleteObject = async (docId, objFileName, objFileUrl) => {
    let confirmAction = window.confirm("Are you sure to delete?");
    if (confirmAction) {
      const imagePathRef = ref(
        storage,
        "assignments/" + classCode + "/" + objFileName
      );
      deleteObject(imagePathRef)
        .then(() => {
          const deleteFirestoreRef = doc(db, "assignments", docId);
          updateDoc(deleteFirestoreRef, {
            fileName: arrayRemove(objFileName),
            fileUrl: arrayRemove(objFileUrl),
          })
            .then(() => {
              setSnackBarOpen(true);
              setMessage("Deleted Successfully");
            })
            .catch((err) => {
              setSnackBarOpen(true);
              setMessage("An error occurred, please try again");
            });
        })
        .catch((err) => {
          setSnackBarOpen(true);
          setMessage("An error occurred, please try again");
        });
    }
  };

  useEffect(() => {
    const getJoinedStudents = async () => {
      const q = query(
        collection(db, "joinedClasses"),
        where("classCode", "==", classCode)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setJoinedStudents(data);
      });
    };
    getJoinedStudents();
  }, []);

  const createSubmission = async () => {
    await fetchAssignment().then((response) => {
      if (response) {
        if (joinedStudents) {
          {
            joinedStudents.map(async (joinedStudent) => {
              await setDoc(doc(collection(db, "submittedAssignments")), {
                classCode: classCode,
                studentFirstName: joinedStudent?.studentFirstName,
                studentLastName: joinedStudent?.studentLastName,
                studentEmail: joinedStudent?.studentEmail,
                assignmentCode: response,
                submittedFileName: [],
                submittedFileUrl: [],
                submittedTimestamp: "",
                status: "Not Submitted",
                marks: "",
              }).catch((err) => {
                setSnackBarOpen(true);
                setMessage("Students could not be added to assignment");
              });
            });
          }
        }
      }
    });
  };

  // reading all assignments details
  useEffect(() => {
    const q = query(
      collection(db, "assignments"),
      where("classCode", "==", classCode)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAssignments(data);
    });
  }, []);

  return (
    <>
      {userDetails.accountType === "Tutor" && (
        <>
          <Box sx={{ boxShadow: 5, mt: 3, p: 1 }}>
            <Paper>
              <Typography sx={{ fontSize: 15 }}>Create Assignments</Typography>
              <Box>
                <TextField
                  multiline
                  fullWidth
                  sx={{ mb: 1 }}
                  value={assignmentValue}
                  onChange={(e) => setAssignmentValue(e.target.value)}
                />

                <Grid container spacing={1}>
                  <Grid md={6} xs={12} item>
                    <Typography sx={{ fontSize: 15 }}>
                      Enter Start Date
                    </Typography>
                    <TextField
                      type={"date"}
                      fullWidth
                      sx={{ mb: 1 }}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                  </Grid>
                  <Grid md={6} xs={12} item>
                    <Typography sx={{ fontSize: 15 }}>
                      Enter Start Time
                    </Typography>
                    <TextField
                      type={"time"}
                      fullWidth
                      sx={{ mb: 1 }}
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={1}>
                  <Grid md={6} xs={12} item>
                    <Typography sx={{ fontSize: 15 }}>
                      Enter End Date
                    </Typography>
                    <TextField
                      type={"date"}
                      fullWidth
                      sx={{ mb: 1 }}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                  </Grid>
                  <Grid md={6} xs={12} item>
                    <Typography sx={{ fontSize: 15 }}>
                      Enter End Time
                    </Typography>
                    <TextField
                      type={"time"}
                      fullWidth
                      sx={{ mb: 1 }}
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                    />
                  </Grid>
                </Grid>
                <input
                  type={"file"}
                  multiple
                  ref={fileInputRef}
                  onChange={handleChange}
                />
              </Box>
            </Paper>
            <Button
              fullWidth
              sx={[
                {
                  "&:hover": {
                    color: "#0b0c10",
                    backgroundColor: "#c5c6c7",
                  },
                  backgroundColor: "#45a29e",
                  color: "#fff",
                  mt: 2,
                },
              ]}
              onClick={() => {
                handleUpload();
              }}
            >
              Create
            </Button>
            <LinearProgress
              color="secondary"
              variant="determinate"
              value={progress}
            />
          </Box>
          {assignments.length !== 0 && (
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
                    <TableCell style={HeaderStyle}>Start Date/Time</TableCell>
                    <TableCell style={HeaderStyle}>End Date/Time</TableCell>
                    <TableCell style={HeaderStyle}>
                      Assignment Description
                    </TableCell>
                    <TableCell style={HeaderStyle}>
                      Assignment Contents
                    </TableCell>
                    <TableCell style={HeaderStyle}>View Submissions</TableCell>
                    <TableCell style={HeaderStyle}>Update</TableCell>
                    <TableCell style={HeaderStyle}>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assignments.map((assignment, index) => {
                    return (
                      <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                        <TableCell>
                          {assignment.startDate + ", " + assignment.startTime}
                        </TableCell>
                        <TableCell>
                          {assignment.endDate + ", " + assignment.endTime}
                        </TableCell>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell key={index}>
                          {assignment.fileName.map((file, index) => {
                            return (
                              <Grid container key={index}>
                                <Grid item xs={6}>
                                  <a
                                    href={assignment.fileUrl[index]}
                                    style={LinkStyles}
                                    target="blank"
                                  >
                                    {file}
                                  </a>
                                </Grid>
                                <Grid item xs={6}>
                                  <Button
                                    sx={{
                                      position: "relative",
                                      bottom: 4,
                                      color: "red",
                                    }}
                                    onClick={() => {
                                      handleDeleteObject(
                                        assignment.id,
                                        file,
                                        assignment.fileUrl[index]
                                      );
                                    }}
                                  >
                                    <RemoveCircleIcon sx={{ fontSize: 16 }} />
                                  </Button>
                                </Grid>
                              </Grid>
                            );
                          })}
                        </TableCell>

                        <TableCell>
                          <Link
                            to="viewsubmissions"
                            state={{
                              classCode: classCode,
                              assignmentId: assignment.id,
                            }}
                          >
                            <PageviewIcon sx={{ color: "green" }} />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => {
                              handleUpdate(
                                assignment.id,
                                assignment.title,
                                assignment.startDate,
                                assignment.startTime,
                                assignment.endDate,
                                assignment.endTime
                              );
                            }}
                          >
                            <ChangeCircleIcon />
                          </Button>
                        </TableCell>
                        <TableCell>
                          <Button
                            sx={{ color: "red" }}
                            onClick={() => {
                              handleDeleteAssignment(assignment.id);
                            }}
                          >
                            <CloseIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {userDetails.accountType === "Student" && (
        <ViewAssignmentsStudent classCode={classCode} />
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

export default CreateAssignments;
