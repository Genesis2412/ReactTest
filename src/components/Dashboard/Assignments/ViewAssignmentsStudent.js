import React, { useState, useEffect, useRef } from "react";
import {
  Grid,
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
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
  orderBy,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
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
import ImageIcon from "../../../images/ImageIcon.jpg";
import VideoIcon from "../../../images/VideoIcon.jpg";
import SheetIcon from "../../../images/SheetIcon.jpg";
import PdfIcon from "../../../images/PdfIcon.jpg";
import TextIcon from "../../../images/TextIcon.jpg";
import WordIcon from "../../../images/WordIcon.jpg";
import PowerPointIcon from "../../../images/PowerPointIcon.jpg";
import MusicIcon from "../../../images/MusicIcon.jpg";
import NoAssignmentsIcon from "../../../images/NoAssignmentsIcon.svg";
import { AssignmentIcon } from "../../GlobalStyles";

const ViewAssignmentsStudent = ({ classCode }) => {
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const { userDetails } = useUserAuth();
  const [images, setImages] = useState([]);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef();

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
    // Checking if there is already an submitted exactly by that title to merge
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
    // values classCode, userDetails.email, userDetails.firstName, userDetails.lastName,
    // submittedTimestamp,  status,
    var status;
    const statusTimestamp = new Date(endDate + "," + endTime);
    if (statusTimestamp.getTime() > todayTimestamp) {
      status = "On time";
    } else {
      status = "Late";
    }
    if (images.length !== 0) {
      images.map((image) => {
        const storageRef = ref(storage, "/submittedAssignments/" + image.name);
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
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              readOne(assignmentCode).then((response) => {
                if (response) {
                  const updateRef = doc(db, "submittedAssignments", response);
                  updateDoc(updateRef, {
                    submittedFileName: arrayUnion(image.name),
                    submittedFileUrl: arrayUnion(url),
                  });
                } else {
                  setDoc(doc(collection(db, "submittedAssignments")), {
                    classCode: classCode,
                    studentFirstName: userDetails?.name?.firstName,
                    studentlastName: userDetails?.name?.lastName,
                    studentEmail: userDetails?.email,
                    assignmentCode: assignmentCode,
                    submittedFileName: [image.name],
                    submittedFileUrl: [url],
                    submittedTimestamp: today,
                    status: status,
                  });
                }
              });
            });
          }
        );
      });
      setImages((prevState) => []);
      fileInputRef.current.value = "";
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
      readFiles(assignmentCode).then((val) => {
        val.map((fileNames) => {
          try {
            const imagePathRef = ref(
              storage,
              "submittedAssignments/" + fileNames
            );
            deleteObject(imagePathRef)
              .then(async () => {
                await deleteDoc(
                  doc(db, "submittedAssignments", assignmentCode)
                );
              })
              .catch((error) => {
                setSnackBarOpen(true);
                setMessage("An error occurred, please try again");
                return;
              });
          } catch (error) {
            setSnackBarOpen(true);
            setMessage("An error occurred, please try again");
          }
        });
        setSnackBarOpen(true);
        setMessage("Unsubmitted Successfully");
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

  if (assignments.length === 0) {
    return (
      <Box sx={{ textAlign: "center" }}>
        <AssignmentIcon src={NoAssignmentsIcon} alt="icon" />
        <Typography>Woohoo, no assignments</Typography>
      </Box>
    );
  } else
    return (
      <>
        {assignments.map((assignment, index) => {
          var assignmentTimestamp = new Date(
            assignment?.startDate + "," + assignment?.startTime
          );

          if (todayTimestamp >= assignmentTimestamp.getTime() && assignments) {
            return (
              <Box sx={{ boxShadow: 3, mt: 3 }} key={index}>
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
                        </Paper>
                        <Typography
                          variant={"h4"}
                          sx={{ fontSize: 16, pl: 1, mt: 2 }}
                        >
                          Description
                        </Typography>
                        <Typography sx={{ fontSize: 15, pt: 1, pl: 1 }}>
                          {assignment.title}
                        </Typography>
                        <Typography
                          variant={"h4"}
                          sx={{ fontSize: 16, pt: 3, pl: 1 }}
                        >
                          Attachments
                        </Typography>
                        <Box>
                          {assignment.fileName.map((assignmentFile) => {
                            return (
                              <Box key={index} sx={{ mt: 1, pl: 1 }}>
                                <a
                                  href={assignment.fileUrl[index]}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={{
                                    textDecoration: "none",
                                    color: "#000",
                                  }}
                                >
                                  <Box p={1}>
                                    {/* Images Icon */}
                                    {(assignmentFile.includes(".jpg") ||
                                      assignmentFile.includes(".jpeg") ||
                                      assignmentFile.includes(".png") ||
                                      assignmentFile.includes(".gif") ||
                                      assignmentFile.includes(".svg")) && (
                                      <img
                                        src={ImageIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}
                                    {/* Video Icons */}
                                    {(assignmentFile.includes(".mp4") ||
                                      assignmentFile.includes(".mov") ||
                                      assignmentFile.includes(".wmv") ||
                                      assignmentFile.includes(".avi") ||
                                      assignmentFile.includes(".mkv")) && (
                                      <img
                                        src={VideoIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}
                                    {/* SpreadSheet Icons */}
                                    {(assignmentFile.includes(".xlsx") ||
                                      assignmentFile.includes(".xlsm") ||
                                      assignmentFile.includes(".xls") ||
                                      assignmentFile.includes(".csv")) && (
                                      <img
                                        src={SheetIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}
                                    {/* PDF Icon */}
                                    {assignmentFile.includes(".pdf") && (
                                      <img
                                        src={PdfIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}

                                    {/* Text Icon */}
                                    {(assignmentFile.includes(".txt") ||
                                      assignmentFile.includes(".rtf")) && (
                                      <img
                                        src={TextIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}

                                    {/* Word Icon */}
                                    {(assignmentFile.includes(".doc") ||
                                      assignmentFile.includes(".docx") ||
                                      assignmentFile.includes(".wpd")) && (
                                      <img
                                        src={WordIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}

                                    {/* Powerpoint Icon */}
                                    {(assignmentFile.includes(".pptx") ||
                                      assignmentFile.includes(".pptm") ||
                                      assignmentFile.includes(".ppt")) && (
                                      <img
                                        src={PowerPointIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}

                                    {/* Music Icon */}
                                    {(assignmentFile.includes(".mp3") ||
                                      assignmentFile.includes(".aac") ||
                                      assignmentFile.includes(".ogg") ||
                                      assignmentFile.includes(".wav") ||
                                      assignmentFile.includes(".wma") ||
                                      assignmentFile.includes(".flac")) && (
                                      <img
                                        src={MusicIcon}
                                        alt="thumbnail"
                                        height={40}
                                      />
                                    )}
                                    <Typography sx={{ fontSize: 15 }}>
                                      {assignmentFile}
                                    </Typography>
                                  </Box>
                                </a>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Box sx={{ boxShadow: 3 }}>
                        <Paper sx={{ p: 1, backgroundColor: "#c5c6c7" }}>
                          <Typography>
                            Your Marks:{" "}
                            <span style={{ color: "blue" }}>50\100</span>
                          </Typography>
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
                                if (value) {
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
                                }
                              })}

                            {submittedAssignments.length === 0 && (
                              <Button
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
                            )}

                            <LinearProgress
                              color="secondary"
                              variant="determinate"
                              value={progress}
                            />
                          </Box>
                        </Paper>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            );
          } else {
            return (
              <Box sx={{ textAlign: "center" }}>
                <AssignmentIcon src={NoAssignmentsIcon} alt="icon" />
                <Typography>Woohoo, no assignments</Typography>
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
