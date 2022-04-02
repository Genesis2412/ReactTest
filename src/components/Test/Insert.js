import React from "react";
import { db } from "../../firebase-config";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";

const Insert = () => {
  const { signUp, user } = useUserAuth();
  const class_id = "541sc231";
  const id = "655613541";

  const createData = async () => {
    const studentsRef = collection(db, "createdClasses");
    setDoc(doc(studentsRef, class_id), {
      firstName: "John",
      lastName: "Doe",
      class: { subject: "Maths", grade: 7, numberOfStudent: 10 },
      profilePic:
        "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    });

    console.log("a new coll has been created");
  };
  return <button onClick={createData}>Create</button>;
};

export default Insert;
