import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../../Context/UserAuthContext";
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
import { Alert, CircularProgress } from "@mui/material";

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
  const { logIn } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, onSubmitProps) => {
      setError("");
      console.log(values.email + " " + values.password);
      try {
        await logIn(values.email, values.password);
        navigate("/register");
        onSubmitProps.setSubmitting(false);
      } catch (err) {
        if (err.message.includes("user-not-found")) {
          setError("User does not exist");
        }
        if (err.message.includes("wrong-pass")) {
          setError("Invalid password");
        }
        console.log(err.message);
      }
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
        <SignUpLink to="/register">Sign up now</SignUpLink>
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
          <LoginButton
            type="submit"
            disabled={formik.isSubmitting}
            value="Login"
          >
            {formik.isSubmitting ? (
              <CircularProgress color="secondary" />
            ) : (
              "Login"
            )}
          </LoginButton>
        </form>
        {error && <Alert severity="error">{error}</Alert>}
        <ForgotPassword href="">Forgot Password?</ForgotPassword>
      </FormGrid>
    </LoginWrapper>
  );
};

export default Login;
