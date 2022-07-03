import React from "react";
import Scarecrow from "../../images/Scarecrow.png";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { ErrorImage } from "../GlobalStyles";
import { useLocation } from "react-router-dom";

const ErrorPage = () => {
  const location = useLocation();

  return (
    <>
      {location?.pathname !== "/dashboard" && (
        <Box
          sx={{
            mt: 15,
            textAlign: "center",
          }}
        >
          <Box>
            <ErrorImage src={Scarecrow} alt="Image 404" />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography sx={{ fontSize: 25 }}>404 Not Found</Typography>
            <Typography>
              The page you are looking for might be removed or is temporarily
              unavailable.
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default ErrorPage;
