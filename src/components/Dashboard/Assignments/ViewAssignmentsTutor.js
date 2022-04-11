import React, { useState, useEffect } from "react";
import {
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  Snackbar,
} from "@mui/material";
import {
  doc,
  setDoc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
  arrayUnion,
  onSnapshot,
  orderBy,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import PageviewIcon from "@mui/icons-material/Pageview";
import CloseIcon from "@mui/icons-material/Close";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";

const ViewAssignmentsTutor = (props) => {
  const HeaderStyle = {
    color: "#66fcf1",
    fontSize: 16,
  };

  const LinkStyles = {
    color: "#45a29e",
    textDecoration: "none",
    fontWeight: "bold",

    "&:hover": {
      color: "#0b0c10",
      backgroundColor: "#c5c6c7",
    },
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const [assignments, setAssignments] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // reading all tutors details
  useEffect(() => {
    const q = query(
      collection(db, "assignments"),
      where("classCode", "==", props.classCode)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setAssignments(data);
    });
  }, []);

  console.log(assignments);

  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 2, boxShadow: 5, mt: 2 }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead
            sx={{
              backgroundColor: "#1f2833",
              fontWeight: "bold",
            }}
          >
            <TableRow>
              <TableCell style={HeaderStyle}>Start Date/Time</TableCell>
              <TableCell style={HeaderStyle}>End Date/Time</TableCell>
              <TableCell style={HeaderStyle}>Assignment Description</TableCell>
              <TableCell style={HeaderStyle}>Assignment Contents</TableCell>
              <TableCell style={HeaderStyle}>View Submissions</TableCell>
              <TableCell style={HeaderStyle}>Update</TableCell>
              <TableCell style={HeaderStyle}>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment, index) => {
              return (
                <TableRow sx={{ backgroundColor: "#c5c6c7" }} key={index}>
                  <TableCell>
                    {assignment.startDate + ", " + assignment.startTime}
                  </TableCell>
                  <TableCell>
                    {assignment.endDate + ", " + assignment.endTime}
                  </TableCell>
                  <TableCell>{assignment.title}</TableCell>
                  {assignment.fileName.map((file, index) => {
                    return (
                      <TableCell key={index}>
                        <a href={assignment.fileUrl[index]} style={LinkStyles}>
                          {file}
                        </a>
                      </TableCell>
                    );
                  })}

                  <TableCell>
                    <Button>
                      <PageviewIcon sx={{ color: "green" }} />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button>
                      <ChangeCircleIcon />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button sx={{ color: "red" }}>
                      <CloseIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ViewAssignmentsTutor;
