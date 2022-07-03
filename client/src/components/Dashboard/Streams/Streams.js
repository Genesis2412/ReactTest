import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Snackbar from "@mui/material/Snackbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
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
  updateDoc,
  arrayUnion,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  query,
  where,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ShowIcons from "../ShowIcons";
import Editor from "ckeditor5-custom-build/build/ckeditor";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ReactHtmlParser from "react-html-parser";
import moment from "moment";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";
import StreamBoard from "../../../images/NoExistBanner/StreamBoard.svg";
import { StreamEmpty } from "../../GlobalStyles";

const Streams = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { classSubject } = location.state;
  const { classGrade } = location.state;
  const { userDetails } = useUserAuth();
  const [images, setImages] = useState([]);
  var [announcementValue, setAnnouncementValue] = useState("");
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFiles, setShowFiles] = useState([]);
  const [streamCode, setStreamCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  //getting images
  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = async () => {
    if (announcementValue && images.length !== 0) {
      setLoading(true);
      var docRef = "";
      if (streamCode) {
        docRef = await updateDoc(doc(db, "announcements", streamCode), {
          context: announcementValue,
        });
      } else {
        docRef = await addDoc(collection(db, "announcements"), {
          subject: classSubject,
          grade: classGrade,
          context: announcementValue,
          classCode: classCode,
        });
      }

      await Promise.all(
        images.map((image) => {
          var storageRef = "";
          if (streamCode) {
            storageRef = ref(
              storage,
              "CreatedClasses/" +
                classCode +
                "/streams/" +
                streamCode +
                "/" +
                image.name
            );
          } else {
            storageRef = ref(
              storage,
              "CreatedClasses/" +
                classCode +
                "/streams/" +
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
            (err) => {
              setSnackBarOpen(true);
              setMessage("An error occurred, please try again");
            },

            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                try {
                  if (streamCode) {
                    await updateDoc(doc(db, "announcements", streamCode), {
                      fileName: arrayUnion(image.name),
                      fileUrl: arrayUnion(url),
                      timestamp: serverTimestamp(),
                    });
                  } else {
                    await updateDoc(doc(db, "announcements", docRef.id), {
                      fileName: arrayUnion(image.name),
                      fileUrl: arrayUnion(url),
                      timestamp: serverTimestamp(),
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
      fileInputRef.current.value = "";
      setAnnouncementValue("");
      setStreamCode("");
      setImages([]);
      setLoading(false);
    } else if (announcementValue && images.length === 0) {
      try {
        if (streamCode) {
          docRef = await updateDoc(doc(db, "announcements", streamCode), {
            context: announcementValue,
          });
        } else {
          await setDoc(doc(collection(db, "announcements")), {
            subject: classSubject,
            grade: classGrade,
            classCode: classCode,
            context: announcementValue,
            timestamp: serverTimestamp(),
            fileName: [],
            fileUrl: [],
          });
        }
        setSnackBarOpen(true);
        setMessage("Stream created successfully");
        setAnnouncementValue("");
        setStreamCode("");
        setLoading(false);
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
        return;
      }
    } else {
      setSnackBarOpen(true);
      setMessage("Please enter Announcement");
      return;
    }
  };

  // Delete a stream
  const handleDeleteStream = async (streamId, fileName) => {
    let confirmAction = window.confirm("Are you sure to delete?");
    if (confirmAction) {
      try {
        fileName.map(async (file) => {
          const filePathRef = ref(
            storage,
            "CreatedClasses/" + classCode + "/streams/" + streamId + "/" + file
          );
          await deleteObject(filePathRef);
        });

        await deleteDoc(doc(db, "announcements", streamId));
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  // Delete one material in a stream
  const handleObjectDelete = async (streamId, fileName, fileUrl) => {
    let confirmAction = window.confirm(
      "Are you sure to delete " + fileName + " ?"
    );

    if (confirmAction) {
      try {
        const filePathRef = ref(
          storage,
          "CreatedClasses/" +
            classCode +
            "/streams/" +
            streamId +
            "/" +
            fileName
        );
        await deleteObject(filePathRef).then(async () => {
          const deleteFirestoreRef = doc(db, "announcements", streamId);
          await updateDoc(deleteFirestoreRef, {
            fileName: arrayRemove(fileName),
            fileUrl: arrayRemove(fileUrl),
          });
        });

        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  // updateStream
  const updateStream = async (streamId, context) => {
    let confirmAction = window.confirm("Are you sure to update?");

    if (confirmAction) {
      setSnackBarOpen(true);
      setMessage("Update in form");
      setAnnouncementValue(context);
      setStreamCode(streamId);
    }
  };

  useEffect(() => {
    setShowLoader(true);
    const q = query(
      collection(db, "announcements"),
      where("classCode", "==", classCode),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newFiles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setShowFiles(newFiles);
      setShowLoader(false);
    });
  }, []);

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {userDetails?.accountType === "Tutor" && (
        <Box sx={{ boxShadow: 5, mt: 3, p: 2 }}>
          <Box sx={{ width: "99%" }}>
            <CKEditor
              editor={Editor}
              data={announcementValue}
              onChange={(event, editor) => {
                const data = editor.getData();
                setAnnouncementValue(data);
              }}
            />

            <input
              style={{ marginTop: 5 }}
              multiple
              type="file"
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
            onClick={handleUpload}
            disabled={loading}
          >
            Create
          </Button>

          <LinearProgress
            color="secondary"
            variant="determinate"
            value={progress}
          />
        </Box>
      )}

      {!showLoader && showFiles.length !== 0 && (
        <>
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
              label={"Search streams"}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          </Box>

          <Box>
            {showFiles
              ?.filter((showFile) => {
                if (showFile.fileName.length !== 0) {
                  for (let i = 0; i < showFile.fileName.length; i++) {
                    if (
                      showFile.fileName[i]
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return showFile;
                    }
                  }
                }
                if (searchTerm === "") {
                  return showFile;
                } else if (
                  showFile?.context
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return showFile;
                }

                if (
                  showFile.timestamp
                    .toDate()
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return showFile;
                }

                if (
                  moment(showFile.timestamp.toDate())
                    .fromNow()
                    .toString()
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return showFile;
                }
              })
              ?.map((showFile) => {
                return (
                  <Box sx={{ boxShadow: 5, mt: 2 }} key={showFile.id + 1}>
                    <Paper>
                      <Box
                        sx={{
                          width: "100%",
                          backgroundColor: "#1f2833",
                          height: 30,
                        }}
                      >
                        <Typography
                          sx={{
                            pl: 1,
                            pt: 0.5,
                            fontSize: 14,
                            color: "#66fcf1",
                          }}
                        >
                          <span style={{ color: "#fff" }}>Posted: </span>
                          <span style={{ fontFamily: "Verdana" }}>
                            {moment(showFile?.timestamp?.toDate())?.fromNow()}
                          </span>
                        </Typography>
                      </Box>
                      <Box>
                        <Paper>
                          <Box
                            fullWidth
                            sx={{
                              p: 1,
                              display: "flex",
                            }}
                          >
                            <span style={{ flex: 1 }}>
                              {ReactHtmlParser(showFile.context)}
                            </span>

                            {userDetails?.accountType === "Tutor" && (
                              <Box>
                                <PopupState
                                  variant="popover"
                                  popupId="demo-popup-menu"
                                >
                                  {(popupState) => (
                                    <>
                                      <MoreVertIcon
                                        {...bindTrigger(popupState)}
                                        sx={{
                                          cursor: "pointer",
                                          color: "#1f2833",
                                        }}
                                      />
                                      <Menu {...bindMenu(popupState)}>
                                        <MenuItem
                                          onClick={() => {
                                            updateStream(
                                              showFile.id,
                                              showFile.context
                                            );
                                          }}
                                        >
                                          <ChangeCircleIcon
                                            sx={{
                                              fontSize: "20px",
                                              mr: 1,
                                              color: "#45a29e",
                                            }}
                                          />
                                          <span style={{ color: "#0b0c10" }}>
                                            Update Stream
                                          </span>
                                        </MenuItem>

                                        <MenuItem
                                          onClick={() => {
                                            handleDeleteStream(
                                              showFile.id,
                                              showFile.fileName
                                            );
                                          }}
                                        >
                                          <CloseIcon
                                            sx={{
                                              fontSize: "20px",
                                              mr: 1,
                                              color: "red",
                                            }}
                                          />
                                          <span style={{ color: "#0b0c10" }}>
                                            Delete Stream
                                          </span>
                                        </MenuItem>
                                      </Menu>
                                    </>
                                  )}
                                </PopupState>
                              </Box>
                            )}
                          </Box>
                        </Paper>
                      </Box>

                      <Grid container spacing={2} sx={{ p: 2 }}>
                        {showFile.fileName?.map((showFilesName, index) => {
                          return (
                            <Grid item md={3} xs={12} key={index}>
                              <Box
                                sx={{
                                  boxShadow: 1,
                                  textAlign: "center",
                                }}
                              >
                                <Paper sx={{ p: 1 }}>
                                  {userDetails?.accountType === "Tutor" && (
                                    <RemoveCircleOutlineIcon
                                      sx={{
                                        color: "red",
                                        fontSize: 20,
                                        float: "right",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        handleObjectDelete(
                                          showFile.id,
                                          showFilesName,
                                          showFile.fileUrl[index]
                                        )
                                      }
                                    />
                                  )}
                                  <a
                                    href={showFile.fileUrl[index]}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: "#000",
                                    }}
                                  >
                                    <Box p={1}>
                                      <ShowIcons fileName={showFilesName} />
                                      <Typography>{showFilesName}</Typography>
                                    </Box>
                                  </a>
                                </Paper>
                              </Box>
                            </Grid>
                          );
                        })}
                      </Grid>
                    </Paper>
                  </Box>
                );
              })}
          </Box>
        </>
      )}

      {!showLoader &&
        showFiles.length === 0 &&
        userDetails.accountType === "Student" && (
          <Box mt={5}>
            <Box display="flex" justifyContent="center" alignItems="center">
              <StreamEmpty src={StreamBoard} alt={"image"} />
            </Box>

            <Typography
              sx={{
                textAlign: "center",
                mt: 2,
                fontFamily: "Montserrat",
                fontSize: 19,
              }}
            >
              No streams posted yet
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

export default Streams;
