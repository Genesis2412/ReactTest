import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  LinearProgress,
  Snackbar,
  Menu,
  MenuItem,
} from "@mui/material";
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
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ViewAssignmentsStudent from "./ViewAssignmentsStudent";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ReactHtmlParser from "react-html-parser";
import ShowIcons from "../ShowIcons";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

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
  const [assignmentId, setAssignmentId] = useState("");
  const { userDetails } = useUserAuth();
  const [assignments, setAssignments] = useState([]);
  const [joinedStudents, setJoinedStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(true);

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
      images.length !== 0 &&
      startDate &&
      startTime &&
      endDate &&
      endTime
    ) {
      var docRef = "";
      try {
        if (assignmentId) {
          docRef = await updateDoc(doc(db, "assignments", assignmentId), {
            title: assignmentValue,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            timestamp: serverTimestamp(),
          });
        } else {
          docRef = await addDoc(collection(db, "assignments"), {
            title: assignmentValue,
            classCode: classCode,
            startDate: startDate,
            startTime: startTime,
            endDate: endDate,
            endTime: endTime,
            timestamp: serverTimestamp(),
          });
        }

        if (joinedStudents?.length !== 0 && assignmentId === "") {
          joinedStudents.map(async (joinedStudent) => {
            await setDoc(doc(collection(db, "submittedAssignments")), {
              classCode: classCode,
              studentFirstName: joinedStudent?.studentFirstName,
              studentLastName: joinedStudent?.studentLastName,
              studentEmail: joinedStudent?.studentEmail,
              assignmentCode: docRef.id,
              submittedFileName: [],
              submittedFileUrl: [],
              submittedTimestamp: "",
              status: "Not Submitted",
              marks: "Not yet posted",
            });
          });
        }
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
        return;
      }

      await Promise.all(
        images.map((image) => {
          var storageRef = "";

          if (assignmentId) {
            storageRef = ref(
              storage,
              "CreatedClasses/" +
                classCode +
                "/assignments/" +
                assignmentId +
                "/" +
                image.name
            );
          } else {
            storageRef = ref(
              storage,
              "CreatedClasses/" +
                classCode +
                "/assignments/" +
                docRef.id +
                "/" +
                image.name
            );
          }

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

            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                try {
                  if (assignmentId) {
                    await updateDoc(doc(db, "assignments", assignmentId), {
                      fileName: arrayUnion(image.name),
                      fileUrl: arrayUnion(url),
                    });
                  } else {
                    await updateDoc(doc(db, "assignments", docRef.id), {
                      fileName: arrayUnion(image.name),
                      fileUrl: arrayUnion(url),
                    });
                  }
                } catch (error) {
                  setSnackBarOpen(true);
                  setMessage("An error occurred, please try again");
                  return;
                }
              });
            }
          );
        })
      );

      setImages((prevState) => []);
      fileInputRef.current.value = "";
      setAssignmentId("");
      setAssignmentValue("");
      setStartDate("");
      setStartTime("");
      setEndDate("");
      setEndTime("");
    } else if (
      assignmentId &&
      assignmentValue &&
      images.length === 0 &&
      startDate &&
      startTime &&
      endDate &&
      endTime
    ) {
      try {
        await updateDoc(doc(db, "assignments", assignmentId), {
          title: assignmentValue,
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          timestamp: serverTimestamp(),
        });
        setAssignmentId("");
        setAssignmentValue("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("Please, fill in values correctly");
        return;
      }
    } else if (
      !assignmentId &&
      assignmentValue &&
      images.length === 0 &&
      startDate &&
      startTime &&
      endDate &&
      endTime
    ) {
      try {
        await addDoc(collection(db, "assignments"), {
          title: assignmentValue,
          classCode: classCode,
          startDate: startDate,
          startTime: startTime,
          endDate: endDate,
          endTime: endTime,
          timestamp: serverTimestamp(),
        });
        setAssignmentValue("");
        setStartDate("");
        setStartTime("");
        setEndDate("");
        setEndTime("");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
        return;
      }
    } else {
      setSnackBarOpen(true);
      setMessage("Please, fill in values correctly");
      return;
    }
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

  const handleDelete = async (docId, fileNames) => {
    let confirmAction = window.confirm(
      "Are you sure to delete? This will delete submission of students also"
    );
    if (confirmAction) {
      try {
        await deleteDoc(doc(db, "assignments", docId));
        await handleDeleteSubmission(docId);
        await handleDeleteObject(docId, fileNames);
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("Assignment could not be deleted, please try again");
      }
    }
  };

  const handleDeleteSubmission = async (docId) => {
    const docIds = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("assignmentCode", "==", docId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docIds.push(doc.id);
    });

    docIds.map((dId) => {
      deleteDoc(doc(db, "submittedAssignments", dId));
    });
  };

  const handleDeleteObject = async (docId, fileNames) => {
    try {
      fileNames.map(async (fileName) => {
        const imagePathRef = ref(
          storage,
          "CreatedClasses/" +
            classCode +
            "/assignments/" +
            docId +
            "/" +
            fileName
        );
        await deleteObject(imagePathRef);
      });
    } catch (error) {
      setSnackBarOpen(true);
      setMessage("An error occurred, please try again");
    }
  };

  const handleDeleteOneObject = async (docId, objFileName, objFileUrl) => {
    let confirmAction = window.confirm("Are you sure to delete?");
    if (confirmAction) {
      try {
        const imagePathRef = ref(
          storage,
          "CreatedClasses/" +
            classCode +
            "/assignments/" +
            docId +
            "/" +
            objFileName
        );

        await deleteObject(imagePathRef);
        await updateDoc(doc(db, "assignments", docId), {
          fileName: arrayRemove(objFileName),
          fileUrl: arrayRemove(objFileUrl),
        });
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
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

  // reading all assignments details
  useEffect(() => {
    setShowLoader(true);
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
      setShowLoader(false);
    });
  }, []);

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {userDetails.accountType === "Tutor" && (
        <>
          <Box sx={{ boxShadow: 5, mt: 3, p: 1 }}>
            <Box sx={{ width: "99%" }}>
              <CKEditor
                editor={Editor}
                data={assignmentValue}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setAssignmentValue(data);
                }}
              />

              <Grid container spacing={1} mt={1}>
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
                  <Typography sx={{ fontSize: 15 }}>Enter End Date</Typography>
                  <TextField
                    type={"date"}
                    fullWidth
                    sx={{ mb: 1 }}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </Grid>
                <Grid md={6} xs={12} item>
                  <Typography sx={{ fontSize: 15 }}>Enter End Time</Typography>
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

          {!showLoader && assignments?.length !== 0 && (
            <Box
              sx={{
                mt: 2,
                display: "flex",
                justifyContent: "right",
                alignItems: "right",
              }}
            >
              <TextField
                size={"small"}
                label={"Search assignments"}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </Box>
          )}

          {assignments
            ?.filter((assignment) => {
              if (assignment?.fileName?.length !== 0) {
                for (let i = 0; i < assignment?.fileName?.length; i++) {
                  if (
                    assignment.fileName[i]
                      .toLowerCase()
                      .includes(searchTerm.toLowerCase())
                  ) {
                    return assignment;
                  }
                }
              }
              if (searchTerm === "") {
                return assignment;
              } else if (
                assignment.title
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
              if (
                assignment.startDate
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
              if (
                assignment.endDate
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
              if (
                assignment.startTime
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
              if (
                assignment.endTime
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
              if (
                moment(assignment.timestamp.toDate())
                  .fromNow()
                  .toString()
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return assignment;
              }
            })
            ?.map((assignment, index) => {
              return (
                <Box sx={{ boxShadow: 3, mt: 2 }} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ float: "right", pt: 0.3 }}>
                      <PopupState variant="popover" popupId="demo-popup-menu">
                        {(popupState) => (
                          <>
                            <MoreVertIcon
                              {...bindTrigger(popupState)}
                              sx={{ cursor: "pointer", color: "#fff" }}
                            />
                            <Menu {...bindMenu(popupState)}>
                              <MenuItem>
                                <Link
                                  to="viewsubmissions"
                                  state={{
                                    classCode: classCode,
                                    assignmentId: assignment.id,
                                  }}
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    marginLeft: 10,
                                  }}
                                >
                                  <Box>
                                    <Typography>View Submissions</Typography>
                                  </Box>
                                </Link>
                              </MenuItem>
                              <MenuItem>
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
                                  <Typography ml={1}>Update</Typography>
                                </Button>
                              </MenuItem>
                              <MenuItem>
                                <Button
                                  sx={{ color: "red" }}
                                  onClick={() => {
                                    handleDelete(
                                      assignment.id,
                                      assignment.fileName
                                    );
                                  }}
                                >
                                  <CloseIcon />
                                  <Typography ml={1}>Delete</Typography>
                                </Button>
                              </MenuItem>
                            </Menu>
                          </>
                        )}
                      </PopupState>
                    </Box>

                    <Box
                      sx={{
                        width: "100%",
                        backgroundColor: "#1f2833",
                        height: 30,
                        borderRadius: 1,
                      }}
                    >
                      <Typography
                        sx={{ pl: 1, pt: 0.5, fontSize: 14, color: "#66fcf1" }}
                      >
                        <span style={{ color: "#fff" }}>Posted: </span>
                        <span style={{ fontFamily: "Verdana" }}>
                          {moment(assignment?.timestamp?.toDate())?.fromNow()}
                        </span>
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Box>
                          <Paper
                            sx={{
                              p: 1,
                              backgroundColor: "#45a29e",
                              color: "#fff",
                            }}
                          >
                            <Typography variant={"h4"} sx={{ fontSize: 16 }}>
                              Assigned on:{" "}
                              {assignment.startDate +
                                ", " +
                                assignment.startTime}
                            </Typography>
                          </Paper>

                          <Paper
                            sx={{
                              p: 1,
                              backgroundColor: "#45a29e",
                              color: "#fff",
                              mt: 1,
                            }}
                          >
                            <Typography variant={"h4"} sx={{ fontSize: 16 }}>
                              Due on:{" "}
                              {assignment.endDate + ", " + assignment.endTime}
                            </Typography>
                          </Paper>

                          <Typography sx={{ fontSize: 15, mt: 2, ml: 1 }}>
                            {ReactHtmlParser(assignment.title)}
                          </Typography>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Box sx={{ boxShadow: 3 }}>
                          <Paper sx={{ p: 1, backgroundColor: "#c5c6c7" }}>
                            <Typography variant={"h4"} sx={{ fontSize: 16 }}>
                              Attachments
                            </Typography>
                          </Paper>
                          <Paper sx={{ p: 2 }}>
                            <Grid container item spacing={2}>
                              {assignment?.fileName?.map(
                                (assignmentFile, key) => {
                                  return (
                                    <Grid item xs={12} md={6} key={key}>
                                      <Box>
                                        <Paper
                                          sx={{
                                            p: 1,
                                          }}
                                        >
                                          <RemoveCircleIcon
                                            sx={{
                                              color: "red",
                                              fontSize: 20,
                                              float: "right",
                                              cursor: "pointer",
                                            }}
                                            onClick={() => {
                                              handleDeleteOneObject(
                                                assignment.id,
                                                assignmentFile,
                                                assignment.fileUrl[key]
                                              );
                                            }}
                                          />
                                          <Box
                                            sx={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                            }}
                                          >
                                            <a
                                              href={assignment.fileUrl[key]}
                                              target="_blank"
                                              rel="noreferrer"
                                              style={{
                                                textDecoration: "none",
                                                color: "#000",
                                              }}
                                            >
                                              <ShowIcons
                                                fileName={assignmentFile}
                                              />
                                              <Typography sx={{ fontSize: 15 }}>
                                                {assignmentFile}
                                              </Typography>
                                            </a>
                                          </Box>
                                        </Paper>
                                      </Box>
                                    </Grid>
                                  );
                                }
                              )}
                            </Grid>
                          </Paper>
                        </Box>
                      </Grid>
                    </Grid>
                  </Paper>
                </Box>
              );
            })}
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
