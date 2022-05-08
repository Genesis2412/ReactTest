import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Avatar, Typography, TextField } from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Link } from "react-router-dom";
import { Logo } from "../../GlobalStyles";
import { useUserAuth } from "../../../Context/UserAuthContext";
import TutorProfileBanner from "../../../images/TutorProfileBanner.png";
import WavesTutorProfile from "../../../images/WavesTutorProfile.svg";
import { TutorBannerContainer } from "../../GlobalStyles";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const Tutors = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(true);
  const { userDetails } = useUserAuth();

  //reading all tutors details
  useEffect(() => {
    setShowLoader(true);
    const q = query(collection(db, "tutors"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newProfiles = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfiles(newProfiles);
      setShowLoader(false);
    });
  }, []);

  return (
    <>
      {userDetails?.accountType === "Student" && (
        <>
          <LoadingSpinner stateLoader={showLoader} />

          <Box
            sx={{
              boxShadow: 15,
              borderRadius: 2,
            }}
          >
            <Typography textAlign={"right"}>
              <Logo
                to="/dashboard/classes"
                style={{
                  textAlign: "left",
                  color: "#2f3c7e",
                  paddingRight: "15px",
                  fontSize: 30,
                }}
              >
                MauTutorz
              </Logo>
            </Typography>

            <Box display="flex" justifyContent="center" alignItems="center">
              <TutorBannerContainer src={TutorProfileBanner} alt="banner" />
            </Box>

            <Box sx={{ textAlign: "center", pt: 5 }}>
              <Typography
                sx={{
                  fontSize: 20,
                  color: "#0f5298",
                  fontFamily: "Cursive",
                  fontWeight: "bold",
                }}
              >
                Focus on the skills you need
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                  fontSize: 17,
                  color: "#0f5298",
                  fontFamily: "Monospace",
                }}
              >
                Prepare to achieve your goals with private tutors
              </Typography>
              <Typography
                sx={{
                  fontSize: 17,
                  color: "#0f5298",
                  fontFamily: "Monospace",
                }}
              >
                Immerse yourself in a new culture
              </Typography>
              <Typography
                sx={{
                  fontSize: 17,
                  color: "#0f5298",
                  fontFamily: "Monospace",
                }}
              >
                Succeed in your career
              </Typography>
              <Typography
                sx={{
                  pt: 1,
                  fontSize: 20,
                  color: "#900C3F",
                  fontFamily: "Serif",
                }}
              >
                Find your tutor now
              </Typography>
              <Typography
                sx={{ fontSize: 14, color: "#0f5298", fontFamily: "Monospace" }}
              >
                Search by name, email, subjects, grades
              </Typography>
            </Box>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <TextField
                label={"Search"}
                size="small"
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                }}
              />
            </Box>
            <img
              src={WavesTutorProfile}
              alt="waves"
              style={{ width: "100%", height: "16vh" }}
            />
          </Box>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            {profiles
              ?.filter((profile) => {
                if (profile?.classes?.length !== 0) {
                  for (let i = 0; i < profile?.classes?.length; i++) {
                    if (
                      profile?.classes[i].subject
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    ) {
                      return profile;
                    }
                    if (
                      (
                        "grade " +
                        profile?.classes[i]?.grade.toString().toLowerCase()
                      ).includes(searchTerm.toLowerCase())
                    ) {
                      return profile;
                    }
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
                } else if (
                  (
                    profile?.name?.firstName.toLowerCase() +
                    " " +
                    profile?.name?.lastName.toLowerCase()
                  ).includes(searchTerm.toLowerCase())
                ) {
                  return profile;
                } else if (
                  (
                    profile?.name?.lastName.toLowerCase() +
                    " " +
                    profile?.name?.firstName.toLowerCase()
                  ).includes(searchTerm.toLowerCase())
                ) {
                  return profile;
                } else if (
                  profile?.email
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                ) {
                  return profile;
                }
              })
              ?.map((profile, key) => {
                return (
                  <Grid item xs={12} md={4} key={key}>
                    <Link
                      to="tutor"
                      style={{ textDecoration: "none" }}
                      state={{
                        email: profile.email,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Avatar
                          alt={profile?.name?.firstName}
                          src={profile?.profilePic}
                          sx={{
                            width: 200,
                            height: 200,
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          mt: 1,
                        }}
                      >
                        <Paper
                          sx={{
                            height: "100%",
                            p: 2,
                            boxShadow: 15,
                            textAlign: "center",
                            backgroundColor: "#1f2833",
                            borderRadius: 3,
                            width: "70%",
                          }}
                        >
                          <Typography
                            variant={"h3"}
                            sx={{ fontSize: 18, color: "#c5c6c7" }}
                          >
                            {profile?.title +
                              " " +
                              profile?.name?.firstName +
                              " " +
                              profile?.name?.lastName}
                          </Typography>

                          <Typography sx={{ fontSize: 16, color: "#c5c6c7" }}>
                            Teaches:
                          </Typography>
                          {profile.classes?.map((classx, key) => {
                            return (
                              <Box key={key}>
                                <Typography
                                  sx={{ fontSize: 15, color: "#66fcf1" }}
                                >
                                  {classx?.subject + " Grade " + classx?.grade}
                                </Typography>
                              </Box>
                            );
                          })}
                        </Paper>
                      </Box>
                    </Link>
                  </Grid>
                );
              })}
          </Grid>
        </>
      )}
    </>
  );
};

export default Tutors;
