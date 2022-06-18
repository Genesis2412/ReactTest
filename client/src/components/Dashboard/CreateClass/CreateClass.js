import React, { useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  Modal,
  TextField,
  Alert,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../../firebase-config";
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useUserAuth } from "../../../Context/UserAuthContext";

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

  const days = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    grade: Yup.number().required("Grade is required"),
    description: Yup.string().required("Description is required"),
    day: Yup.string().required("Available Day One is required"),
    time: Yup.string().required("Available Time One is required"),
    price: Yup.number("You should enter numbers only"),
  });

  const classId = uuidv4();
  const { user, userDetails } = useUserAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setisSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSuccess("");
    setError("");
  };

  const createClass = async (values) => {
    setisSubmitting(true);
    setSuccess("");
    setError("");

    try {
      // creating Class
      const tutorsRef = collection(db, "createdClasses");

      await setDoc(doc(tutorsRef, classId), {
        classCode: classId,
        tutorEmail: userDetails?.email,
        subject: values?.subject,
        grade: values?.grade,
        description: values?.description,
        day: values?.day,
        time: values?.time,
        price: values?.price,
      });

      await updateDoc(doc(db, "tutors", user?.uid), {
        classes: arrayUnion({ subject: values?.subject, grade: values?.grade }),
      });

      setSuccess("Class Created");
      setisSubmitting(false);
      handleClose();
    } catch (err) {
      console.log(err);
      setError("Class not created!");
      setisSubmitting(false);
    }
  };

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
              description: "",
              day: "",
              time: "",
            }}
            onSubmit={async (values) => {
              createClass(values);
            }}
          >
            {(formikProps) => (
              <Form>
                <Field
                  as={TextField}
                  name="subject"
                  label="Subject"
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
                  label="Grade"
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
                  name="description"
                  label="Description"
                  variant="filled"
                  multiline
                  error={
                    formikProps.touched.description &&
                    Boolean(formikProps.errors.description)
                  }
                  helperText={
                    formikProps.touched.description &&
                    formikProps.errors.description
                  }
                />
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      name="day"
                      label="Day"
                      variant="filled"
                      select
                      multiple
                      error={
                        formikProps.touched.day &&
                        Boolean(formikProps.errors.day)
                      }
                      helperText={
                        formikProps.touched.day && formikProps.errors.day
                      }
                    >
                      {days.map((day) => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                  <Grid item xs={6}>
                    <Field
                      as={TextField}
                      name="time"
                      label="Time"
                      variant="filled"
                      type={"time"}
                      error={
                        formikProps.touched.time &&
                        Boolean(formikProps.errors.time)
                      }
                      helperText={
                        formikProps.touched.time && formikProps.errors.time
                      }
                    />
                  </Grid>
                </Grid>

                <Field
                  as={TextField}
                  name="price"
                  label="Price"
                  variant="filled"
                  error={
                    formikProps.touched.price &&
                    Boolean(formikProps.errors.price)
                  }
                  helperText={
                    formikProps.touched.price && formikProps.errors.price
                  }
                />

                <Button
                  fullWidth
                  sx={buttonStyle}
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <CircularProgress color="secondary" />
                  ) : (
                    "Create Class"
                  )}
                </Button>
                {error && <Alert severity="error">{error}</Alert>}
                {success && <Alert severity="success">{success}</Alert>}
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default CreateClass;
