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
import { AvatarContainer } from "./ClassesElements";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ClassesBanner from "../../../images/ClassesBanner.jpg";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { db } from "../../../firebase-config";
import {
  collection,
  query,
  where,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { Link } from "react-router-dom";

const Classes = () => {
  const { user, userDetails, classes, setClasses } = useUserAuth();

  useEffect(() => {
    const read = async () => {
      try {
        if (userDetails?.accountType === "Tutor") {
          const data = query(
            collection(db, "createdClasses"),
            where("userUid", "==", user.uid)
          );
          const unsubscribe = onSnapshot(data, (querySnapshot) => {
            const newFiles = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setClasses(newFiles);
          });
        } else {
          const data = query(
            collection(db, "JoinedClasses"),
            where("userUid", "==", user.uid)
          );
          const unsubscribe = onSnapshot(data, (querySnapshot) => {
            const newFiles = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            setClasses(newFiles);
          });
        }
      } catch (err) {
        return;
      }
    };
    read();
  }, []);

  const handleDelete = async (classId) => {
    try {
      let confirmAction = window.confirm("Are you sure to delete?");
      if (confirmAction) {
        if (userDetails.accountType === "Tutor") {
          await deleteDoc(doc(db, "createdClasses", classId));
          alert("Deleted Successfully");
        } else {
          await deleteDoc(doc(db, "JoinedClasses", classId));
          alert("Deleted Successfully");
        }
      }
    } catch (err) {
      alert("An error occurred, please try again");
    }
  };

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
                  borderRadius: 10,
                }}
              >
                <CardActionArea>
                  <Link
                    to={"/dashboard/classesdetails/streams"}
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
                        image={ClassesBanner}
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
                  <Link
                    size="small"
                    style={{ color: "#45a29e", marginLeft: "10px" }}
                    to="/dashboard/chats"
                  >
                    <ChatIcon sx={{ fontSize: "20px" }} />
                  </Link>

                  <Link
                    size="small"
                    style={{ color: "#45a29e", marginLeft: "20px" }}
                    to="/dashboard/videocall"
                  >
                    <VideoCallIcon />
                  </Link>

                  <Button
                    size="small"
                    sx={{
                      color: "red",
                      ml: 2,
                      position: "relative",
                      left: "50%",
                    }}
                    onClick={() => handleDelete(showClass.id)}
                  >
                    <DeleteOutlineIcon />
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
