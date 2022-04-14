import React, { useState } from "react";
import { Box, Button, MenuItem, Modal, TextField, Alert } from "@mui/material";
import createClassIcon from "../../../images/createClassIcon.svg";
import { Image } from "./FormElements";
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
  getDocs,
  where,
  query,
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validationSchema = Yup.object({
    subject: Yup.string().required("Subject is required"),
    grade: Yup.number().required("Grade is required"),
  });

  const classId = uuidv4();
  const { user, userDetails } = useUserAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // check if class already exists
  const readClass = async (subject, grade) => {
    var classExists = "";
    const q = query(
      collection(db, "createdClasses"),
      where("subject", "==", subject),
      where("grade", "==", grade)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      classExists = doc.id;
    });
    return classExists;
  };

  const createClass = async (subject, grade) => {
    setSuccess("");
    setError("");
    readClass(subject, grade).then(async (value) => {
      try {
        if (!value) {
          // creating Class
          const tutorsRef = collection(db, "createdClasses");
          setDoc(doc(tutorsRef, classId), {
            classCode: classId,
            userUid: user.uid,
            firstName: userDetails.name.firstName,
            lastName: userDetails.name.lastName,
            profilePic: userDetails.profilePic ? userDetails.profilePic : "",
            subject: subject,
            grade: grade,
          });
          const modifyTutorRef = doc(db, "tutors", user.uid);
          await updateDoc(modifyTutorRef, {
            subjects: arrayUnion(subject),
            grades: arrayUnion(grade),
          });
          setSuccess("Class Created");
        } else setError("Class exists");
      } catch (err) {
        setError("Class not created!");
      }
    });
  };

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
            }}
            onSubmit={async (values) => {
              setisSubmitting(true);
              createClass(values.subject, values.grade);
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

                <Button
                  fullWidth
                  sx={buttonStyle}
                  type="submit"
                  disabled={isSubmitting}
                >
                  Create Class
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
