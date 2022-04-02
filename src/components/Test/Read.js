import React, { useEffect, useState } from "react";
import { db } from "../../firebase-config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  collectionGroup,
} from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

import { Box, Paper } from "@mui/material";

const Read = () => {
  const { user, userDetails } = useUserAuth();

  // console.log(userDetails);

  return (
    <>
      {/* {tutors.map((tutor) => {
        return (
          <div>
            <h1>{tutor.name.firstName + " " + tutor.name.lastName}</h1>
          </div>
        );
      })} */}
      <Box sx={{ display: "flex" }}>
        <Box>
          <Paper>Hello</Paper>
        </Box>
      </Box>
    </>
  );
};

export default Read;
