import React, { useState } from "react";
import Navbar from "./Navbar";
import Mobilebar from "./Mobilebar";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Logo } from "../GlobalStyles";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";
import StudentBookingDiagram from "../../images/Hero/StudentBookingDiagram.jpg";
import StudentLMSDiagram from "../../images/Hero/StudentLMSDiagram.jpg";
import StudentChatDiagram from "../../images/Hero/StudentChatDiagram.jpg";
import StudentJoinBanner from "../../images/Hero/StudentJoinBanner.jpg";
import {
  StudentBanner,
  StudentBookingImg,
  StudentLMSImg,
  StudentChatImg,
} from "../GlobalStyles";

import { Link } from "react-router-dom";

const HeroStudent = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Mobilebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />

      <Box sx={{ mt: 20, textAlign: "center" }}>
        <Logo to="/">MauTutorz</Logo>
        <Typography sx={{ mt: 3, fontSize: 25 }}>
          Your new online tutoring platform -{" "}
          <span style={{ fontStyle: "italic" }}>Click less, learn more</span>
        </Typography>
        <Typography sx={{ fontSize: 18 }}>
          MauTutorz is your go-to e-tutoring platform. Our intutive user
          interface allows you to focus only on learning rather than learning
          the system.
        </Typography>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            sx={[
              {
                "&:hover": {
                  backgroundColor: "#c5c6c7",
                  color: "#0b0c10",
                },
                backgroundColor: "#45a29e",
                color: "#fff",
                mt: 2,
              },
            ]}
          >
            Get Started
          </Button>
        </Link>
      </Box>

      <Box sx={{ textAlign: "center", p: 5, mt: 5 }}>
        <Grid
          container
          spacing={2}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item md={3} xs={12}>
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

          <Grid item md={3} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <SchoolIcon sx={{ fontSize: 35, color: "#F47D2E" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Learning Management System
              </Typography>
              <Typography>
                Manage all of your joined classes in one place.
              </Typography>
            </Paper>
          </Grid>

          <Grid item md={3} xs={12}>
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

          <Grid item md={3} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <LockIcon sx={{ fontSize: 35, color: "#F1A81A" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Secure by design
              </Typography>
              <Typography>
                Do not worry, MauTutorz is secured keeping all your details
                safe.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bookings */}
      <Box sx={{ textAlign: "center", p: 2, boxShadow: 5 }}>
        <Typography sx={{ fontSize: 25 }}>Bookings</Typography>
        <StudentBookingImg src={StudentBookingDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          This simple booking system allow to search any tutors by Tutor name,
          grades and subject.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Book your slot provided by your tutor at a single click.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>View all your bookings easily.</Typography>
      </Box>

      {/* LMS */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography sx={{ fontSize: 25 }}>
          Learning Management System
        </Typography>
        <StudentLMSImg src={StudentLMSDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Manage multiple classes in one central destination.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          View all your classes streams easily without unnecessary navigations.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Need to search for a stream? - Search by any key term you remember
          from the stream
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          View all your classes assignments easily without unnecessary
          navigations.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Need to search for an assignment? - Search by any key term you
          remember from the assignment.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Submit your assignments reliably and rest back.
        </Typography>
      </Box>

      {/* Integrated chat system */}
      <Box sx={{ textAlign: "center", p: 2, boxShadow: 5, mt: 5 }}>
        <Typography sx={{ fontSize: 25 }}>Chats</Typography>
        <StudentChatImg src={StudentChatDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Connect and chat with any tutors with our end-to-end encrypted chat
          system.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Create groups, create direct messages.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Send emojies, gifs, files and many more.
        </Typography>
      </Box>

      <Box sx={{ mt: 5, textAlign: "center" }}>
        <StudentBanner src={StudentJoinBanner} alt={"banner"} />
        <Typography sx={{ mt: 2 }}>
          Student, if you want enjoy the comfort of e-tutoring, be part of the
          MauTutorz family, Let's
        </Typography>
        <Link to="/register" style={{ textDecoration: "none" }}>
          <Button
            sx={[
              {
                "&:hover": {
                  backgroundColor: "#c5c6c7",
                  color: "#0b0c10",
                },
                backgroundColor: "#45a29e",
                color: "#fff",
                mt: 1,
              },
            ]}
          >
            Get Started
          </Button>
        </Link>
      </Box>

      <Box
        sx={{ textAlign: "center", mt: 5, backgroundColor: "#1f2833", p: 1 }}
      >
        <Logo to="/" style={{ color: "#66fcf1", fontSize: 20 }}>
          MauTutorz
        </Logo>
        <Typography sx={{ color: "#fff", mt: 0.5 }}>
          All rights reserved
        </Typography>
      </Box>
    </>
  );
};

export default HeroStudent;
