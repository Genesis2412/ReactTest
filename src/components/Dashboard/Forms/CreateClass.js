import React, { useState } from "react";
import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import createClassIcon from "../../../images/createClassIcon.svg";

const CreateClass = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "50%",
    height: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: "column",
    "& .MuiTextField-root": { width: "100%" },
    borderRadius: 5,
  };

  const buttonStyle = {
    mt: 2,
    bgcolor: "#45A29E",
    color: "#fff",
    "&:hover": {
      bgcolor: "#c5c6c7",
      color: "#0b0c10",
    },
  };

  const subjects = [
    "Mathematics",
    "English",
    "French",
    "Chemistry",
    "Biology",
    "Physics",
    "Information & Communication Technology",
    "Design & Technology",
    "Food & Textile Studies",
    "Entrepreneurship",
    "Economics",
    "Accounts",
    "Business",
    "History",
    "Geography",
    "Sociology",
    "Art & Design",
    "Arabic",
    "Marathi",
    "Telegu",
    "Tamil",
    "Hindi",
    "Kreol",
    "Performing Arts",
    "Physical Education",
    "Life Skills and Values",
  ];

  const grades = [7, 8, 9, 10, 11, 12, 13];

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Box
        sx={{
          boxShadow: 3,
          p: 1,
        }}
      >
        <Button
          onClick={handleOpen}
          sx={{
            color: "#fff",
            bgcolor: "#45A29E",
            "&:hover": {
              bgcolor: "#c5c6c7",
              color: "#0b0c10",
            },
          }}
        >
          Create Class
        </Button>
      </Box>

      <Box
        sx={{
          boxShadow: 3,
          p: 3,
          mt: 2,
        }}
      >
        Using TutorHuntz at a school with students? If so, your school must sign
        up for a free Google Workspace for Education account before you can use
        TutorHuntz. Learn More Google Workspace for Education lets schools
        decide which Google services their students can use, and provides
        additional privacy and security protections that are important in a
        school setting. Students cannot use Google TutorHuntz at a school with
        personal accounts.
      </Box>

      <Box
        sx={{
          p: 3,
          mt: 2,
          textAlign: "center",
        }}
      >
        <img src={createClassIcon} alt="banner" style={{ width: "30%" }} />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            id="subject"
            label="Subject (Required)"
            variant="filled"
            select
          >
            {subjects.map((subjectsName) => (
              <MenuItem key={subjectsName} value={subjectsName}>
                {subjectsName}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="grade"
            label="Grade (Required)"
            variant="filled"
            select
          >
            {grades.map((gradesNumber) => (
              <MenuItem key={gradesNumber} value={gradesNumber}>
                {gradesNumber}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            id="numberOfStudent"
            label="Number of students (Required)"
            variant="filled"
          />
          <Button sx={buttonStyle}>Create Class</Button>
        </Box>
      </Modal>
    </>
  );
};

export default CreateClass;
