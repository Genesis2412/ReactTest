import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  Typography,
  CardContent,
  CardActionArea,
  CardMedia,
  CardActions,
  Button,
} from "@mui/material";
import {
  AvatarContainer,
  VideoCallMaterialIcon,
  ChatMaterialIcon,
  HorizontalDotMaterialIcon,
} from "./ClassesElements";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { db } from "../../../firebase-config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

const Classes = () => {
  const { user, userDetails, classes, setClasses } = useUserAuth();

  useEffect(() => {
    const read = async () => {
      try {
        if (userDetails?.accountType === "Tutor") {
          const data = await getDocs(
            query(
              collection(db, "createdClasses"),
              where("userUid", "==", user.uid)
            )
          );
          setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        } else {
          const data = await getDocs(
            query(
              collection(db, "JoinedClasses"),
              where("userUid", "==", user.uid)
            )
          );
          setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        }
      } catch (err) {
        return;
      }
    };
    read();
  }, []);

  return (
    <>
      <Grid container rowSpacing={4} spacing={2}>
        {classes.map((showClass) => {
          return (
            <Grid item xs={11} md={3} key={showClass.id}>
              <Card
                variant="outlined"
                style={{
                  backgroundColor: "#c5c6c7",
                  borderRadius: 20,
                }}
              >
                <CardActionArea>
                  <Link
                    to={"/dashboard/classesdetails"}
                    state={{
                      classCode: showClass.id,
                      classSubject: showClass.subject,
                      classGrade: showClass.grade,
                    }}
                    style={{ color: "#000", textDecoration: "none" }}
                  >
                    {userDetails?.accountType === "Tutor" && (
                      <CardMedia
                        component="img"
                        height="150"
                        image="https://sbooks.net/wp-content/uploads/2021/10/old-book-flying-letters-magic-light-background-bookshelf-library-ancient-books-as-symbol-knowledge-history-218640948.jpg"
                        alt="picture"
                      />
                    )}

                    {userDetails?.accountType === "Student" && (
                      <CardContent
                        sx={{
                          background: "rgb(2,0,36)",
                          background:
                            "linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(0,212,255,1) 100%)",
                        }}
                      >
                        <AvatarContainer
                          alt="Remy Sharp"
                          src="https://images.unsplash.com/photo-1597223557154-721c1cecc4b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW4lMjBmYWNlfGVufDB8fDB8fA%3D%3D&w=1000&q=80"
                        />
                      </CardContent>
                    )}

                    <CardContent sx={{ height: "15vh" }}>
                      <Typography gutterBottom variant="body1" component="div">
                        {showClass.subject}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ fontSize: 15 }}
                      >
                        Grade: {showClass.grade}
                      </Typography>
                      <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ pt: 1, fontSize: 13 }}
                      >
                        Class Code: {showClass.id}
                      </Typography>
                    </CardContent>
                  </Link>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary">
                    <HorizontalDotMaterialIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

export default Classes;
