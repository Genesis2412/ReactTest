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

import ImageIcon from "../../images/ImageIcon.jpg";
import PdfIcon from "../../images/PdfIcon.jpg";
import SheetIcon from "../../images/SheetIcon.jpg";
import VideoIcon from "../../images/VideoIcon.jpg";

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

  const type = "sheet";

  return (
    <>
      {/* <button onClick={createOne}>CreateOne</button> */}
      {/* <button onClick={createAll}>ReadOne</button> */}
      {type.includes("image") && (
        <img src={ImageIcon} alt="thumbnail" height={40} />
      )}
      {type.includes("video") && (
        <img src={VideoIcon} alt="thumbnail" height={40} />
      )}
      {type.includes("sheet") && (
        <img src={SheetIcon} alt="thumbnail" height={40} />
      )}
      {type.includes("pdf") && (
        <img src={PdfIcon} alt="thumbnail" height={40} />
      )}
    </>
  );
};

export default Read;
