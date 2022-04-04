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
import { storage } from "../../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
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
} from "firebase/firestore";

const ClassDetails = () => {
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
                    format: arrayUnion(image.type),
                    fileName: arrayUnion(image.name),
                    fileUrl: arrayUnion(url),
                  });
                } else {
                  setDoc(doc(collection(db, "announcements")), {
                    subject: classSubject,
                    grade: classGrade,
                    title: announcementValue,
                    classCode: classCode,
                    format: [image.type],
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
    } else if (announcementValue && !images) {
      setDoc(doc(collection(db, "announcements")), {
        subject: classSubject,
        grade: classGrade,
        classCode: classCode,
        title: announcementValue,
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

  return (
    <>
      <Box>
        <img
          src="https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
          alt="bannerImg"
          height={250}
          width={"100%"}
        />
      </Box>
      <Box>
        <Paper>
          <Box sx={{ boxShadow: 5, p: 2 }}>
            <Typography sx={{ fontSize: 17 }}>{classSubject}</Typography>

            <Typography sx={{ fontSize: 15 }}>Grade {classGrade}</Typography>
          </Box>
        </Paper>
      </Box>
      {/* OVERFLOW!!!! */}
      <Box sx={{ boxShadow: 5, mt: 1 }}>
        <Paper>
          <Box>
            <TextField
              fullWidth
              label="Create Announcement/ To add to EXISTING announcement, enter exactly SAME Name"
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
          sx={{ backgroundColor: "#45a29e", color: "#fff", mt: 2 }}
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
          <Box sx={{ boxShadow: 5, mt: 5 }}>
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
                    <Grid item xs={3}>
                      <Box sx={{ boxShadow: 1, textAlign: "center" }}>
                        <Paper>
                          <a
                            href={showFile.fileUrl[index]}
                            target="_blank"
                            style={{ textDecoration: "none", color: "#000" }}
                          >
                            <Box p={1}>
                              {/* Conditions */}
                              <img
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                                alt="profile"
                                width={40}
                              />
                              <Typography> {showFilesName}</Typography>
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

export default ClassDetails;
