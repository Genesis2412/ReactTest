import React, { useState } from "react";
import { Box, Button, MenuItem, Modal, TextField } from "@mui/material";
import createClassIcon from "../../../images/createClassIcon.svg";
import { Image } from "./FormElements";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

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

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    grade: Yup.number().required("Grade is required"),
    numberOfStudent: Yup.number().required("Number is required"),
  });

  const [isSubmitting, setisSubmitting] = useState(false);

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
        <Image src={createClassIcon} alt="banner" />
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Formik
            validationSchema={validationSchema}
            initialValues={{
              subject: "",
              grade: "",
              numberOfStudent: "",
            }}
            onSubmit={async (values) => {
              setisSubmitting(true);
              await new Promise((r) => setTimeout(r, 500));
              alert(JSON.stringify(values, null, 2));
              setisSubmitting(false);
            }}
          >
            {(formikProps) => (
              <Form>
                <Field
                  as={TextField}
                  name="subject"
                  label="Subject (Required)"
                  select
                  variant="filled"
                  error={
                    formikProps.touched.subject &&
                    Boolean(formikProps.errors.subject)
                  }
                  helperText={
                    formikProps.touched.subject && formikProps.errors.subject
                  }
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  as={TextField}
                  name="grade"
                  label="Grade (Required)"
                  select
                  variant="filled"
                  error={
                    formikProps.touched.grade &&
                    Boolean(formikProps.errors.grade)
                  }
                  helperText={
                    formikProps.touched.grade && formikProps.errors.grade
                  }
                >
                  {grades.map((grade) => (
                    <MenuItem key={grade} value={grade}>
                      {grade}
                    </MenuItem>
                  ))}
                </Field>

                <Field
                  as={TextField}
                  name="numberOfStudent"
                  label="Number of Student (Required)"
                  variant="filled"
                  error={
                    formikProps.touched.numberOfStudent &&
                    Boolean(formikProps.errors.numberOfStudent)
                  }
                  helperText={
                    formikProps.touched.numberOfStudent &&
                    formikProps.errors.numberOfStudent
                  }
                />

                <Button
                  fullWidth
                  sx={buttonStyle}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Class
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default CreateClass;
