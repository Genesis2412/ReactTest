import React from "react";
import { db } from "../../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";

const Insert = () => {
  const createData = async () => {
    const tutorsRef = collection(db, "tutors");

    await setDoc(doc(tutorsRef, "acshjbsac44561256SCSASAC"), {
      accountType: "Tutor",
      email: "John@gmail.com",
      title: "Mr",
      gender: "Male",
      name: { firstName: "Josh", lastName: "Mangloo" },
      dateOfBith: { day: 18, month: 4, year: 1966 },
      nationality: "Mauritian",
      address: {
        streetAddress: "Mannot road",
        city: "Camp Foureux",
        district: "Savanne",
      },
      contact: { homeNumber: 4236584, mobileNumber: 57846963 },
      subjects: ["Mathematics", "English"],
      grades: [7, 8, 9, 11],
      qualification: {
        degree: true,
        teacherQualification: true,
        employed: false,
      },
    });

    // await setDoc(doc(tutorsRef, "adwfcsavesvw65wqcfwC13516XASAA"), {
    //   AccountDetails: {
    //     accountType: "Tutor",
    //     email: "Mili@gmail.com",
    //   },
    //   PersonalDetails: {
    //     title: "Mrs",
    //     gender: "Female",
    //     name: { firstName: "Milie", lastName: "Joshine" },
    //     dateOfBith: { day: 15, month: 12, year: 1976 },
    //     nationality: "Mauritian",
    //   },

    //   ContactDetails: {
    //     streetAddress: "Meety mole",
    //     city: "Rose Hill",
    //     district: "Phoenix",
    //     contact: { homeNumber: 4565316, mobileNumber: 57844536 },
    //   },
    //   TeachingDetails: {
    //     subjects: ["English", "French"],
    //     grades: [12, 13],
    //   },
    //   TutorDetails: {
    //     degree: true,
    //     teacherQualification: true,
    //     employed: true,
    //   },
    // });
  };
  return <button onClick={createData}>Create</button>;
};

export default Insert;
