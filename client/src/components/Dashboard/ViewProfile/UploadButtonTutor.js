import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { storage } from "../../../firebase-config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db } from "../../../firebase-config";
import {
  doc,
  collection,
  query,
  getDocs,
  where,
  updateDoc,
} from "firebase/firestore";
import { Snackbar, IconButton, Button, CircularProgress } from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { StreamChat } from "stream-chat";

const UploadButtonTutor = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, userDetails } = useUserAuth();
  const [viewUploadBtn, setViewUploadBtn] = useState(false);
  const apiKey = "k248hxcdpdqk";
  const client = StreamChat.getInstance(apiKey);

  const Input = styled("input")({
    display: "none",
  });

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleChange = (e) => {
    e.preventDefault();
    setFile(e.target?.files?.[0]);
    if (file) {
      setViewUploadBtn(true);
    }
  };

  const uploadProfilePic = () => {
    if (file.length !== 0) {
      setLoading(true);

      if (
        file.type.includes("jpeg") ||
        file.type.includes("png") ||
        file.type.includes("jpg")
      ) {
        const storageRef = ref(
          storage,
          "/ProfilePictures/" + userDetails?.email + "/" + file.name
        );
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {},
          (err) => {
            setSnackBarOpen(true);
            setMessage("Failed to upload Profile Picture");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
              try {
                await updateUserStream(url);
                await updateTutorProfile(url);
                await updateJoinedClasses(url);
                setSnackBarOpen(true);
                setMessage("Profile Picture updated successfully");
                setLoading(false);
              } catch (error) {
                setSnackBarOpen(true);
                setMessage("Failed to upload Profile Picture");
                setLoading(false);
                return;
              }
            });
          }
        );
      } else {
        setFile([]);
        setLoading(false);
        setSnackBarOpen(true);
        setMessage(".jpg, .jpeg and .png are accepted only");
        return;
      }
    } else {
      setSnackBarOpen(true);
      setMessage("Please import your image");
    }
  };

  //   update tutor Profile
  const updateTutorProfile = async (url) => {
    const docRef = doc(db, "tutors", user.uid);
    await updateDoc(docRef, {
      profilePic: url,
    });
  };

  // update joinedClasses
  const updateJoinedClasses = async (url) => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("tutorEmail", "==", userDetails?.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map(async (docId) => {
      const docRef = doc(db, "joinedClasses", docId);
      await updateDoc(docRef, {
        tutorProfilePic: url,
      });
    });
  };

  // update chat profile
  const updateUserStream = async (url) => {
    client.partialUpdateUser({
      id: client.userID,
      set: {
        image: url,
      },
    });
  };

  return (
    <>
      <label htmlFor="icon-button-file">
        <Input
          accept="image/*"
          id="icon-button-file"
          type="file"
          onChange={handleChange}
        />
        <IconButton
          sx={[
            {
              "&:hover": {
                color: "#45a29e",
              },
            },
          ]}
          aria-label="upload picture"
          component="span"
        >
          <PhotoCamera />
        </IconButton>
      </label>

      {viewUploadBtn === true && (
        <Button
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
          disabled={loading}
          value="Upload"
          onClick={() => {
            uploadProfilePic();
          }}
        >
          {loading ? <CircularProgress color="secondary" /> : "Upload"}
        </Button>
      )}

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

export default UploadButtonTutor;
