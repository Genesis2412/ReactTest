import React from "react";
import { Logo } from "../../GlobalStyles";
import Box from "@mui/material/Box";
import { Image } from "./BookingElements";
import { useUserAuth } from "../../../Context/UserAuthContext";
import BookingStudent from "./BookingStudent";
import BookingTutor from "./BookingTutor";

const Bookings = () => {
  const { userDetails } = useUserAuth();
  return (
    <>
      <Box>
        <Logo
          to="/dashboard/classes"
          style={{ position: "absolute", color: "#fff" }}
        >
          MauTutorz
        </Logo>
        <Image
          src="https://www.incimages.com/uploaded_files/image/1920x1080/getty_509646667_126517.jpg"
          alt="bannerImg"
        />
      </Box>
      {userDetails?.accountType === "Student" && <BookingStudent />}
      {userDetails?.accountType === "Tutor" && <BookingTutor />}
    </>
  );
};

export default Bookings;
