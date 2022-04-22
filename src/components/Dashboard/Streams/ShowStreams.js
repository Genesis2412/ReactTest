import React, { useState, useEffect } from "react";
import { Box, Paper, Grid, Button, Typography, Snackbar } from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { storage } from "../../../firebase-config";
import { ref, deleteObject } from "firebase/storage";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  where,
  updateDoc,
  onSnapshot,
  orderBy,
  arrayRemove,
  deleteDoc,
  query,
} from "firebase/firestore";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ShowStreamsIcon from "./ShowStreamsIcon";

const ShowStreams = ({ classCode }) => {
  const { userDetails } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [showFiles, setShowFiles] = useState([]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleStorageDelete = async (fileName) => {
    var imagePathRef = "";
    if (
      fileName.includes(".jpg") ||
      fileName.includes(".jpeg") ||
      fileName.includes(".png") ||
      fileName.includes(".gif") ||
      fileName.includes(".svg")
    ) {
      imagePathRef = ref(storage, "images/" + fileName);
    } else if (
      fileName.includes(".mp4") ||
      fileName.includes(".mov") ||
      fileName.includes(".wmv") ||
      fileName.includes(".avi") ||
      fileName.includes(".mkv")
    ) {
      imagePathRef = ref(storage, "videos/" + fileName);
    } else if (
      fileName.includes(".mp3") ||
      fileName.includes(".aac") ||
      fileName.includes(".ogg") ||
      fileName.includes(".wav") ||
      fileName.includes(".wma") ||
      fileName.includes(".flac")
    ) {
      imagePathRef = ref(storage, "videos/" + fileName);
    } else {
      imagePathRef = ref(storage, "files/" + fileName);
    }

    // Delete the file
    deleteObject(imagePathRef)
      .then(() => {})
      .catch((error) => {
        setSnackBarOpen(true);
        setMessage("An error occurred");
      });
  };

  // Delete one material in a stream
  const handleMaterialDelete = async (fileDocId, title, fileName, fileUrl) => {
    let confirmAction = window.confirm(
      "Are you sure to delete " + fileName + " from " + title
    );

    if (confirmAction) {
      //delete from firestore
      const deleteFirestoreRef = doc(db, "announcements", fileDocId);
      try {
        await updateDoc(deleteFirestoreRef, {
          fileName: arrayRemove(fileName),
          fileUrl: arrayRemove(fileUrl),
        });
        handleStorageDelete(fileName);
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  // Delete a stream
  const handleStreamsDelete = async (streamId, streamName) => {
    let confirmAction = window.confirm("Are you sure to delete " + streamName);

    if (confirmAction) {
      try {
        await deleteDoc(doc(db, "announcements", streamId));
        setSnackBarOpen(true);
        setMessage("Deleted Successfully");
      } catch (err) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
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
      {/* Materials */}
      {showFiles.map((showFile) => {
        return (
          <Box sx={{ boxShadow: 5, mt: 5 }} key={showFile?.id + 1}>
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
                    {userDetails?.accountType === "Tutor" && (
                      <CloseIcon
                        sx={{ color: "#870000", cursor: "pointer" }}
                        onClick={() => {
                          handleStreamsDelete(showFile?.id, showFile?.title);
                        }}
                      />
                    )}
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
                          {userDetails?.accountType === "Tutor" && (
                            <Button
                              sx={{
                                position: "relative",
                                left: "45%",
                              }}
                              onClick={() =>
                                handleMaterialDelete(
                                  showFile?.id,
                                  showFile?.title,
                                  showFilesName,
                                  showFile?.fileUrl[index]
                                )
                              }
                            >
                              <RemoveCircleOutlineIcon
                                sx={{
                                  color: "red",
                                  fontSize: 20,
                                }}
                              />
                            </Button>
                          )}

                          <a
                            href={showFile.fileUrl[index]}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Box p={1}>
                              {/* Images Icon */}
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

export default ShowStreams;
