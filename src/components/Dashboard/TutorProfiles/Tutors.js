import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Avatar, Typography, TextField } from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Link } from "react-router-dom";
import { Logo } from "../../GlobalStyles";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { TutorProfileIcon } from "../../GlobalStyles";
import NoTutorProfileIcon from "../../../images/NoTutorProfileIcon.svg";

const Tutors = () => {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [hideTextField, setHideTextField] = useState(false);

  if (profiles.length !== 0) {
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

        {/* search */}
        <Box sx={{ float: "right", mt: 1 }}>
          {hideTextField && (
            <TextField
              size="small"
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
            />
          )}

          <PersonSearchIcon
            sx={{ cursor: "pointer", position: "relative", top: 6, ml: 1 }}
            onClick={() => {
              setHideTextField((prevCheck) => !prevCheck);
            }}
          />
        </Box>
        {profiles
          .filter((profile) => {
            // filter by subjects
            for (let i = 0; i < profile.subjects.length; i++) {
              if (
                profile.subjects[i]
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              ) {
                return profile;
              }
            }

            // filter by grades
            for (let i = 0; i < profile.grades.length; i++) {
              if (
                (
                  "grade " + profile.grades[i].toString().toLowerCase()
                ).includes(searchTerm.toLowerCase())
              ) {
                return profile;
              }
            }

            if (searchTerm === "") {
              return profile;
            } else if (
              profile?.name?.firstName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return profile;
            } else if (
              profile?.name?.lastName
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return profile;
            }
          })
          .map((profile) => {
            return (
              <Grid container spacing={2} key={profile.email}>
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
                            <Typography
                              sx={{ fontSize: 14, pl: 1, color: "#66fcf1" }}
                              key={index++}
                            >
                              {subject}, Grade {profile.grades[index]}{" "}
                            </Typography>
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
  } else
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
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <TutorProfileIcon alt="banner" src={NoTutorProfileIcon} />
          <Typography>Hehe, Tutors coming soon!</Typography>
        </Box>
      </>
    );
};

export default Tutors;
