import React from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  LoginWrapper,
  BannerGrid,
  FormGrid,
  LoginButton,
  LoginField,
  IconCopyright,
} from "./LoginElements";
import LoginIcon from "../../images/LoginIcon.svg";
import {
  Logo,
  BannerHeading,
  FormIcon,
  SignUpLink,
  ForgotPassword,
  FormFooter,
} from "../GlobalStyles";

const validationSchema = yup.object({
  email: yup
    .string("Enter your email")
    .email("Enter a valid email")
    .required("Email is required"),
  password: yup
    .string("Enter your password")
    .min(8, "Password should be of minimum 8 characters length")
    .required("Password is required"),
});

const Login = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  return (
    <LoginWrapper container spacing={0}>
      <BannerGrid container item xs={12} md={5} direction="column">
        <Logo href="">Tutorhuntz</Logo>
        <BannerHeading>Enjoy the Experience</BannerHeading>
        <IconCopyright />
        <FormFooter>All rights reserved</FormFooter>
      </BannerGrid>
      <FormGrid container item xs={12} md={7} direction="column">
        <SignUpLink href="">Sign up now</SignUpLink>
        <FormIcon src={LoginIcon} alt="Icon" />
        <form onSubmit={formik.handleSubmit}>
          <LoginField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
          />
          <LoginField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <LoginButton type="submit">Submit</LoginButton>
        </form>
        <ForgotPassword href="">Forgot Password?</ForgotPassword>
      </FormGrid>
    </LoginWrapper>
  );
};

export default Login;
