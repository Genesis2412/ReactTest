import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Typography,
  LinearProgress,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
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
  query,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
  onSnapshot,
  orderBy,
  arrayRemove,
} from "firebase/firestore";
import ImageIcon from "../../../images/ImageIcon.jpg";
import PdfIcon from "../../../images/PdfIcon.jpg";
import SheetIcon from "../../../images/SheetIcon.jpg";
import VideoIcon from "../../../images/VideoIcon.jpg";
import MusicIcon from "../../../images/MusicIcon.jpg";
import PowerPointIcon from "../../../images/PowerPointIcon.jpg";
import TextIcon from "../../../images/TextIcon.jpg";
import WordIcon from "../../../images/WordIcon.jpg";

const Streams = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { classSubject } = location.state;
  const { classGrade } = location.state;

  const [images, setImages] = useState([]);
  var [announcementValue, setAnnouncementValue] = useState("");
  const [progress, setProgress] = useState(0);

  const fileInputRef = useRef();

  //getting images
  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const readOne = async (announcement) => {
    var docId = "";
    const q = query(
      collection(db, "announcements"),
      where("title", "==", announcementValue)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    return docId;
  };

  const handleUpload = async () => {
    var storageRef = "";
    if (images.length === 0) {
      console.log("Zero");
    }

    if (announcementValue && images) {
      images.map((image) => {
        if (
          image.type === "image/jpeg" ||
          image.type === "image/jpg" ||
          image.type === "image/png" ||
          image.type === "image/gif" ||
          image.type === "image/svg"
        ) {
          storageRef = ref(storage, "/images/" + image.name);
        } else if (
          image.type === "video/mp4" ||
          image.type === "video/mov" ||
          image.type === "video/wmv" ||
          image.type === "video/flv" ||
          image.type === "video/avi" ||
          image.type === "video/mkv"
        ) {
          storageRef = ref(storage, "/videos/" + image.name);
        } else {
          storageRef = ref(storage, "/files/" + image.name);
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
          // on Success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              readOne().then((response) => {
                if (response) {
                  const updateRef = doc(db, "announcements", response);
                  updateDoc(updateRef, {
                    fileName: arrayUnion(image.name),
                    fileUrl: arrayUnion(url),
                  });
                } else {
                  setDoc(doc(collection(db, "announcements")), {
                    subject: classSubject,
                    grade: classGrade,
                    title: announcementValue,
                    classCode: classCode,
                    fileName: [image.name],
                    fileUrl: [url],
                  });
                }
              });
            });
          }
        );
      });
      setImages((prevState) => []);
      fileInputRef.current.value = "";
      setAnnouncementValue("");
    } else if (announcementValue && images.length === 0) {
      setDoc(doc(collection(db, "announcements")), {
        subject: classSubject,
        grade: classGrade,
        classCode: classCode,
        title: announcementValue,
        fileName: [],
        fileUrl: [],
      });

      setAnnouncementValue("");
      setProgress(100);
    } else {
      alert("Please enter Announcement");
    }
  };

  const [showFiles, setShowFiles] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("title"),
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

  const handleDelete = async (fileDocId, title, fileName, fileUrl) => {
    let confirmAction = window.confirm(
      "Are you sure to delete " + fileName + " from " + title
    );

    if (confirmAction) {
      //delete from firestore
      const deleteFirestoreRef = doc(db, "announcements", fileDocId);
      await updateDoc(deleteFirestoreRef, {
        fileName: arrayRemove(fileName),
        fileUrl: arrayRemove(fileUrl),
      });
      // Create a reference to the file to delete
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
        .then(() => {
          alert("Deleted Successfully");
        })
        .catch((error) => {
          alert("An error occurred");
        });
    } else {
      alert("Action canceled");
    }
  };

  return (
    <>
      <Box sx={{ boxShadow: 5, mt: 3, p: 1 }}>
        <Paper>
          <Typography xs={{ fontSize: 8 }}>
            Create Announcement/ To add to{" "}
            <span style={{ color: "red" }}>EXISTING</span> announcement, enter
            <span style={{ color: "red" }}>
              {" "}
              EXACTLY SAME ANNOUNCEMENT NAME
            </span>
          </Typography>
          <Box>
            <TextField
              fullWidth
              label=""
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
        >
          Create
        </Button>

        <LinearProgress
          color="secondary"
          variant="determinate"
          value={progress}
        />
      </Box>

      {/* Materials */}
      {showFiles.map((showFile) => {
        return (
          <Box sx={{ boxShadow: 5, mt: 5 }} key={showFile.id + 1}>
            <Paper>
              <Box>
                <Paper>
                  <Box sx={{ p: 1, backgroundColor: "#c5c6c7" }}>
                    <h5>{showFile.title}</h5>
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
                          <Button
                            sx={{
                              position: "relative",
                              left: "45%",
                              color: "red",
                            }}
                            onClick={() =>
                              handleDelete(
                                showFile.id,
                                showFile.title,
                                showFilesName,
                                showFile.fileUrl[index]
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

                          <a
                            href={showFile.fileUrl[index]}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Box p={1}>
                              {/* Images Icon */}
                              {(showFilesName.includes(".jpg") ||
                                showFilesName.includes(".jpeg") ||
                                showFilesName.includes(".png") ||
                                showFilesName.includes(".gif") ||
                                showFilesName.includes(".svg")) && (
                                <img
                                  src={ImageIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}
                              {/* Video Icons */}
                              {(showFilesName.includes(".mp4") ||
                                showFilesName.includes(".mov") ||
                                showFilesName.includes(".wmv") ||
                                showFilesName.includes(".avi") ||
                                showFilesName.includes(".mkv")) && (
                                <img
                                  src={VideoIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}
                              {/* SpreadSheet Icons */}
                              {(showFilesName.includes(".xlsx") ||
                                showFilesName.includes(".xlsm") ||
                                showFilesName.includes(".xls") ||
                                showFilesName.includes(".csv")) && (
                                <img
                                  src={SheetIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}
                              {/* PDF Icon */}
                              {showFilesName.includes(".pdf") && (
                                <img
                                  src={PdfIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}

                              {/* Text Icon */}
                              {(showFilesName.includes(".txt") ||
                                showFilesName.includes(".rtf")) && (
                                <img
                                  src={TextIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}

                              {/* Word Icon */}
                              {(showFilesName.includes(".doc") ||
                                showFilesName.includes(".docx") ||
                                showFilesName.includes(".wpd")) && (
                                <img
                                  src={WordIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}

                              {/* Powerpoint Icon */}
                              {(showFilesName.includes(".pptx") ||
                                showFilesName.includes(".pptm") ||
                                showFilesName.includes(".ppt")) && (
                                <img
                                  src={PowerPointIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}

                              {/* Music Icon */}
                              {(showFilesName.includes(".mp3") ||
                                showFilesName.includes(".aac") ||
                                showFilesName.includes(".ogg") ||
                                showFilesName.includes(".wav") ||
                                showFilesName.includes(".wma") ||
                                showFilesName.includes(".flac")) && (
                                <img
                                  src={MusicIcon}
                                  alt="thumbnail"
                                  height={40}
                                />
                              )}
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
    </>
  );
};

export default Streams;
