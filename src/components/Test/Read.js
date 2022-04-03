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
  setDoc,
} from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

import { Box, Paper } from "@mui/material";

const Read = () => {
  // const { user, userDetails } = useUserAuth();
  // const uid = "541sc231";
  // const [classes, setClasses] = useState([]);
  // const q = query(
  //   collection(db, "createdClasses"),
  //   where("userUid", "==", user.uid)
  // );
  // useEffect(() => {
  //   const read = async () => {
  //     const data = await getDocs(q);
  //     setClasses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  //   };
  //   read();
  // }, []);

  // Data- subject, grade, annoucement, file url, file name

  const annoucementRef = collection(db, "annoucements");
  const readOne = () => {
    setDoc(doc(annoucementRef), {
      subject: "Hello",
      grade: 8,
      fileUrl:
        "https://firebasestorage.googleapis.com/v0/b/tutorhuntz-dev-970e1.appspot.com/o/files%2Fbook.jpg?alt=media&token=461d967e-e522-45da-b2bc-07ed6394f9af",
      classCode: "cwqgibkjnlkmqihguvhj",
      fileName: "Yes, it is me",
    });
    console.log("Yes");
  };

  return (
    <>
      {/* {classes.map((yes) => {
        return (
          <div>
            {yes.firstName}
            <div>{yes.lastName}</div>
          </div>
        );
      })} */}

      <button onClick={readOne}>Read</button>
    </>
  );
};

export default Read;
