import React from "react";
import { FormContainer, FormItems, FormInput, RegisterSelectItem, RegisterField, RegisterButton } from "./RegisterElements";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const TutorSubjects = (props) => {
  const handleSubmit = (values) => {
    props.next(values, false);
  };

  const subjects = ["Mathematics", "English", "French", "Chemistry", "Biology", "Physics", "Information & Communication Technology", "Design & Technology", "Food & Textile Studies", "Entrepreneurship", "Economics", "Accounts", "Business", "History", "Geography", "Sociology", "Art & Design", "Arabic", "Marathi", "Telegu", "Tamil", "Hindi", "Kreol", "Performing Arts", "Physical Education", "Life Skills and Values"];

  const validationSchema = Yup.object({
    subjectOne: Yup.string().required("A subject is required"),
    gradeSeven: Yup.string().required("Choose Yes or No"),
    gradeEight: Yup.string().required("Choose Yes or No"),
    gradeNine: Yup.string().required("Choose Yes or No"),
    gradeTen: Yup.string().required("Choose Yes or No"),
    gradeEleven: Yup.string().required("Choose Yes or No"),
    gradeTwelveThirteen: Yup.string().required("Choose Yes or No"),
  });
  return (
    <Formik validationSchema={validationSchema} initialValues={props.data} onSubmit={handleSubmit}>
      {(formikProps) => (
        <Form>
          <FormContainer container direction="column" spacing={4}>
            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectOne" label="Subject One" fullWidth select error={formikProps.touched.subjectOne && Boolean(formikProps.errors.subjectOne)} helperText={formikProps.touched.subjectOne && formikProps.errors.subjectOne}>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectTwo" label="Subject Two" fullWidth select>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectThree" label="Subject Three" fullWidth select>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectFour" label="Subject Four" fullWidth select>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectFive" label="Subject Five" fullWidth select>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="subjectSix" label="Subject Six" fullWidth select>
                  {subjects.map((subjectsName) => (
                    <RegisterSelectItem key={subjectsName} value={subjectsName}>
                      {subjectsName}
                    </RegisterSelectItem>
                  ))}
                </Field>
              </FormInput>
            </FormItems>

            {/* Classes */}

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeSeven" label="Grade 7" fullWidth select error={formikProps.touched.gradeSeven && Boolean(formikProps.errors.gradeSeven)} helperText={formikProps.touched.gradeSeven && formikProps.errors.gradeSeven}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeEight" label="Grade 8" fullWidth select error={formikProps.touched.gradeEight && Boolean(formikProps.errors.gradeEight)} helperText={formikProps.touched.gradeEight && formikProps.errors.gradeEight}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeNine" label="Grade 9" fullWidth select error={formikProps.touched.gradeNine && Boolean(formikProps.errors.gradeNine)} helperText={formikProps.touched.gradeNine && formikProps.errors.gradeNine}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
              </FormInput>
            </FormItems>

            <FormItems container item spacing={2}>
              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeTen" label="Grade 10" fullWidth select error={formikProps.touched.gradeTen && Boolean(formikProps.errors.gradeTen)} helperText={formikProps.touched.gradeTen && formikProps.errors.gradeTen}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeEleven" label="Grade 11" fullWidth select error={formikProps.touched.gradeEleven && Boolean(formikProps.errors.gradeEleven)} helperText={formikProps.touched.gradeEleven && formikProps.errors.gradeEleven}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
              </FormInput>

              <FormInput item xs={12} sm="auto" md={4}>
                <Field as={RegisterField} name="gradeTwelveThirteen" label="Grade 12, 13" fullWidth select error={formikProps.touched.gradeTwelveThirteen && Boolean(formikProps.errors.gradeTwelveThirteen)} helperText={formikProps.touched.gradeTwelveThirteen && formikProps.errors.gradeTwelveThirteen}>
                  <RegisterSelectItem key="yes" value="yes">
                    Yes
                  </RegisterSelectItem>
                  <RegisterSelectItem key="no" value="no">
                    No
                  </RegisterSelectItem>
                </Field>
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

export default TutorSubjects;
