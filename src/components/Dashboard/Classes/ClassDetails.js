import React, { useState, useRef } from "react";
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
import { doc, setDoc, collection } from "firebase/firestore";

const ClassDetails = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { classSubject } = location.state;
  const { classGrade } = location.state;

  const [images, setImages] = useState([]);
  const [announcementValue, setAnnoucementValue] = useState();
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

  console.log(images);

  const handleUpload = () => {
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
          (err) => console.log(err),
          // on Success
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((url) =>
              setDoc(doc(collection(db, "announcements")), {
                subject: classSubject,
                grade: classGrade,
                fileUrl: url,
                classCode: classCode,
                fileName: image.name,
                format: image.type,
                title: announcementValue,
              })
            );
          }
        );
      });
      setImages();
      fileInputRef.current.value = "";
    } else if (announcementValue && !images) {
      setDoc(doc(collection(db, "announcements")), {
        subject: classSubject,
        grade: classGrade,
        classCode: classCode,
        title: announcementValue,
      });
    } else {
      alert("Please enter Announcement");
    }
  };

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

      <Box sx={{ boxShadow: 5, mt: 1 }}>
        <Paper>
          <TextField
            fullWidth
            label="Create Announcement/ To add to Existing annoucement, enter exactly SAME Name"
            sx={{ mb: 1 }}
            value={announcementValue}
            onChange={(e) => setAnnoucementValue(e.target.value)}
          />
          <input
            multiple
            type="file"
            ref={fileInputRef}
            onChange={handleChange}
          />
        </Paper>
        <Button
          fullWidth
          sx={{ backgroundColor: "#45a29e", color: "#fff", mt: 2 }}
          onClick={handleUpload}
        >
          Create
        </Button>

        <LinearProgress variant="determinate" value={progress} />
      </Box>

      {/* Materials */}
      <Box sx={{ boxShadow: 5, mt: 5 }}>
        <Paper>
          <Box>
            <Paper>
              <Box sx={{ p: 1, backgroundColor: "#c5c6c7" }}>
                <h5>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Deleniti porro quis deserunt voluptatem eius nulla qui
                  aspernatur sapiente dicta, eveniet unde quaerat nobis quia
                  iste eligendi vitae aliquam explicabo culpa?
                </h5>
              </Box>
            </Paper>
          </Box>
          <Grid container spacing={2} sx={{ p: 2 }}>
            <Grid item xs={3}>
              <Box sx={{ boxShadow: 1 }}>
                <Paper>
                  <a href="" target="blank">
                    <Box p={1}>
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                        alt="profile"
                        width={40}
                      />
                      Profile
                    </Box>
                  </a>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </>
  );
};

export default ClassDetails;
