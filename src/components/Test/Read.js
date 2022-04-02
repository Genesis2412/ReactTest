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

  const uid = "541sc231";

  const [classes, setClasses] = useState([]);

  const q = query(
    collection(db, "createdClasses"),
    where("userUid", "==", user.uid)
  );

  useEffect(() => {
    const read = async () => {
      const data = await getDocs(q);
      setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    read();
  }, []);

  return (
    <>
      {classes.map((yes) => {
        return (
          <div>
            {yes.firstName}
            <div>{yes.lastName}</div>
          </div>
        );
      })}

      {/* <button onClick={read}>Read</button> */}
    </>
  );
};

export default Read;
