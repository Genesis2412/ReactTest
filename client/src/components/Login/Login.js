import React, { useState, useEffect } from "react";
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
  ForgotPassword,
  IconCopyright,
  ResetForm,
  ResetWrapper,
  EmailField,
  EmailResetBtn,
} from "./LoginElements";
import LoginIcon from "../../images/LoginIcon.svg";
import {
  Logo,
  BannerHeading,
  FormIcon,
  SignUpLink,
  FormFooter,
} from "../GlobalStyles";
import { Alert, CircularProgress } from "@mui/material";
import axios from "axios";
import { StreamChat } from "stream-chat";

const Login = () => {
  //Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { resetPassword } = useUserAuth();
  const { checkSignIn } = useUserAuth();
  const [modalSuccess, setModalSuccess] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalEmail, setModalEmail] = useState("");

  const { logIn, user } = useUserAuth();
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  // Yup field Validation
  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    password: yup
      .string("Enter your password")
      .required("Password is required"),
  });

  //Firebase reset password
  const handleReset = async () => {
    setModalSuccess("");
    setModalError("");
    checkSignIn(modalEmail)
      .then((result) => {
        if (result.length > 0) {
          resetPassword(modalEmail)
            .then(() => {
              setModalSuccess("Email sent");
            })
            .catch((err) => {
              if (err.message.includes("invalid-email")) {
                setModalError("Enter valid email");
              }
            });
        }
      })
      .catch((err) => {
        if (err.message.includes("invalid-email")) {
          setModalError("Enter valid email");
        }
      });
  };

  const loginUserChat = async (email, password) => {
    const URL = "https://maututorz.herokuapp.com/auth/login";
    await axios
      .post(URL, {
        email,
        password,
      })
      .then(({ data }) => {
        if (data.token) {
          window.localStorage.setItem("tkxn", data?.token);
          window.localStorage.setItem("zpxn", data?.userId);

          client.connectUser(
            {
              token: data?.token,
              id: data?.userId,
            },
            data.token
          );
        }
      })
      .catch((err) => {});
  };

  //Formik Form Submission and Validation
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, onSubmitProps) => {
      setError("");
      //Firebase Login
      try {
        await logIn(values.email, values.password);
        navigate("/dashboard");
        await loginUserChat(values.email, values.password);
        onSubmitProps.setSubmitting(false);
      } catch (err) {
        if (err.message.includes("user-not-found")) {
          setError("User does not exist");
          return;
        }
        if (err.message.includes("wrong-pass")) {
          setError("Invalid password");
          return;
        }
        setError("An error occured, please try again");
        return;
      }
    },
  });

  return (
    <>
      <LoginWrapper container spacing={0}>
        <BannerGrid item xs={12} md={5}>
          <Logo to="/">MauTutorz</Logo>
          <BannerHeading>Enjoy the Experience</BannerHeading>
          <IconCopyright />
          <FormFooter>All rights reserved</FormFooter>
        </BannerGrid>
        <FormGrid
          item
          xs={12}
          md={7}
          sx={{
            p: 2,
            textAlign: "center",
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
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
          <ForgotPassword onClick={handleOpen}>Forgot Password?</ForgotPassword>
        </FormGrid>
      </LoginWrapper>

      {/* Modal */}
      <ResetForm
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <ResetWrapper>
          <EmailField
            id="emailTemporary"
            name="emailTemporary"
            label="Email"
            type="email"
            onChange={(e) => setModalEmail(e.target.value)}
          ></EmailField>
          <EmailResetBtn onClick={handleReset}>Reset Password</EmailResetBtn>
          {modalError && <Alert severity="error">{modalError}</Alert>}
          {modalSuccess && <Alert severity="success">{modalSuccess}</Alert>}
        </ResetWrapper>
      </ResetForm>
    </>
  );
};

export default Login;
