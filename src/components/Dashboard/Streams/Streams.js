import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  LinearProgress,
  Snackbar,
  Grid,
  Typography,
} from "@mui/material";
import { storage } from "../../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db } from "../../../firebase-config";
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ShowStreamsIcon from "./ShowStreamsIcon";

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
    if (announcementValue && images.length != 0) {
      setLoading(true);

      const docRef = await addDoc(collection(db, "announcements"), {
        subject: classSubject,
        grade: classGrade,
        title: announcementValue,
        classCode: classCode,
      });

      await Promise.all(
        images.map((image) => {
          const storageRef = ref(
            storage,
            "streams/" + classCode + "/" + docRef.id + "/" + image.name
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
            (err) => {
              setSnackBarOpen(true);
              setMessage("An error occurred, please try again");
            },

            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                try {
                  await updateDoc(doc(db, "announcements", docRef.id), {
                    fileName: arrayUnion(image.name),
                    fileUrl: arrayUnion(url),
                    timestamp: serverTimestamp(),
                  });
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
      setSnackBarOpen(true);
      setMessage("Stream created successfully");
      setAnnouncementValue("");
      setImages([]);
      setLoading(false);
    } else if (announcementValue && images.length === 0) {
      try {
        await setDoc(doc(collection(db, "announcements")), {
          subject: classSubject,
          grade: classGrade,
          classCode: classCode,
          title: announcementValue,
        });
        setSnackBarOpen(true);
        setMessage("Stream created successfully");
        setAnnouncementValue("");
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

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      where("classCode", "==", classCode)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newFiles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setShowFiles(newFiles);
    });
  }, []);

  return (
    <>
      {userDetails?.accountType === "Tutor" && (
        <Box sx={{ boxShadow: 5, mt: 3, p: 2 }}>
          <Paper>
            <Box>
              <TextField
                fullWidth
                label="Create Stream"
                sx={{ mb: 1 }}
                value={announcementValue}
                onChange={(e) => setAnnouncementValue(e.target.value)}
              />
              <input
                multiple
                type="file"
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

      {showFiles.map((showFile, key) => {
        return (
          <Box sx={{ boxShadow: 5, mt: 5 }} key={key}>
            <Paper>
              <Box>
                <Paper>
                  <Box
                    fullWidth
                    sx={{
                      p: 1,
                      backgroundColor: "#c5c6c7",
                      display: "flex",
                    }}
                  >
                    <h5 style={{ flex: 1 }}>{showFile?.title}</h5>
                    {/* Delete Stream */}
                  </Box>
                </Paper>
              </Box>
              <Grid container spacing={2} sx={{ p: 2 }}>
                {showFile.fileName.map((showFilesName, index) => {
                  return (
                    <Grid item md={3} xs={12} key={index}>
                      <Box
                        sx={{
                          boxShadow: 1,
                          textAlign: "center",
                        }}
                      >
                        <Paper>
                          {/* button deleteOne */}
                          <a
                            href={showFile.fileUrl[index]}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Box p={1}>
                              <ShowStreamsIcon fileName={showFilesName} />
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
