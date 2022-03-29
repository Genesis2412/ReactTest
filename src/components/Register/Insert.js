import React from "react";
import { db } from "../../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";

function Insert(data) {
  //insert data in firestore
  const createData = async () => {
    const tutorsRef = collection(db, "tutors");
    const studentsRef = collection(db, "students");
    const parentsRef = collection(db, "parents");
    var finalCollection = "";

    //checking where the data will be stored
    if (data.accountType === "Tutor") {
      finalCollection = tutorsRef;
    }
    if (data.accountType === "Student") {
      finalCollection = studentsRef;
    }
    if (data.accountType === "Parent") {
      finalCollection = parentsRef;
    }
    console.log(finalCollection);

    await setDoc(doc(finalCollection), {
      accountType: data.accountType,
      email: data.email,
      title: data.title,
      gender: data.gender,
      name: { firstName: data.firstName, lastName: data.lastName },
      dateOfBith: { day: data.day, month: data.month, year: data.year },
      nationality: data.nationality,
      address: {
        streetAddress: data.streetAddress,
        city: data.city,
        district: data.district,
      },
      contact: { homeNumber: data.homeNumber, mobileNumber: data.mobileNumber },
      subjects: ["Mathematics", "English"],
      grades: [7, 8, 9, 11],
      qualification: {
        degree: true,
        teacherQualification: true,
        employed: false,
      },
    });
  };
  return createData();
}

export default Insert;
