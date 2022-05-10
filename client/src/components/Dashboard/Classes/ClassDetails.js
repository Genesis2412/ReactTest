import React from "react";
import { useLocation } from "react-router-dom";
import { Box, Paper, Typography, Grid, Tabs, Tab } from "@mui/material";
import ClassesDetailsBanner from "../../../images/ClassesDetailsBanner.jpg";
import { NavLink, Routes, Route } from "react-router-dom";
import Streams from "../Streams/Streams";
import CreateAssignments from "../Assignments/CreateAssignments";
import People from "../People/People";
import { Image, TabsLinks } from "./ClassesElements";
import { Logo } from "../../GlobalStyles";

const ClassDetails = () => {
  const location = useLocation();
  const { classCode } = location.state;
  const { classSubject } = location.state;
  const { classGrade } = location.state;
  const { classDay } = location.state;
  const { classTime } = location.state;

  const navStyles = ({ isActive }) => {
    return {
      color: isActive ? "#45a29e" : "#c5c6c7",
      textDecoration: "none",
      borderBottom: isActive ? "2px solid #66fcf1" : "none",
    };
  };

  const [value, setValue] = React.useState(2);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box>
        <Logo
          to="/dashboard/classes"
          style={{ position: "absolute", color: "#fff" }}
        >
          MauTutorz
        </Logo>
        <Image src={ClassesDetailsBanner} alt="bannerImg" />
      </Box>
      <Box>
        <Paper>
          <Box sx={{ boxShadow: 5, p: 2 }}>
            <Typography sx={{ fontSize: 17 }}>{classSubject}</Typography>

            <Typography sx={{ fontSize: 15 }}>Grade {classGrade}</Typography>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Paper>
          <Box
            sx={{
              boxShadow: 5,
              p: 2,
              mt: 1,
              backgroundColor: "#1f2833",
              textAlign: "center",
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <NavLink
                  style={navStyles}
                  to="streams"
                  state={{
                    classCode: classCode,
                    classSubject: classSubject,
                    classGrade: classGrade,
                  }}
                >
                  <TabsLinks>Streams</TabsLinks>
                </NavLink>
              </Grid>
              <Grid item xs={4}>
                <NavLink
                  style={navStyles}
                  to="assignments"
                  state={{
                    classCode: classCode,
                    classSubject: classSubject,
                    classGrade: classGrade,
                  }}
                >
                  <TabsLinks>Assignments</TabsLinks>
                </NavLink>
              </Grid>
              <Grid item xs={4}>
                <NavLink
                  style={navStyles}
                  to="people"
                  state={{
                    classCode: classCode,
                    classSubject: classSubject,
                    classGrade: classGrade,
                    classDay: classDay,
                    classTime: classTime,
                  }}
                >
                  <TabsLinks>People</TabsLinks>
                </NavLink>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>

      <Routes>
        <Route path="streams" element={<Streams />} />
        <Route path="assignments" element={<CreateAssignments />} />
        <Route path="people" element={<People />} />
      </Routes>
    </>
  );
};

export default ClassDetails;
