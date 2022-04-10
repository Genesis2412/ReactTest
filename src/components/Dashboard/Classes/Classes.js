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
  getDocs,
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
            collection(db, "joinedClasses"),
            where("studentEmail", "==", userDetails?.email)
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
        alert("An error occurred");
      }
    };
    read();
  }, []);

  const handleDelete = async (classCode) => {
    try {
      let confirmAction = window.confirm("Are you sure to delete?");
      readToDeleteAnnouncements(classCode);
      if (confirmAction) {
        if (userDetails.accountType === "Tutor") {
          await deleteDoc(doc(db, "createdClasses", classCode));
          readToDeleteAnnouncements(classCode);
          // Delete also the class from joinedClasses*
          // await deleteDoc(doc(db, "joinedClasses", classCode));
          alert("Deleted Successfully");
        } else {
          // Delete class from joinedClasses for that student/parent*
          await deleteDoc(doc(db, "joinedClasses", classCode));
          alert("Deleted Successfully");
        }
      }
    } catch (err) {
      alert("An error occurred, please try again");
    }
  };

  //read from firestore to get announcementId for that class
  const readToDeleteAnnouncements = async (classCode) => {
    const data = [];
    const q = query(
      collection(db, "announcements"),
      where("classCode", "==", classCode)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      data.push(doc.id);
    });
    data.map(async (classId) => {
      await deleteDoc(doc(db, "announcements", classId));
    });
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
                      classCode: showClass.classCode,
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
                          src={userDetails.profilePic}
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

                  {userDetails?.accountType === "Tutor" && (
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
                  )}
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
