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

const UploadButton = () => {
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [file, setFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { user, userDetails } = useUserAuth();
  const [viewUploadBtn, setViewUploadBtn] = useState(false);

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
      const storageRef = ref(
        storage,
        "/ProfilePictures/" + user.uid + "/" + file.name
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
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            updateStudentProfile(url).then(() => {
              updateBookings(url)
                .then(() => {
                  updateJoinedClasses(url)
                    .then(() => {
                      setSnackBarOpen(true);
                      setMessage("Profile Picture Uploaded Successfully");
                      setFile([]);
                      setViewUploadBtn(false);
                      setLoading(false);
                    })
                    .catch((err) => {
                      setSnackBarOpen(true);
                      setMessage("Failed to upload Profile Picture");
                      setLoading(false);
                    })
                    .catch((err) => {
                      setSnackBarOpen(true);
                      setMessage("Failed to upload Profile Picture");
                      setLoading(false);
                    });
                })
                .catch((err) => {
                  setSnackBarOpen(true);
                  setMessage("Failed to upload Profile Picture");
                  setLoading(false);
                });
            });
          });
        }
      );
    } else {
      setSnackBarOpen(true);
      setMessage("Please import your image");
    }
  };

  //   update student Profile
  const updateStudentProfile = async (url) => {
    const docRef = doc(db, "students", user.uid);
    await updateDoc(docRef, {
      profilePic: url,
    });
  };

  //update bookings
  const updateBookings = async (url) => {
    const dataArray = [];
    const q = query(
      collection(db, "bookings"),
      where("studentEmail", "==", userDetails?.email)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });
    // updating
    if (dataArray) {
      dataArray.map(async (docId) => {
        const docRef = doc(db, "bookings", docId);
        await updateDoc(docRef, {
          studentProfilePic: url,
        });
      });
    }
  };

  //update joinedClasses
  const updateJoinedClasses = async (url) => {
    const dataArray = [];
    const q = query(
      collection(db, "joinedClasses"),
      where("studentEmail", "==", userDetails.email)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      dataArray.push(doc.id);
    });

    dataArray.map(async (docId) => {
      const docRef = doc(db, "joinedClasses", docId);
      await updateDoc(docRef, {
        studentProfilePic: url,
      });
    });
  };

  if (viewUploadBtn === true) {
  }
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

export default UploadButton;
