import React from "react";
import { db } from "../../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

const Insert = () => {
  const { signUp, user } = useUserAuth();
  const tutorsRef = collection(db, "tutors");

  const createData = async () => {
    try {
      await signUp("joe@gmail.com", "123456").then((cred) => {
        console.log(cred.user.uid);
      });
    } catch (err) {
      console.log(err);
    }
  };
  return <button onClick={createData}>Create</button>;
};

export default Insert;
