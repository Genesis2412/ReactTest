import React from "react";
import { Box, Typography, Grid, Paper, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Logo } from "../GlobalStyles";
import EventIcon from "@mui/icons-material/Event";
import SchoolIcon from "@mui/icons-material/School";
import ChatIcon from "@mui/icons-material/Chat";
import LockIcon from "@mui/icons-material/Lock";
import StudentBookingDiagram from "../../images/Hero/StudentBookingDiagram.jpg";
import StudentLMSDiagram from "../../images/Hero/StudentLMSDiagram.jpg";
import StudentChatDiagram from "../../images/Hero/StudentChatDiagram.jpg";
import StudentJoinBanner from "../../images/Hero/StudentJoinBanner.jpg";
import ParallaxOne from "../../images/Hero/ParallaxOne.jpg";
import ParallaxTwo from "../../images/Hero/ParallaxTwo.jpg";
import {
  StudentBanner,
  StudentBookingImg,
  StudentLMSImg,
  StudentChatImg,
} from "../GlobalStyles";
import { motion } from "framer-motion";

const HeroStudent = () => {
  return (
    <>
      <Box sx={{ mt: 20, textAlign: "center" }}>
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
          sx={{ mt: 3, fontSize: 25 }}
          as={motion.p}
          initial={{ y: -50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { delay: 0.6, duration: 0.7, ease: "easeInOut" },
          }}
        >
          Your new online tutoring platform -{" "}
          <span style={{ fontStyle: "italic" }}>Click less, learn more</span>
        </Typography>
        <Typography
          sx={{ fontSize: 18 }}
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
            md={3}
            xs={12}
            as={motion.div}
            initial={{ y: -1000 }}
            animate={{
              y: 0,
              transition: { delay: 0.8, duration: 1, type: "spring" },
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
                Bookings of your preferred tutors
              </Typography>
              <Typography>
                Our all new booking system allow you to view and book your
                prefered tutor.
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            as={motion.div}
            initial={{ x: -2000 }}
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
              <SchoolIcon sx={{ fontSize: 35, color: "#F47D2E" }} />
              <Typography sx={{ fontWeight: "bold" }}>
                Learning Management System
              </Typography>
              <Typography>
                Manage all of your joined classes in one place.
              </Typography>
            </Paper>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            as={motion.div}
            initial={{ y: 1000 }}
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

          <Grid
            item
            md={3}
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
          <StudentBookingImg src={StudentBookingDiagram} alt={"picture"} />
          <Typography sx={{ mt: 1 }}>
            This simple booking system allow to search any tutors by Tutor name,
            grades and subject.
          </Typography>
          <Typography sx={{ mt: 0.5 }}>
            Book your slot provided by your tutor at a single click.
          </Typography>
          <Typography sx={{ mt: 0.5 }}>
            View all your bookings easily.
          </Typography>
        </Box>
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
      <Box
        sx={{
          textAlign: "center",
          boxShadow: 5,
          mt: 5,
          background: `url(${ParallaxTwo})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
          color: "#fff",
        }}
      >
        <Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.46)", p: 2 }}>
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
