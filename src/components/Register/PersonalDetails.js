import React from "react";
import { FormContainer, FormItems, FormInput, RegisterSelectItem, RegisterField, RegisterButton } from "./RegisterElements";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const PersonalDetails = (props) => {
  const days = [];
  for (let i = 1; i < 32; i++) {
    days.push(i);
  }

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const date = new Date();
  let getYear = date.getFullYear();

  const years = [];
  for (let i = 0; i < getYear - 1939; i++) {
    years.push(1940 + i);
  }

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    gender: Yup.string().required("Gender is required"),
    firstName: Yup.string().required("Firstname is required"),
    lastName: Yup.string().required("Lastname is required"),
    day: Yup.number().required("Day of birth is required"),
    month: Yup.string().required("Month of birth is required"),
    year: Yup.number().required("Year of birth is required"),
    nationality: Yup.string().required("Nationality is required"),
  });
  const handleSubmit = (values) => {
    props.next(values);
  };
  return (
    <Formik validationSchema={validationSchema} initialValues={props.data} onSubmit={handleSubmit}>
      {(formikProps) => (
        <Form>
          <FormContainer container direction="column" spacing={4}>
            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="title" label="Title" select fullWidth error={formikProps.touched.title && Boolean(formikProps.errors.title)} helperText={formikProps.touched.title && formikProps.errors.title}>
                  <RegisterSelectItem value="Mr">Mr</RegisterSelectItem>
                  <RegisterSelectItem value="Mrs">Mrs</RegisterSelectItem>
                  <RegisterSelectItem value="Miss">Miss</RegisterSelectItem>
                  <RegisterSelectItem value="Mx">Mx</RegisterSelectItem>
                  <RegisterSelectItem value="Prof">Prof</RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="gender" label="Gender" select fullWidth error={formikProps.touched.gender && Boolean(formikProps.errors.gender)} helperText={formikProps.touched.gender && formikProps.errors.gender}>
                  <RegisterSelectItem value="Male">Male</RegisterSelectItem>
                  <RegisterSelectItem value="Female">Female</RegisterSelectItem>
                </Field>
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="firstName" label="First Name" fullWidth error={formikProps.touched.firstName && Boolean(formikProps.errors.firstName)} helperText={formikProps.touched.firstName && formikProps.errors.firstName}></Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="lastName" label="Last Name" fullWidth error={formikProps.touched.lastName && Boolean(formikProps.errors.lastName)} helperText={formikProps.touched.lastName && formikProps.errors.lastName}></Field>
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="day" label="Day" select fullWidth error={formikProps.touched.day && Boolean(formikProps.errors.day)} helperText={formikProps.touched.day && formikProps.errors.day}>
                  {days.map((showDays) => {
                    return (
                      <RegisterSelectItem key={showDays} value={showDays}>
                        {showDays}
                      </RegisterSelectItem>
                    );
                  })}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="month" label="Month" select fullWidth error={formikProps.touched.month && Boolean(formikProps.errors.month)} helperText={formikProps.touched.month && formikProps.errors.month}>
                  {months.map((showMonths) => {
                    return (
                      <RegisterSelectItem key={showMonths} value={showMonths}>
                        {showMonths}
                      </RegisterSelectItem>
                    );
                  })}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="year" label="Year" select fullWidth error={formikProps.touched.year && Boolean(formikProps.errors.year)} helperText={formikProps.touched.year && formikProps.errors.year}>
                  {years.map((showYears) => {
                    return (
                      <RegisterSelectItem key={showYears} value={showYears}>
                        {showYears}
                      </RegisterSelectItem>
                    );
                  })}
                </Field>
              </FormInput>
            </FormItems>

            <FormInput item>
              <Field as={RegisterField} name="nationality" label="Nationality" fullWidth select error={formikProps.touched.nationality && Boolean(formikProps.errors.nationality)} helperText={formikProps.touched.nationality && formikProps.errors.nationality}>
                <RegisterSelectItem key="Mauritian" value="Mauritian">
                  Mauritian
                </RegisterSelectItem>
              </Field>
            </FormInput>

            <FormInput item>
              <RegisterButton type="submit">Next</RegisterButton>
            </FormInput>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default PersonalDetails;
