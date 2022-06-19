import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
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
import ParallaxOne from "../../images/Hero/ParallaxOne.jpg";
import ParallaxTwo from "../../images/Hero/ParallaxTwo.jpg";
import ParallaxThree from "../../images/Hero/ParallaxThree.jpg";
import { motion } from "framer-motion";

const HeroTutor = () => {
  return (
    <>
      <Box sx={{ mt: 25, textAlign: "center" }}>
        <Logo
          to="/"
          as={motion.span}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.3, duration: 0.7, ease: "easeInOut" },
          }}
        >
          MauTutorz
        </Logo>
        <Typography
          sx={{ mt: 4, fontSize: 25 }}
          as={motion.p}
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.6, duration: 0.7, ease: "easeInOut" },
          }}
        >
          Your new online tutoring platform
        </Typography>
        <Typography
          sx={{ fontSize: 16 }}
          as={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.7, duration: 0.7, ease: "easeInOut" },
          }}
        >
          MauTutorz is your go-to e-tutoring platform. Our intutive user
          interface allows you to focus only on learning rather than learning
          the system.
        </Typography>
        <Typography
          sx={{ fontSize: 16 }}
          as={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.8, duration: 0.7, ease: "easeInOut" },
          }}
        >
          Everything is integrated in the system. No need for unnecessary
          navigations.
        </Typography>

        <Typography
          sx={{ fontSize: 18, mt: 2 }}
          as={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.9, duration: 0.7, ease: "easeInOut" },
          }}
        >
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
          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ x: -1000 }}
            animate={{
              x: 0,
              transition: { delay: 1, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
              <EventIcon sx={{ fontSize: 35, color: "#2DA2E1" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Control your bookings
              </Typography>
              <Typography>You choose whom to add to your classes.</Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 1.1, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 35, color: "#F47D2E" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Learning Management System (LMS)
              </Typography>
              <Typography>Manage all of your classes in one place.</Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 1.2, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
              <AssignmentIcon sx={{ fontSize: 35, color: "#A2B458" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Manage Assignments
              </Typography>
              <Typography>Add marks, remarks and corrected files</Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 1.3, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
              <ChatIcon sx={{ fontSize: 35, color: "#886CC4" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Integrated chat system
              </Typography>
              <Typography>
                Chat with any student in real-time system.
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 1.4, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
              <VideoCallIcon sx={{ fontSize: 35, color: "#D44C2C" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Integrated Videoconferencing system
              </Typography>
              <Typography>Hold your classes online.</Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={12 / 6}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 1.5, duration: 1, type: "spring" },
            }}
          >
            <Paper
              sx={{ p: 2, boxShadow: 3 }}
              as={motion.div}
              animate={{
                y: [5, 0, 5],
                transition: {
                  duration: 2,
                  ease: "linear",
                  repeat: "Infinity",
                },
              }}
            >
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
      <Box
        sx={{
          textAlign: "center",
          boxShadow: 5,
          background: `url(${ParallaxOne})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          color: "#fff",
        }}
      >
        <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.46)", p: 2 }}>
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
      <Box
        sx={{
          textAlign: "center",
          mt: 5,
          boxShadow: 5,
          background: `url(${ParallaxTwo})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          color: "#fff",
        }}
      >
        <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.46)", p: 2 }}>
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
          <Typography sx={{ mt: 0.5 }}>
            Grade and add remarks easily.
          </Typography>
          <Typography sx={{ mt: 0.5 }}>
            Need to share your student corrected file. Just send it on the
            submission.
          </Typography>
        </Box>
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
      <Box
        sx={{
          textAlign: "center",
          boxShadow: 5,
          mt: 5,
          background: `url(${ParallaxThree})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          color: "#fff",
        }}
      >
        <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.46)", p: 2 }}>
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
