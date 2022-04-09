import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Avatar, Typography, Button } from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Link } from "react-router-dom";
import { Logo } from "../../GlobalStyles";

const Booking = () => {
  const [profiles, setProfiles] = useState([]);

  //reading all tutors details
  useEffect(() => {
    const q = query(collection(db, "tutors"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newProfiles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfiles(newProfiles);
    });
  }, []);

  return (
    <>
      <Typography textAlign={"right"}>
        <Logo
          to="/dashboard/classes"
          style={{ textAlign: "left", color: "#2f3c7e", fontSize: 30 }}
        >
          Tutorhuntz
        </Logo>
      </Typography>
      {profiles.map((profile) => {
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Link
                to="tutor"
                state={{
                  email: profile.email,
                }}
              >
                <Avatar
                  alt={profile.name.firstName}
                  src={profile.profilePic}
                  sx={{
                    width: 200,
                    height: 200,
                    position: "relative",
                    left: "25%",
                  }}
                />
              </Link>
              <Box mt={1}>
                <Paper
                  sx={{
                    height: "100%",
                    p: 2,
                    boxShadow: 15,
                    textAlign: "center",
                    backgroundColor: "#1f2833",
                    borderRadius: 3,
                  }}
                >
                  <Typography
                    variant={"h3"}
                    sx={{ fontSize: 18, color: "#c5c6c7" }}
                  >
                    {profile.title +
                      " " +
                      profile.name.firstName +
                      " " +
                      profile.name.lastName}
                  </Typography>

                  <Box>
                    {profile.subjects.map((subject, index) => {
                      return (
                        <>
                          <Typography
                            sx={{ fontSize: 14, pl: 1, color: "#66fcf1" }}
                          >
                            {subject}, Grade {profile.grades[index]}{" "}
                          </Typography>
                        </>
                      );
                    })}
                  </Box>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        );
      })}
    </>
  );
};

export default Booking;
