import React from "react";
import { db } from "../../firebase-config";
import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

const Insert = () => {
  const { signUp, user } = useUserAuth();
  const class_code = "49c969a5-e79d-4a57-a41a-0a28ab34ad99";

  const createData = async () => {
    // 1. read if class_code exist
    const getClass = doc(db, "createdClasses", class_code);
    const classValues = await getDoc(getClass);
    if (classValues.exists()) {
      // console.log("Document data:", classValues.data());
      // 2. if exist insert into JoinedClasses
      const joinedRef = collection(db, "JoinedClasses");

      setDoc(doc(joinedRef, class_code), {
        TutorFirstName: classValues.data().firstName,
        TutorLastName: classValues.data().lastName,
        subject: classValues.data().subject,
        grade: classValues.data().grade,
        TutorProfilePic: classValues.data().profilePic,
        userUid: user.uid,
      });
      console.log("Added Successfully");
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };
  return <button onClick={createData}>Create</button>;
};

export default Insert;
