import React, { useState } from "react";
import TutorProfile from "./TutorProfile";
import StudentProfile from "./StudentProfile";
import {
  Box,
  Avatar,
  Paper,
  Typography,
  Button,
  Snackbar,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import LockIcon from "@mui/icons-material/Lock";
import { useUserAuth } from "../../../Context/UserAuthContext";
import UploadButtonTutor from "./UploadButtonTutor";
import UploadButtonStudent from "./UploadButtonStudent";
import ChangeTutorEmail from "./ChangeTutorEmail";
import ChangeStudentEmail from "./ChangeStudentEmail";
import DeleteProfile from "./DeleteProfile";

const ViewProfile = () => {
  const days = [];
  for (let i = 1; i < 32; i++) {
    days.push(i);
  }

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const date = new Date();
  let getYear = date.getFullYear();

  const years = [];
  for (let i = 0; i < getYear - 1939; i++) {
    years.push(1940 + i);
  }

  const cityArray = [
    "Albion",
    "Amaury",
    "Amitié-Gokhoola",
    "Anse La Raie",
    "Arsenal",
    "Baie du Cap",
    "Baie du Tombeau",
    "Bambous",
    "Bambous Virieux",
    "Bananes",
    "Beau Bassin",
    "Beau Vallon",
    "Bel Air Rivière Sèche",
    "Bel Ombre",
    "Belle Vue Haurel",
    "Bénarès",
    "Bois Chéri",
    "Bois des Amourettes",
    "Bon Accueil",
    "Bramsthan",
    "Brisée Verdière",
    "Britannia",
    "Calebasses",
    "Camp Carol",
    "Camp de Masque",
    "Camp de Masque Pavé",
    "Camp Diable",
    "Camp Ithier",
    "Camp Thorel",
    "Cap Malheureux",
    "Cascavelle",
    "Case Noyale",
    "Centre de Flacq",
    "Chamarel",
    "Chamouny",
    "Chemin Grenier",
    "Clémencia",
    "Cluny",
    "Congomah",
    "Cottage",
    "Crève Coeur",
    "Curepipe",
    "Dagotière",
    "D'Épinay",
    "Dubreuil",
    "Écroignard",
    "Espérance",
    "Espérance Trébuchet",
    "Flic en Flac",
    "Fond du Sac",
    "Goodlands",
    "Grand Baie",
    "Grand Bel Air",
    "Grand Bois",
    "Grand Gaube",
    "Grand Sable",
    "Grande Retraite",
    "Grande Rivière Noire",
    "Grande Rivière Sud Est",
    "Gros Cailloux",
    "La Flora",
    "La Gaulette",
    "La Laura-Malenga",
    "Lalmatie",
    "L'Avenir",
    "Laventure",
    "Le Hochet",
    "Le Morne",
    "Le Vale",
    "L'Escalier",
    "Mahébourg",
    "Mapou",
    "Mare Chicose",
    "Mare d'Albert",
    "Mare La Chaux",
    "Mare Tabac",
    "Médine Camp de Masque",
    "Melrose",
    "Midlands",
    "Moka",
    "Montagne Blanche",
    "Montagne Longue",
    "Morcellement Saint André",
    "New Grove",
    "Notre Dame",
    "Nouvelle Découverte",
    "Nouvelle France",
    "Olivia",
    "Pailles",
    "Pamplemousses",
    "Petit Bel Air",
    "Petit Raffray",
    "Petite Rivière",
    "Phoenix",
    "Piton",
    "Plaine des Papayes",
    "Plaine des Roches",
    "Plaine Magnien",
    "Pointe aux Piments",
    "Port Louis",
    "Poste de Flacq",
    "Poudre d'Or",
    "Poudre d'Or Hamlet",
    "Providence",
    "Quartier Militaire",
    "Quartre Bornes",
    "Quatre Cocos",
    "Quatre Soeurs",
    "Queen Victoria",
    "Richelieu",
    "Ripailles",
    "Rivière des Anguilles",
    "Rivière des Créoles",
    "Rivière du Poste",
    "Rivière du Rempart",
    "Roche Terre",
    "Roches Noires",
    "Rose Belle",
    "Rose Hill",
    "Saint Aubin",
    "Saint Hubert",
    "Saint Julien d'Hotman",
    "Saint Julien Village",
    "Saint Pierre",
    "Sébastopol",
    "Seizième Mille",
    "Souillac",
    "Surinam",
    "Tamarin",
    "Terre Rouge",
    "Triolet",
    "Trois Boutiques",
    "Trou aux Biches",
    "Trou d'Eau Douce",
    "Tyack",
    "Union Park",
    "Vacoas",
    "Vale",
    "Verdun",
    "Vieux Grand Port",
    "Ville Bague",
  ];

  const districtArray = [
    "Flacq",
    "Grand Port",
    "Moka",
    "Pamplemousses",
    "Plaine Wilhems",
    "Port Louis",
    "Rivière du Rempart",
    "Rivière Noire",
    "Savanne",
  ];

  const { user, verifyEmail, userDetails, resetPassword } = useUserAuth();
  let userStorageDetails = localStorage.getItem("userStorageDetails");
  let localUserDetails = JSON.parse(userStorageDetails);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [message, setMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const verifyUserEmail = async () => {
    try {
      verifyEmail(user);
      setSnackBarOpen(true);
      setMessage("A verification has been sent to your email.");
    } catch (error) {
      console.log("An error occurred");
    }
  };

  const changePassword = async () => {
    resetPassword(user.email)
      .then(() => {
        setSnackBarOpen(true);
        setMessage("Password reset email sent!");
      })
      .catch((err) => {
        setSnackBarOpen(true);
        setMessage("An error occurred, please try again");
      });
  };

  return (
    <>
      {user?.emailVerified === false && (
        <Box>
          <Paper
            sx={{
              p: 2,
              mb: 2,
              textAlign: "center",
              backgroundColor: "#FFCC00",
            }}
          >
            <Typography>
              Please verify your email. Failure to do so will{" "}
              <span style={{ color: "red" }}>deactivate</span> your account in
              <span style={{ color: "red" }}> 7 days!</span>
              <Button
                sx={[
                  {
                    "&:hover": {
                      backgroundColor: "#c5c6c7",
                      color: "#000",
                    },
                    backgroundColor: "#45a29e",
                    color: "#fff",
                    ml: 2,
                  },
                ]}
                onClick={() => {
                  verifyUserEmail();
                }}
              >
                Verify Here!
              </Button>
            </Typography>
          </Paper>
        </Box>
      )}
      {userDetails?.profilePic === "" && (
        <Box>
          <Paper
            sx={{
              p: 2,
              mb: 2,
              textAlign: "center",
              backgroundColor: "#FFCC00",
            }}
          >
            <Typography>
              It is compulsory to upload your face as your profile picture,
              failure to do so will{" "}
              <span style={{ color: "red" }}>deactivate</span> your account in
              <span style={{ color: "red" }}> 7 days!</span>
            </Typography>
          </Paper>
        </Box>
      )}

      <Box>
        <Paper sx={{ p: 2, boxShadow: 15 }}>
          <Box sx={{ float: "right" }}>
            <PopupState variant="popover" popupId="demo-popup-menu">
              {(popupState) => (
                <>
                  <MoreVertIcon
                    {...bindTrigger(popupState)}
                    sx={{ cursor: "pointer" }}
                  />
                  <Menu {...bindMenu(popupState)}>
                    {localUserDetails.accountType === "Tutor" ? (
                      <ChangeTutorEmail />
                    ) : (
                      <ChangeStudentEmail />
                    )}
                    <MenuItem
                      onClick={() => {
                        changePassword();
                      }}
                    >
                      <LockIcon
                        sx={{ mr: 1, fontSize: 18, color: "#45a29e" }}
                      />{" "}
                      Change Password
                    </MenuItem>
                    <DeleteProfile />
                  </Menu>
                </>
              )}
            </PopupState>
          </Box>
          <Stack display="flex" justifyContent="center" alignItems="center">
            <Avatar
              alt={userDetails?.name?.firstName}
              src={userDetails?.profilePic}
              sx={{
                height: "25vh",
                width: "25vh",
              }}
            />
            {localUserDetails.accountType === "Tutor" ? (
              <UploadButtonTutor />
            ) : (
              <UploadButtonStudent />
            )}
          </Stack>

          {localUserDetails.accountType === "Tutor" ? (
            <TutorProfile
              days={days}
              months={months}
              years={years}
              cityArray={cityArray}
              districtArray={districtArray}
            />
          ) : (
            <StudentProfile
              days={days}
              months={months}
              years={years}
              cityArray={cityArray}
              districtArray={districtArray}
            />
          )}
        </Paper>
      </Box>
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

export default ViewProfile;
