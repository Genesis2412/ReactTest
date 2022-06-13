import React, { useState } from "react";
import Navbar from "./Navbar";
import Mobilebar from "./Mobilebar";
import { Box, Typography, Grid, Paper } from "@mui/material";
import { Logo } from "../GlobalStyles";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";

const HeroTutor = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Mobilebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />

      <Box sx={{ mt: 25, textAlign: "center" }}>
        <Logo to="/">MauTutorz</Logo>
        <Typography sx={{ mt: 4, fontSize: 25 }}>
          Your new online tutoring platform
        </Typography>
        <Typography sx={{ fontSize: 18 }}>
          MauTutorz is your go-to e-tutoring platform. Our intutive user
          interface allows you to focus only on learning rather than learning
          the system.
        </Typography>
      </Box>

      <Box sx={{ textAlign: "center", p: 5, mt: 5 }}>
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={3}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <EventIcon sx={{ fontSize: 35, color: "#2DA2E1" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Bookings of your preferred tutors
              </Typography>
              <Typography>
                Our all new booking system allow you to view and book your
                prefered tutor.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <SchoolIcon sx={{ fontSize: 35, color: "#F47D2E" }} />
              <Typography>Learning management system</Typography>
              <Typography>
                Manage all of your joined classes in one place.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <ChatIcon sx={{ fontSize: 35, color: "#886CC4" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Integrated chat system
              </Typography>
              <Typography>
                Chat with any tutors in higly reliable real-time integrated chat
                system.
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={3}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <LockIcon sx={{ fontSize: 35, color: "#F1A81A" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Secured by design
              </Typography>
              <Typography>
                Do not worry, MauTutorz is secured keeping all your details
                safe.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default HeroTutor;
