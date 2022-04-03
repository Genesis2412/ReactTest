import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper, Grid, TextField, Button, Typography } from "@mui/material";
import { storage } from "../../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const ClassDetails = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { classSubject } = location.state;
  const { classGrade } = location.state;
  console.log(classCode + " " + classSubject + " " + classGrade); // output: "the-page-id"

  const [images, setImages] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  //getting images
  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["id"] = Math.random();
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = () => {
    images.map((image) => {
      const storageRef = ref(storage, "/files/" + image.name);
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
          getDownloadURL(uploadTask.snapshot.ref).then((url) => setUrls(url));
        }
      );
    });
  };

  //   console.log(urls);

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
          <TextField fullWidth label="Create Announcement" sx={{ mb: 1 }} />
          <input accept="" multiple type="file" onChange={handleChange} />
        </Paper>
        <Button
          fullWidth
          sx={{ backgroundColor: "#45a29e", color: "#fff", mt: 2 }}
          onClick={handleUpload}
        >
          Create
        </Button>
        <h3>Uploaded {progress}%</h3>
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
                  <Box p={1}>
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png"
                      alt="profile"
                      width={40}
                    />
                    Profile
                  </Box>
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
