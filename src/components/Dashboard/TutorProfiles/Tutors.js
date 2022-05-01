import React, { useState, useEffect } from "react";
import { Grid, Box, Paper, Avatar, Typography, TextField } from "@mui/material";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Link } from "react-router-dom";
import { Logo } from "../../GlobalStyles";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { TutorProfileIcon } from "../../GlobalStyles";
import NoTutorProfileIcon from "../../../images/NoTutorProfileIcon.svg";

const Tutors = () => {
  const [profiles, setProfiles] = useState([]);
  const [profileClasses, setProfileClasses] = useState([]);

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

  useEffect(() => {
    const q = query(collection(db, "createdClasses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newClasses = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setProfileClasses(newClasses);
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [hideTextField, setHideTextField] = useState(false);

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
      <Grid container spacing={2}>
        {profiles.map((profile, key) => {
          return (
            <Grid item xs={12} md={4} key={key}>
              <Link
                to="tutor"
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
                    alt={profile.tutorFirstName}
                    src={profile.tutorProfilePic}
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
                    {profileClasses?.map((profileClass, key) => {
                      return (
                        <Box key={key}>
                          <Typography sx={{ fontSize: 15, color: "#66fcf1" }}>
                            {profileClass.subject +
                              " Grade " +
                              profileClass.grade}
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
  );
};

export default Tutors;
