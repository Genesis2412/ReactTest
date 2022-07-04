import React, { useState } from "react";
import {
  FormContainer,
  FormInput,
  RegisterSelectItem,
  RegisterField,
  RegisterButton,
} from "./RegisterElements";
import Alert from "@mui/material/Alert";
import { db } from "../../firebase-config";
import { collection, getDocs } from "firebase/firestore";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const AccountDetails = (props) => {
  const [error, setError] = useState("");

  const handleSubmit = async (values) => {
    await verifyEmail(values?.email).then((val) => {
      if (val === true) {
        setError("Email has been taken!");
      } else {
        props.next(values, false);
      }
    });
  };

  const validationSchema = Yup.object({
    accountType: Yup.string().required("Account type is required"),
    email: Yup.string()
      .email("Enter valid email")
      .required("Email is required"),
    password: Yup.string()
      .required("Please Enter your password")
      .min(8, "Password too short,")
      .max(32, "Password too long")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/,
        "Must Contain atleast 8 Characters - Atleast One Uppercase, One Lowercase, One Number and one special case Character"
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm your password"),
  });

  // verify email
  const verifyEmail = async (email) => {
    var x = false;
    var y = false;

    try {
      const tutorSnap = await getDocs(collection(db, "tutors"));
      tutorSnap.forEach((doc) => {
        if (doc.data().email.toLowerCase() === email.toLowerCase()) {
          x = true;
        }
      });

      const studentSnap = await getDocs(collection(db, "students"));
      studentSnap.forEach((doc) => {
        if (doc.data().email.toLowerCase() === email.toLowerCase()) {
          y = true;
        }
      });

      if (x === true || y === true) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      setError("An error occurred, please try again");
      return;
    }
  };
  return (
    <>
      <Formik
        validationSchema={validationSchema}
        initialValues={props.data}
        onSubmit={handleSubmit}
      >
        {(formikProps) => (
          <Form>
            <FormContainer container direction="column" spacing={4}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field
                  as={RegisterField}
                  name="accountType"
                  label="Account Type"
                  fullWidth
                  select
                  error={
                    formikProps.touched.accountType &&
                    Boolean(formikProps.errors.accountType)
                  }
                  helperText={
                    formikProps.touched.accountType &&
                    formikProps.errors.accountType
                  }
                >
                  <RegisterSelectItem key="Tutor" value="Tutor">
                    Tutor
                  </RegisterSelectItem>
                  <RegisterSelectItem key="Student" value="Student">
                    Student
                  </RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item>
                <Field
                  as={RegisterField}
                  name="email"
                  label="Email"
                  fullWidth
                  error={
                    formikProps.touched.email &&
                    Boolean(formikProps.errors.email)
                  }
                  helperText={
                    formikProps.touched.email && formikProps.errors.email
                  }
                ></Field>
              </FormInput>

              <FormInput item>
                <Field
                  as={RegisterField}
                  name="password"
                  label="Password"
                  type="password"
                  fullWidth
                  error={
                    formikProps.touched.password &&
                    Boolean(formikProps.errors.password)
                  }
                  helperText={
                    formikProps.touched.password && formikProps.errors.password
                  }
                ></Field>
              </FormInput>

              <FormInput item>
                <Field
                  as={RegisterField}
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  fullWidth
                  error={
                    formikProps.touched.confirmPassword &&
                    Boolean(formikProps.errors.confirmPassword)
                  }
                  helperText={
                    formikProps.touched.confirmPassword &&
                    formikProps.errors.confirmPassword
                  }
                ></Field>
              </FormInput>

              <FormInput item>
                <RegisterButton type="submit">Next</RegisterButton>
              </FormInput>
            </FormContainer>
          </Form>
        )}
      </Formik>
      {error && <Alert severity="error">{error}</Alert>}
    </>
  );
};

export default AccountDetails;
