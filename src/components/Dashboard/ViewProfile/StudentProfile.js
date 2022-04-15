import React, { useState, useEffect } from "react";
import {
  Grid,
  Avatar,
  TextField,
  Box,
  MenuItem,
  Button,
  Paper,
} from "@mui/material";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../../../firebase-config";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useUserAuth } from "../../../Context/UserAuthContext";
import CloseIcon from "@mui/icons-material/Close";
import { CircularProgress, Snackbar } from "@mui/material";

const TutorProfile = (props) => {
  const { user } = useUserAuth();
  const [editField, setEditField] = useState(true);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");
  let userStorageDetails = localStorage.getItem("userStorageDetails");
  let student = JSON.parse(userStorageDetails);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const [data, setData] = useState({
    title: student?.title,
    gender: student?.gender,
    firstName: student?.name?.firstName,
    lastName: student?.name?.lastName,
    day: student?.dateOfBirth?.day,
    month: student?.dateOfBirth?.month,
    year: student?.dateOfBirth?.year,
    streetAddress: student?.address?.streetAddress,
    city: student?.address?.city,
    district: student?.address?.district,
    homeNumber: student?.contact?.homeNumber,
    mobileNumber: student?.contact?.mobileNumber,
    additionalNumber: student?.contact?.additionalNumber,
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    gender: Yup.string().required("Gender is required"),
    firstName: Yup.string().required("Firstname is required"),
    lastName: Yup.string().required("Lastname is required"),
    day: Yup.number().required("Day of birth is required"),
    month: Yup.string().required("Month of birth is required"),
    year: Yup.number().required("Year of birth is required"),
    streetAddress: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    district: Yup.string().required("District is required"),
    homeNumber: Yup.string()
      .required("Home number is required")
      .min(7, "Home number must be of 8 numbers")
      .max(7, "Home valid home number")
      .matches(
        /^\d+$/,
        "Home number cannot contain letters or special characters"
      ),
    mobileNumber: Yup.string()
      .required("Mobile number is required")
      .matches(
        /\b5[0-9]{7}\b/,
        "Mobile number should start with 5 and cannot contain letters or special characters"
      ),
    additionalNumber: Yup.string()
      .min(7, "Additional number must be of 7 or 8 numbers")
      .max(8, "Additional number must be of 7 or 8 numbers")
      .matches(
        /^\d+$/,
        "Additional number cannot contain letters or special characters"
      ),
  });

  //   update tutor Profile
  const updateStudentProfile = async (values) => {
    const docRef = doc(db, "students", user.uid);
    await updateDoc(docRef, {
      title: values.title,
      gender: values.gender,
      name: { firstName: values.firstName, lastName: values.lastName },
      dateOfBirth: { day: values.day, month: values.month, year: values.year },
      address: {
        streetAddress: values.streetAddress,
        city: values.city,
        district: values.district,
      },
      contact: {
        homeNumber: values.homeNumber,
        mobileNumber: values.mobileNumber,
        additionalNumber: values.additionalNumber
          ? values.additionalNumber
          : false,
      },
    });
  };

  //bookings(firstName, lastName where userId=user.uid)
  const updateBookings = async (values) => {
    const dataArray = [];
    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    // updating
    if (dataArray) {
      {
        dataArray.map(async (docId) => {
          const docRef = doc(db, "bookings", docId);
          await updateDoc(docRef, {
            firstName: values.firstName,
            lastName: values.lastName,
          });
        });
      }
    }
  };

  //joinedClasses(studentFirstName, studentLastName where studentEmail)
  const updateJoinedClasses = async (values) => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("studentEmail", "==", student.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    // updating
    if (dataArray) {
      {
        dataArray.map(async (docId) => {
          const docRef = doc(db, "joinedClasses", docId);
          await updateDoc(docRef, {
            studentFirstName: values.firstName,
            studentLastName: values.lastName,
          });
        });
      }
    }
  };

  //submittedAssignments(studentLastName, studentFirstName where studentEmail)
  const updateSubmittedAssignments = async (values) => {
    const dataArray = [];
    const q = query(
      collection(db, "submittedAssignments"),
      where("studentEmail", "==", student.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    // updating
    if (dataArray) {
      {
        dataArray.map(async (docId) => {
          const docRef = doc(db, "submittedAssignments", docId);
          await updateDoc(docRef, {
            studentFirstName: values.firstName,
            studentLastName: values.lastName,
          });
        });
      }
    }
  };

  const handleSubmit = (values, setSubmitting) => {
    updateStudentProfile(values)
      .then(() => {
        updateBookings(values)
          .then(() => {
            updateJoinedClasses(values)
              .then(() => {
                updateSubmittedAssignments(values)
                  .then(() => {
                    setSubmitting(false);
                    setEditField(true);
                    setSnackBarOpen(true);
                    setMessage("Updated Successfully");
                  })
                  .catch((err) => {
                    setSubmitting(false);
                    setSnackBarOpen(true);
                    setMessage("Failed to update, try again");
                  });
              })
              .catch((err) => {
                setSubmitting(false);
                setSnackBarOpen(true);
                setMessage("Failed to update, try again");
              });
          })
          .catch((err) => {
            setSubmitting(false);
            setSnackBarOpen(true);
            setMessage("Failed to update, try again");
          });
      })
      .catch((err) => {
        setSubmitting(false);
        setSnackBarOpen(true);
        setMessage("Failed to update, try again");
      });
  };

  return (
    <>
      <Box sx={{ float: "right" }}>
        {editField ? (
          <Button
            sx={[
              {
                "&:hover": {
                  backgroundColor: "#1f2833",
                  color: "#66fcf1",
                },
                backgroundColor: "#45a29e",
                color: "#fff",
              },
            ]}
            onClick={() => {
              setEditField((prevState) => !prevState);
            }}
          >
            Edit
          </Button>
        ) : (
          <Button
            sx={[
              {
                "&:hover": {
                  backgroundColor: "#45a29e",
                  color: "#fff",
                },
                backgroundColor: "red",
                color: "#fff",
              },
            ]}
            onClick={() => {
              setEditField((prevState) => !prevState);
            }}
          >
            <CloseIcon />
            Cancel
          </Button>
        )}
      </Box>

      <Formik
        validationSchema={validationSchema}
        initialValues={data}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        {(formikProps) => (
          <Form>
            <Grid container direction="column" spacing={4} mt={1}>
              <Grid container item spacing={2}>
                <Grid item xs={12} sm="auto" md={6}>
                  <Field
                    as={TextField}
                    name="title"
                    label="Title"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.title &&
                      Boolean(formikProps.errors.title)
                    }
                    helperText={
                      formikProps.touched.title && formikProps.errors.title
                    }
                  >
                    <MenuItem value="Mr">Mr</MenuItem>
                    <MenuItem value="Mrs">Mrs</MenuItem>
                    <MenuItem value="Miss">Miss</MenuItem>
                    <MenuItem value="Mx">Mx</MenuItem>
                    <MenuItem value="Prof">Prof</MenuItem>
                  </Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={6}>
                  <Field
                    as={TextField}
                    name="gender"
                    label="Gender"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.gender &&
                      Boolean(formikProps.errors.gender)
                    }
                    helperText={
                      formikProps.touched.gender && formikProps.errors.gender
                    }
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </Field>
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={12} sm="auto" md={6}>
                  <Field
                    as={TextField}
                    name="firstName"
                    label="First Name"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.firstName &&
                      Boolean(formikProps.errors.firstName)
                    }
                    helperText={
                      formikProps.touched.firstName &&
                      formikProps.errors.firstName
                    }
                  />
                </Grid>

                <Grid item xs={12} sm="auto" md={6}>
                  <Field
                    as={TextField}
                    name="lastName"
                    label="Last Name"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.lastName &&
                      Boolean(formikProps.errors.lastName)
                    }
                    helperText={
                      formikProps.touched.lastName &&
                      formikProps.errors.lastName
                    }
                  />
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="day"
                    label="Day"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.day && Boolean(formikProps.errors.day)
                    }
                    helperText={
                      formikProps.touched.day && formikProps.errors.day
                    }
                  >
                    {props.days.map((showDays) => {
                      return (
                        <MenuItem key={showDays} value={showDays}>
                          {showDays}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="month"
                    label="Month"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.month &&
                      Boolean(formikProps.errors.month)
                    }
                    helperText={
                      formikProps.touched.month && formikProps.errors.month
                    }
                  >
                    {props.months.map((showMonths) => {
                      return (
                        <MenuItem key={showMonths} value={showMonths}>
                          {showMonths}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="year"
                    label="Year"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.year &&
                      Boolean(formikProps.errors.year)
                    }
                    helperText={
                      formikProps.touched.year && formikProps.errors.year
                    }
                  >
                    {props.years.map((showYears) => {
                      return (
                        <MenuItem key={showYears} value={showYears}>
                          {showYears}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>
              </Grid>

              {/* Contact Details */}

              <Grid container item spacing={2}>
                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="streetAddress"
                    label="Street Address"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.streetAddress &&
                      Boolean(formikProps.errors.streetAddress)
                    }
                    helperText={
                      formikProps.touched.streetAddress &&
                      formikProps.errors.streetAddress
                    }
                  ></Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="city"
                    label="City"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.city &&
                      Boolean(formikProps.errors.city)
                    }
                    helperText={
                      formikProps.touched.city && formikProps.errors.city
                    }
                  >
                    {props.cityArray.map((showCityArray) => {
                      return (
                        <MenuItem key={showCityArray} value={showCityArray}>
                          {showCityArray}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="district"
                    label="District"
                    select
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.district &&
                      Boolean(formikProps.errors.district)
                    }
                    helperText={
                      formikProps.touched.district &&
                      formikProps.errors.district
                    }
                  >
                    {props.districtArray.map((showDistrictArray) => {
                      return (
                        <MenuItem
                          key={showDistrictArray}
                          value={showDistrictArray}
                        >
                          {showDistrictArray}
                        </MenuItem>
                      );
                    })}
                  </Field>
                </Grid>
              </Grid>

              <Grid container item spacing={2}>
                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="homeNumber"
                    label="Home Number"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.homeNumber &&
                      Boolean(formikProps.errors.homeNumber)
                    }
                    helperText={
                      formikProps.touched.homeNumber &&
                      formikProps.errors.homeNumber
                    }
                  ></Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="mobileNumber"
                    label="Mobile Number"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.mobileNumber &&
                      Boolean(formikProps.errors.mobileNumber)
                    }
                    helperText={
                      formikProps.touched.mobileNumber &&
                      formikProps.errors.mobileNumber
                    }
                  ></Field>
                </Grid>

                <Grid item xs={12} sm="auto" md={4}>
                  <Field
                    as={TextField}
                    name="additionalNumber"
                    label="Additional Number"
                    fullWidth
                    inputProps={{ readOnly: editField }}
                    error={
                      formikProps.touched.additionalNumber &&
                      Boolean(formikProps.errors.additionalNumber)
                    }
                    helperText={
                      formikProps.touched.additionalNumber &&
                      formikProps.errors.additionalNumber
                    }
                  ></Field>
                </Grid>
              </Grid>

              <Grid item>
                {!editField && (
                  <Button
                    type="submit"
                    disabled={formikProps.isSubmitting}
                    value="Update"
                    fullWidth
                    sx={[
                      {
                        "&:hover": {
                          backgroundColor: "#c5c6c7",
                          color: "#000",
                        },
                        backgroundColor: "#45a29e",
                        color: "#fff",
                      },
                    ]}
                  >
                    {formikProps.isSubmitting ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      "Update"
                    )}
                  </Button>
                )}
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>

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

export default TutorProfile;
