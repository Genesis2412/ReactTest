import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper, Grid, TextField, Button } from "@mui/material";

const ClassDetails = () => {
  //   const location = useLocation();
  //   const { classState } = location.state;
  //   console.log(classState); // output: "the-page-id"

  const [images, setImages] = useState([]);
  const [urls, setUrl] = useState([]);

  return (
    <>
      <Box>
        <img
          src="https://png.pngtree.com/thumb_back/fh260/background/20200714/pngtree-modern-double-color-futuristic-neon-background-image_351866.jpg"
          alt="Hello"
          height={250}
          width={"100%"}
        />
      </Box>

      <Box>
        <Paper>
          <Box sx={{ boxShadow: 5, p: 2 }}>
            <h3>Design and Technology</h3>
            <p>Mathematics</p>
            <p>Grade 8</p>
          </Box>
        </Paper>
      </Box>

      <Box sx={{ boxShadow: 5, mt: 1 }}>
        <Paper>
          <TextField fullWidth label="Create Announcement" sx={{ mb: 1 }} />
          <input accept="" multiple type="file" />
        </Paper>
        <Button
          fullWidth
          sx={{ backgroundColor: "#45a29e", color: "#fff", mt: 2 }}
        >
          Create
        </Button>
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
            <Grid item xs={4}>
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
