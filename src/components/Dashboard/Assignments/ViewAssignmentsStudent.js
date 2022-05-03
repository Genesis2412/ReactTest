import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Snackbar,
  TextField,
} from "@mui/material";
import { db } from "../../../firebase-config";
import {
  doc,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
  orderBy,
  updateDoc,
  arrayUnion,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { storage } from "../../../firebase-config";
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ShowIcons from "../ShowIcons";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";

const ViewAssignmentsStudent = ({ classCode }) => {
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const { userDetails } = useUserAuth();
  const [images, setImages] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();
  const [searchTerm, setSearchTerm] = useState("");

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",

    "&:hover": {
      color: "#0b0c10",
      backgroundColor: "#c5c6c7",
    },
  };

  var today = new Date();
  var todayTimestamp = today.getTime();

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

  const readOne = async (assignmentCode) => {
    var docId = "";
    // Checking for user submission
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("assignmentCode", "==", assignmentCode),
      where("studentEmail", "==", userDetails?.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    return docId;
  };

  const handleSubmit = async (assignmentCode, endDate, endTime) => {
    var status = "";
    const statusTimestamp = new Date(endDate + "," + endTime);
    if (statusTimestamp.getTime() > todayTimestamp) {
      status = "On time";
    } else {
      status = "Late";
    }

    var assignmentId = "";
    await readOne(assignmentCode).then((response) => {
      assignmentId = response;
    });

    if (images.length !== 0) {
      await Promise.all(
        images.map((image) => {
          const storageRef = ref(
            storage,
            "CreatedClasses/" +
              classCode +
              "/submittedAssignments/" +
              assignmentId +
              "/" +
              image.name
          );
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const prog = Math.round(
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100
              );
            },
            (err) => alert(err),

            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                try {
                  if (assignmentId) {
                    const updateRef = doc(
                      db,
                      "submittedAssignments",
                      assignmentId
                    );
                    await updateDoc(updateRef, {
                      submittedTimestamp: today,
                      status: status,
                      submittedFileName: arrayUnion(image.name),
                      submittedFileUrl: arrayUnion(url),
                    });
                  } else {
                    await setDoc(doc(collection(db, "submittedAssignments")), {
                      classCode: classCode,
                      studentFirstName: userDetails?.name?.firstName,
                      studentLastName: userDetails?.name?.lastName,
                      studentEmail: userDetails?.email,
                      assignmentCode: assignmentCode,
                      submittedFileName: [image.name],
                      submittedFileUrl: [url],
                      submittedTimestamp: today,
                      status: status,
                      marks: "",
                    });
                  }
                } catch (error) {
                  setSnackBarOpen(true);
                  setMessage("Submission Failed, try again");
                }
              });
            }
          );
        })
      );
      setSnackBarOpen(true);
      setMessage("Submitted Successfully");
      fileInputRef.current.value = "";
      setImages([]);
    } else {
      setSnackBarOpen(true);
      setMessage("Please, input your files");
    }
  };

  // read to get file name to delete
  const readFiles = async (assignmentCode) => {
    var filesArray = [];
    const docRef = doc(db, "submittedAssignments", assignmentCode);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      filesArray = docSnap.data().submittedFileName;
    }
    return filesArray;
  };

  const handleUnsubmit = async (assignmentCode) => {
    let confirmAction = window.confirm("Are you sure to delete?");
    if (confirmAction) {
      await readFiles(assignmentCode).then((val) => {
        val.map(async (fileNames) => {
          try {
            const imagePathRef = ref(
              storage,
              "CreatedClasses/" +
                classCode +
                "/submittedAssignments/" +
                assignmentCode +
                "/" +
                fileNames
            );
            await deleteObject(imagePathRef);
            await updateDoc(doc(db, "submittedAssignments", assignmentCode), {
              submittedTimestamp: "",
              status: "Not Submitted",
              submittedFileName: [],
              submittedFileUrl: [],
            });
            setSnackBarOpen(true);
            setMessage("Unsubmitted Successfully");
          } catch (error) {
            setSnackBarOpen(true);
            setMessage("An error occurred, please try again");
          }
        });
      });
    }
  };

  // reading assignment details for that class
  useEffect(() => {
    const q = query(
      collection(db, "assignments"),
      where("classCode", "==", classCode),
      orderBy("startDate")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAssignments(data);
    });
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("studentEmail", "==", userDetails?.email)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSubmittedAssignments(data);
    });
  }, []);

  return (
    <>
      {assignments.length !== 0 && (
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
          if (assignment.fileName.length !== 0) {
            for (let i = 0; i < assignment.fileName.length; i++) {
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
            assignment.endDate.toLowerCase().includes(searchTerm.toLowerCase())
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
            assignment.endTime.toLowerCase().includes(searchTerm.toLowerCase())
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
          var assignmentTimestamp = new Date(
            assignment?.startDate + "," + assignment?.startTime
          );
          if (todayTimestamp >= assignmentTimestamp.getTime() && assignments) {
            return (
              <Box sx={{ boxShadow: 3, mt: 2 }} key={index}>
                <Paper sx={{ p: 2 }}>
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
                            <span>
                              {assignment.startDate +
                                ", " +
                                assignment.startTime}
                            </span>
                          </Typography>
                          <Typography
                            variant={"h4"}
                            sx={{ fontSize: 13, color: "#c5c6c7" }}
                          >
                            Posted on:{" "}
                            <span style={{ fontStyle: "italic" }}>
                              {moment(
                                assignment?.timestamp?.toDate()
                              )?.fromNow()}
                            </span>
                          </Typography>
                        </Paper>

                        <Typography sx={{ fontSize: 15, mt: 2, ml: 1 }}>
                          {ReactHtmlParser(assignment.title)}
                        </Typography>

                        <Box>
                          <Grid container item spacing={2} mt={1}>
                            {assignment.fileName.map((assignmentFile, key) => {
                              return (
                                <Grid item xs={12} md={2}>
                                  <Paper key={key} sx={{ mt: 1, pl: 1 }}>
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
                                        <Box p={1}>
                                          <ShowIcons
                                            fileName={assignmentFile}
                                          />
                                          <Typography sx={{ fontSize: 15 }}>
                                            {assignmentFile}
                                          </Typography>
                                        </Box>
                                      </a>
                                    </Box>
                                  </Paper>
                                </Grid>
                              );
                            })}
                          </Grid>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ boxShadow: 3 }}>
                        <Paper sx={{ p: 1, backgroundColor: "#c5c6c7" }}>
                          {submittedAssignments
                            .filter((submittedAssignment) => {
                              if (
                                assignment?.id ===
                                submittedAssignment.assignmentCode
                              ) {
                                return submittedAssignment;
                              }
                            })
                            .map((submittedAssignment, index) => {
                              return (
                                <Typography>
                                  Your Marks:{" "}
                                  <span style={{ color: "blue" }}>
                                    {submittedAssignment.marks}
                                  </span>
                                </Typography>
                              );
                            })}
                        </Paper>
                        <Paper sx={{ p: 2 }}>
                          <Typography sx={{ fontSize: 15 }}>
                            Due Date:{" "}
                            <span style={{ color: "red" }}>
                              {assignment.endDate + ", " + assignment.endTime}
                            </span>
                          </Typography>

                          {submittedAssignments
                            .filter((submittedAssignment) => {
                              if (
                                assignment?.id ===
                                submittedAssignment.assignmentCode
                              ) {
                                return submittedAssignment;
                              }
                            })
                            .map((submittedAssignment, index) => {
                              return (
                                <Box key={index}>
                                  <Typography sx={{ fontSize: 15 }}>
                                    Submitted:{" "}
                                    <span>{submittedAssignment.status}</span>
                                  </Typography>
                                  {submittedAssignment.submittedFileName.map(
                                    (fileName, index) => {
                                      return (
                                        <Paper
                                          sx={{
                                            p: 1,
                                            mt: 1,
                                            textAlign: "center",
                                            backgroundColor: "#c5c6c7",
                                          }}
                                          key={index}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 15,
                                            }}
                                          >
                                            <a
                                              href={
                                                submittedAssignment
                                                  .submittedFileUrl[index]
                                              }
                                              target="blank"
                                              style={LinkStyles}
                                            >
                                              {fileName}
                                            </a>
                                          </Typography>
                                        </Paper>
                                      );
                                    }
                                  )}
                                </Box>
                              );
                            })}

                          <Box sx={{ mt: 2 }}>
                            <input
                              type={"file"}
                              multiple
                              ref={fileInputRef}
                              onChange={handleChange}
                            />
                          </Box>
                          <Box mt={1}>
                            {submittedAssignments
                              .filter((value) => {
                                if (assignment?.id === value.assignmentCode) {
                                  return value;
                                }
                              })
                              .map((value, index) => {
                                if (value.status !== "Not Submitted") {
                                  return (
                                    <Button
                                      key={index}
                                      size={"small"}
                                      fullWidth
                                      sx={[
                                        {
                                          "&:hover": {
                                            backgroundColor: "#c5c6c7",
                                            color: "#000",
                                          },
                                          backgroundColor: "#B01F00",
                                          color: "#fff",
                                        },
                                      ]}
                                      onClick={() => {
                                        handleUnsubmit(value.id);
                                      }}
                                    >
                                      Unsubmit
                                    </Button>
                                  );
                                } else
                                  return (
                                    <Button
                                      key={index}
                                      size={"small"}
                                      fullWidth
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
                                        handleSubmit(
                                          assignment.id,
                                          assignment.endDate,
                                          assignment.endTime
                                        );
                                      }}
                                    >
                                      Submit
                                    </Button>
                                  );
                              })}
                          </Box>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            );
          }
        })}
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

export default ViewAssignmentsStudent;
