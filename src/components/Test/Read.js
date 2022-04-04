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
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

import { Box, Paper, Grid } from "@mui/material";

const Read = () => {
  const title = "Lecture 3";

  const readOne = async () => {
    var docId = "";
    const q = query(
      collection(db, "announcements"),
      where("title", "==", title)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      docId = doc.id;
    });
    return docId;
  };

  //modify announcement
  const createAll = async () => {
    readOne().then((response) => {
      if (response) {
        const washingtonRef = doc(db, "announcements", response);
        updateDoc(washingtonRef, {
          fileName: arrayUnion("Test2"),
        });
        console.log("Updated");
      } else {
        setDoc(doc(collection(db, "announcements")), {
          subject: "classSubject",
          grade: "classGrade",
          fileUrl: ["url"],
          classCode: "classCode",
          fileName: ["Test1"],
          format: ["image.type"],
          title: title,
        });
        console.log("New Created");
      }
    });
  };

  return (
    <>
      {/* <button onClick={createOne}>CreateOne</button> */}
      <button onClick={createAll}>ReadOne</button>
    </>
  );
};

export default Read;
