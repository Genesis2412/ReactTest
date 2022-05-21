import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { StreamChat } from "stream-chat";
import { Chat } from "stream-chat-react";
import { ChannelListContainer, ChannelContainer } from "./exportsFiles";
import "stream-chat-react/dist/css/index.css";
import "./Chats.css";
import { Box, Button, TextField, CircularProgress } from "@mui/material";
import axios from "axios";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);
var authToken = window.sessionStorage.getItem("tkxn");
var userId = window.sessionStorage.getItem("zpxn");

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
          window.sessionStorage.setItem("tkxn", data?.token);
          window.sessionStorage.setItem("zpxn", data?.userId);
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
          <form onSubmit={formik.handleSubmit}>
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
                formik.touched.oldPassword && Boolean(formik.errors.oldPassword)
              }
              helperText={
                formik.touched.oldPassword && formik.errors.oldPassword
              }
            />
            <TextField
              id="newPassword"
              name="newPassword"
              label="New Password"
              size="small"
              type={"password"}
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              error={
                formik.touched.newPassword && Boolean(formik.errors.newPassword)
              }
              helperText={
                formik.touched.newPassword && formik.errors.newPassword
              }
            />
            <Button type="submit" disabled={formik.isSubmitting} value="Verify">
              {formik.isSubmitting ? (
                <CircularProgress color="secondary" />
              ) : (
                "Verify"
              )}
            </Button>
          </form>
        </Box>
      )}
    </>
  );
};

export default Chats;
