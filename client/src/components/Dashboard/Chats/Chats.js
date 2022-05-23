import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "stream-chat-react/dist/css/index.css";
import "./Chats.css";
import {
  Box,
  Paper,
  Grid,
  Button,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import axios from "axios";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);
var authToken = window.localStorage.getItem("tkxn");
var userId = window.localStorage.getItem("zpxn");

const Chats = () => {
  const [createType, setCreateType] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const validationSchema = yup.object({
    email: yup
      .string("Enter your email")
      .email("Enter a valid email")
      .required("Email is required"),
    oldPassword: yup
      .string("Enter your old password")
      .required("Old Password is required"),
    newPassword: yup
      .string("Enter your new password")
      .required("New Password is required"),
  });

  const verifyUser = async (email, oldPassword, newPassword) => {
    const URL = "http://localhost:5000/auth/reauthenticate";
    await axios
      .post(URL, {
        email,
        oldPassword,
        newPassword,
      })
      .then(({ data }) => {
        if (data.token) {
          window.localStorage.setItem("tkxn", data?.token);
          window.localStorage.setItem("zpxn", data?.userId);
        }
        window.location.reload(false);
      });
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      oldPassword: "",
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, onSubmitProps) => {
      try {
        await verifyUser(values.email, values.oldPassword, values.newPassword);
        onSubmitProps.setSubmitting(false);
      } catch (err) {
        console.log(err);
      }
    },
  });

  if (authToken && userId) {
    client.connectUser(
      {
        token: authToken,
        id: userId,
      },
      authToken
    );
  }

  return (
    <>
      {authToken && userId && (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            height: "100%",
            boxShadow: 5,
          }}
        >
          <Chat client={client} theme="team light">
            <ChannelListContainer
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              setCreateType={setCreateType}
              setIsEditing={setIsEditing}
              setIsViewing={setIsViewing}
            />
            <ChannelContainer
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              createType={createType}
              setIsViewing={setIsViewing}
              isViewing={isViewing}
            />
          </Chat>
        </Box>
      )}

      {!authToken && !userId && (
        <Box>
          <Box>
            <Paper
              sx={{
                p: 1,
                boxShadow: 3,
                textAlign: "center",
                backgroundColor: "#1f2833",
                color: "#66fcf1",
              }}
            >
              <Typography>
                Your password was changed, please verify your account to access
                chats.
              </Typography>
            </Paper>
          </Box>
          <Paper sx={{ p: 1, boxShadow: 5, mt: 2 }}>
            <Grid
              spacing={0}
              direction="column"
              alignItems="center"
              justify="center"
            >
              <form onSubmit={formik.handleSubmit}>
                <Grid item xs={12} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    size="small"
                    type={"email"}
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                  />
                </Grid>
                <Grid item xs={12} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    id="oldPassword"
                    name="oldPassword"
                    label="Old Password"
                    size="small"
                    type={"password"}
                    value={formik.values.oldPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.oldPassword &&
                      Boolean(formik.errors.oldPassword)
                    }
                    helperText={
                      formik.touched.oldPassword && formik.errors.oldPassword
                    }
                  />
                </Grid>
                <Grid item xs={12} sx={{ p: 1 }}>
                  <TextField
                    fullWidth
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    size="small"
                    type={"password"}
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.newPassword &&
                      Boolean(formik.errors.newPassword)
                    }
                    helperText={
                      formik.touched.newPassword && formik.errors.newPassword
                    }
                  />
                </Grid>
                <Grid item xs={12} sx={{ p: 1 }}>
                  <Button
                    fullWidth
                    type="submit"
                    disabled={formik.isSubmitting}
                    value="Verify"
                    sx={[
                      {
                        "&:hover": {
                          backgroundColor: "#c5c6c7",
                          color: "#0b0c10",
                        },
                        backgroundColor: "#45a29e",
                        color: "#fff",
                      },
                    ]}
                  >
                    {formik.isSubmitting ? (
                      <CircularProgress color="secondary" />
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Paper>
        </Box>
      )}
    </>
  );
};

export default Chats;
