import React, { useState } from "react";
import Navbar from "./Navbar";
import Mobilebar from "./Mobilebar";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Logo } from "../GlobalStyles";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { Link } from "react-router-dom";
import {
  StudentBanner,
  TutorBookingImg,
  TutorLMSImg,
  TutorAssignmentImg,
  StudentChatImg,
  TutorVideocallImg,
} from "../GlobalStyles";
import TutorBookingDiagram from "../../images/Hero/TutorBookingDiagram.jpg";
import TutorLMSDiagram from "../../images/Hero/TutorLMSDiagram.jpg";
import TutorAssignmentDiagram from "../../images/Hero/TutorAssignmentDiagram.jpg";
import StudentChatDiagram from "../../images/Hero/StudentChatDiagram.jpg";
import StudentJoinBanner from "../../images/Hero/StudentJoinBanner.jpg";
import TutorVideocallDiagram from "../../images/Hero/TutorVideocallDiagram.jpg";

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
        <Typography sx={{ fontSize: 16 }}>
          MauTutorz is your go-to e-tutoring platform. Our intutive user
          interface allows you to focus only on learning rather than learning
          the system.
        </Typography>
        <Typography sx={{ fontSize: 16 }}>
          Everything is integrated in the system. No need for unnecessary
          navigations.
        </Typography>

        <Typography sx={{ fontSize: 18, mt: 2 }}>
          You pay-as-you-go. You will only pay for how much resources you use.
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
          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <EventIcon sx={{ fontSize: 35, color: "#2DA2E1" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Control your bookings
              </Typography>
              <Typography>You choose whom to add to your classes.</Typography>
            </Paper>
          </Grid>

          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <SchoolIcon sx={{ fontSize: 35, color: "#F47D2E" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Learning Management System (LMS)
              </Typography>
              <Typography>Manage all of your classes in one place.</Typography>
            </Paper>
          </Grid>

          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <AssignmentIcon sx={{ fontSize: 35, color: "#A2B458" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Manage Assignments
              </Typography>
              <Typography>Add marks, remarks and corrected files</Typography>
            </Paper>
          </Grid>

          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <ChatIcon sx={{ fontSize: 35, color: "#886CC4" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Integrated chat system
              </Typography>
              <Typography>
                Chat with any student in real-time system.
              </Typography>
            </Paper>
          </Grid>

          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <VideoCallIcon sx={{ fontSize: 35, color: "#D44C2C" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Integrated Videoconferencing system
              </Typography>
              <Typography>Hold your classes online.</Typography>
            </Paper>
          </Grid>

          <Grid item md={12 / 6} xs={12}>
            <Paper sx={{ p: 2, boxShadow: 3 }}>
              <LockIcon sx={{ fontSize: 35, color: "#F1A81A" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Secured by design
              </Typography>
              <Typography>
                MauTutorz is secured keeping all your details safe.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Bookings */}
      <Box sx={{ textAlign: "center", p: 2, boxShadow: 5 }}>
        <Typography sx={{ fontSize: 25 }}>Bookings</Typography>
        <TutorBookingImg src={TutorBookingDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Control the access to your classes.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Choose to accept or decline student bookings.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Students cannot join any of your classes without your authorisation.
        </Typography>
      </Box>

      {/* LMS */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography sx={{ fontSize: 25 }}>
          Learning Management System
        </Typography>
        <TutorLMSImg src={TutorLMSDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Create and Manage multiple classes in one central destination.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          View all your classes streams easily without unnecessary navigations.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Need to search for a stream? - Search by any key term you remember
          from the stream
        </Typography>
      </Box>

      {/* Assignments */}
      <Box sx={{ textAlign: "center", mt: 5, p: 2, boxShadow: 5 }}>
        <Typography sx={{ fontSize: 25 }}>
          Manage Assignments - Grading, remarks and share corrected files
        </Typography>
        <TutorAssignmentImg src={TutorAssignmentDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Create and share your assignment with your students.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          View all your students submissions at ease.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>Grade and add remarks easily.</Typography>
        <Typography sx={{ mt: 0.5 }}>
          Need to share your student corrected file. Just send it on the
          submission.
        </Typography>
      </Box>

      {/* Integrated chat system */}
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography sx={{ fontSize: 25 }}>Chats</Typography>
        <StudentChatImg src={StudentChatDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Connect and chat with any students with our end-to-end encrypted chat
          system.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Create groups, create direct messages.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Send emojies, gifs, files and many more.
        </Typography>
      </Box>

      {/* Videocall */}
      <Box sx={{ textAlign: "center", p: 2, boxShadow: 5, mt: 5 }}>
        <Typography sx={{ fontSize: 25 }}> Videoconferencing</Typography>
        <TutorVideocallImg src={TutorVideocallDiagram} alt={"picture"} />
        <Typography sx={{ mt: 1 }}>
          Carry out your classes with our powerful videoconferencing system
          allowing about concurrent 100 users.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Chat with participants and create polls.
        </Typography>
        <Typography sx={{ mt: 0.5 }}>
          Get the most from the conferencing system like share screen, record
          session etc..
        </Typography>
      </Box>

      {/* Get Started */}
      <Box sx={{ mt: 5, textAlign: "center" }}>
        <StudentBanner src={StudentJoinBanner} alt={"banner"} />
        <Typography sx={{ mt: 2 }}>
          Tutorz, it is a pay-as-you-go plan. You will only pay for number of
          resources you uses. if you want enjoy the comfort of e-tutoring, be
          part of the MauTutorz family. Let's
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

export default HeroTutor;
