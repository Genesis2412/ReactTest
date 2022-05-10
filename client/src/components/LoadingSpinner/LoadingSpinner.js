import React from "react";
import spinner from "../../images/spinner.gif";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner = ({ stateLoader }) => {
  // console.log(stateLoader);

  if (stateLoader === true) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 5 }} open={true}>
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else return null;
};

export default LoadingSpinner;
