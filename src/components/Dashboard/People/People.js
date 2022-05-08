import React, { useEffect, useState } from "react";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  where,
  query,
  onSnapshot,
  deleteDoc,
  getDocs,
  orderBy,
} from "firebase/firestore";
import {
  Box,
  Paper,
  Button,
  Grid,
  Snackbar,
  Avatar,
  Typography,
  TextField,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { useUserAuth } from "../../../Context/UserAuthContext";
import ChatIcon from "@mui/icons-material/Chat";
import DeleteSweepIcon from "@mui/icons-material/DeleteSweep";
import { PeopleViewIcon } from "../../GlobalStyles";
import PeopleBoard from "../../../images/NoExistBanner/PeopleBoard.svg";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const People = () => {
  const [persons, setPersons] = useState([]);
  const location = useLocation();
  const { classCode } = location.state;
  const { classDay } = location.state;
  const { classTime } = location.state;
  const { userDetails } = useUserAuth();
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showLoader, setShowLoader] = useState(true);

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const deleteStudent = async (personId, firstName, lastName, studentEmail) => {
    let confirmAction = window.confirm(
      "Are you sure to remove " + firstName + " " + lastName + "?"
    );

    if (confirmAction) {
      try {
        await deleteDoc(doc(db, "joinedClasses", personId));
        await deleteUserSubmission(studentEmail);
        await deleteUserBooking(studentEmail);
        setSnackBarOpen(true);
        setMessage(firstName + " " + lastName + " removed from class");
      } catch (error) {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      }
    }
  };

  const deleteUserSubmission = async (studentEmail) => {
    var studentAssignmentsIds = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("classCode", "==", classCode),
      where("studentEmail", "==", studentEmail)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      studentAssignmentsIds.push(doc.id);
    });

    {
      studentAssignmentsIds.map((studentAssignmentsId) => {
        deleteDoc(doc(db, "submittedAssignments", studentAssignmentsId));
      });
    }
  };

  const deleteUserBooking = async (studentEmail) => {
    var studentBookingIds = [];
    const q = query(
      collection(db, "bookings"),
      where("studentEmail", "==", studentEmail),
      where("day", "==", classDay),
      where("time", "==", classTime)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      studentBookingIds.push(doc.id);
    });

    studentBookingIds.map((studentBookingId) => {
      deleteDoc(doc(db, "bookings", studentBookingId));
    });
  };

  useEffect(() => {
    setShowLoader(true);
    const q = query(
      collection(db, "joinedClasses"),
      where("classCode", "==", classCode),
      orderBy("studentLastName")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPersons(data);
      setShowLoader(false);
    });
  }, []);

  return (
    <>
      <LoadingSpinner stateLoader={showLoader} />

      {!showLoader && persons.length !== 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "right",
            alignItems: "right",
          }}
        >
          <TextField
            size={"small"}
            label={"Search people"}
            onChange={(event) => {
              setSearchTerm(event.target.value);
            }}
          />
        </Box>
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {persons
          ?.filter((person) => {
            if (searchTerm === "") {
              return person;
            } else if (
              person.studentFirstName
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return person;
            } else if (
              person.studentLastName
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return person;
            } else if (
              (person.studentFirstName + " " + person.studentLastName)
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return person;
            } else if (
              (person.studentLastName + " " + person.studentFirstName)
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return person;
            } else if (
              person.studentEmail
                .toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
            ) {
              return person;
            }
          })

          ?.map((person, key) => {
            return (
              <Grid item xs={12} md={3} key={key}>
                <Paper sx={{ p: 1, boxShadow: 15 }}>
                  {userDetails.accountType === "Tutor" && (
                    <Box sx={{ float: "right" }}>
                      <Button
                        size="small"
                        sx={{ color: "red" }}
                        title={
                          "Remove " +
                          person.studentFirstName +
                          " " +
                          person.studentLastName
                        }
                        onClick={() => {
                          deleteStudent(
                            person.id,
                            person.studentFirstName,
                            person.studentLastName,
                            person.studentEmail
                          );
                        }}
                      >
                        <DeleteSweepIcon />
                      </Button>
                    </Box>
                  )}
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    sx={{ mt: 4 }}
                  >
                    <Avatar
                      sx={{
                        backgroundColor: "orange",
                        height: 60,
                        width: 60,
                      }}
                      alt={person?.studentLastName}
                      src={person?.studentProfilePic}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      {person?.studentFirstName + " " + person?.studentLastName}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      <a
                        href={"mailto:" + person?.studentEmail}
                        style={LinkStyles}
                      >
                        {person?.studentEmail}
                      </a>
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Typography>
                      Chat:
                      <Link to="/dashboard/chats" style={LinkStyles}>
                        <ChatIcon
                          sx={{ position: "relative", top: 7, left: 2 }}
                        />
                      </Link>
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            );
          })}
      </Grid>

      {!showLoader && persons.length === 0 && (
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <PeopleViewIcon src={PeopleBoard} alt="icon" />
          <Typography
            sx={{
              textAlign: "center",
              mt: 2,
              fontFamily: "Montserrat",
              fontSize: 19,
            }}
          >
            No one in class
          </Typography>
        </Box>
      )}

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleClose}
        message={message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default People;
