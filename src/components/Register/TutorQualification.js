import React from "react";
import { FormContainer, FormItems, FormInput, RegisterSelectItem, RegisterField, RegisterButton } from "./RegisterElements";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const TutorQualification = (props) => {
  const handleSubmit = (values) => {
    props.next(values, false);
  };

  const validationSchema = Yup.object({
    degree: Yup.string().required("Select Yes or No"),
    degreeInfo: Yup.mixed().when("degree", {
      is: "Yes",
      then: Yup.string().required("Please state the degree you have done"),
    }),
    teacherQualification: Yup.string().required("Select Yes or No"),
    teacherQualificationInfo: Yup.mixed().when("teacherQualification", {
      is: "Yes",
      then: Yup.string().required("Please state the teacher qualification you have done"),
    }),
    employed: Yup.string().required("Select Yes or No"),
    employedInfo: Yup.mixed().when("employed", {
      is: "Yes",
      then: Yup.string().required("Please state where you are employed"),
    }),
  });
  return (
    <Formik validationSchema={validationSchema} initialValues={props.data} onSubmit={handleSubmit}>
      {(formikProps) => (
        <Form>
          <FormContainer container direction="column" spacing={4}>
            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="degree" label="Degree" select fullWidth error={formikProps.touched.degree && Boolean(formikProps.errors.degree)} helperText={formikProps.touched.degree && formikProps.errors.degree}>
                  <RegisterSelectItem value="Yes">Yes</RegisterSelectItem>
                  <RegisterSelectItem value="No">No</RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="degreeInfo" label="Degree In" fullWidth error={formikProps.touched.degreeInfo && Boolean(formikProps.errors.degreeInfo)} helperText={formikProps.touched.degreeInfo && formikProps.errors.degreeInfo} />
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="teacherQualification" label="Teacher Qualification" select fullWidth error={formikProps.touched.teacherQualification && Boolean(formikProps.errors.teacherQualification)} helperText={formikProps.touched.teacherQualification && formikProps.errors.teacherQualification}>
                  <RegisterSelectItem value="Yes">Yes</RegisterSelectItem>
                  <RegisterSelectItem value="No">No</RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="teacherQualificationInfo" label="Teacher Qualification In" fullWidth error={formikProps.touched.teacherQualificationInfo && Boolean(formikProps.errors.teacherQualificationInfo)} helperText={formikProps.touched.teacherQualificationInfo && formikProps.errors.teacherQualificationInfo} />
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="employed" label="Employed" select fullWidth error={formikProps.touched.employed && Boolean(formikProps.errors.employed)} helperText={formikProps.touched.employed && formikProps.errors.employed}>
                  <RegisterSelectItem value="Yes">Yes</RegisterSelectItem>
                  <RegisterSelectItem value="No">No</RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={6}>
                <Field as={RegisterField} name="employedInfo" label="Employed at" fullWidth error={formikProps.touched.employedInfo && Boolean(formikProps.errors.employedInfo)} helperText={formikProps.touched.employedInfo && formikProps.errors.employedInfo} />
              </FormInput>
            </FormItems>

            <FormInput item>
              <RegisterButton type="submit">Next</RegisterButton>
            </FormInput>
          </FormContainer>
        </Form>
      )}
    </Formik>
  );
};

export default TutorQualification;
