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

const Read = () => {
  const uid = "acshjbsac44561256SCSASAC";

  const readOne = async () => {
    const docRef = doc(db, "tutors", uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  const readAll = async () => {
    // where("capital", "==", true)
    const q = query(collection(db, "tutors"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });
  };

  //reading where
  const [tutors, setTutors] = useState([]);
  const y = query(
    collection(db, "tutors"),
    where("grades", "array-contains", 7)
  );

  useEffect(() => {
    const getTutors = async () => {
      const data = await getDocs(y);
      setTutors(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      //   console.log(tutors);
    };
    getTutors();
  }, []);

  return (
    <>
      {/* <button onClick={readOne}>ReadOne</button>
      <button onClick={readAll}>ReadAll</button> */}
      {tutors.map((tutor) => {
        return (
          <div>
            <h1>{tutor.name.firstName + " " + tutor.name.lastName}</h1>
          </div>
        );
      })}
    </>
  );
};

export default Read;
