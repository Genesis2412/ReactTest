import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Avatar, Typography, Button } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Link } from "react-router-dom";

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
                    boxShadow: 5,
                    textAlign: "center",
                  }}
                >
                  <Typography variant={"h3"} sx={{ fontSize: 18 }}>
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
                            sx={{ fontSize: 14, pl: 1, color: "#45a29e" }}
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
