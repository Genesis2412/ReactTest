import React, { useState } from "react";
import { BannerContainer, BannerItems } from "./RegisterElements";
import { Logo, BannerQuotes } from "../GlobalStyles";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import AccountDetails from "./AccountDetails";
import StudentSuccess from "./StudentSuccess";
import TutorSubjects from "./TutorSubjects";
import TutorQualification from "./TutorQualification";
import TutorSuccess from "./TutorSuccess";
import { Stepper, Step, StepLabel } from "@mui/material";
import { db } from "../../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [data, setData] = useState({
    // Account Details
    accountType: "",
    email: "",
    password: "",
    confirmPassword: "",

    //Personal Details
    title: "",
    gender: "",
    firstName: "",
    lastName: "",
    day: "",
    month: "",
    year: "",
    nationality: "",

    // Contact Details
    streetAddress: "",
    city: "",
    district: "",
    homeNumber: "",
    mobileNumber: "",
    additionalNumber: "",

    // Tutors subjects they teach
    subjectOne: "",
    subjectTwo: "",
    subjectThree: "",
    subjectFour: "",
    subjectFive: "",
    subjectSix: "",
    // Tutors classes they teach
    gradeSeven: "",
    gradeEight: "",
    gradeNine: "",
    gradeTen: "",
    gradeEleven: "",
    gradeTwelveThirteen: "",

    // Tutors Qualification
    degree: "",
    degreeInfo: "",
    teacherQualification: "",
    teacherQualificationInfo: "",
    employed: "",
    employedInfo: "",
  });

  const [currentStep, setCurrentStep] = useState(0); //**Hint: Do not forget do change to 0**

  //insert data in firestore
  const createData = async () => {
    //array for subjects

    //array for grades

    //checking where the data will be stored
    if (data.accountType === "Tutor") {
      const tutorsRef = collection(db, "tutors");
      await setDoc(doc(tutorsRef), {
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
        contact: {
          homeNumber: data.homeNumber,
          mobileNumber: data.mobileNumber,
          additionalNumber: data.additionalNumber ? "" : false,
        },
        subjects: ["Mathematics", "English"],
        grades: [7, 8, 9, 11],
        qualification: {
          degree: data.degree ? "No" : false,
          degreeInfo: data.degreeInfo ? "" : false,
          teacherQualification: data.teacherQualification ? "No" : false,
          teacherQualificationInfo: data.teacherQualificationInfo ? "" : false,
          employed: data.employed ? "No" : false,
          employedInfo: data.employedInfo ? "" : false,
        },
      });
    }

    if (data.accountType === "Student" || data.accountType === "Parent") {
      const studentsRef = collection(db, "students");
      await setDoc(doc(studentsRef), {
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
        contact: {
          homeNumber: data.homeNumber,
          mobileNumber: data.mobileNumber,
          additionalNumber: data.additionalNumber ? "" : false,
        },
      });
    }
  };

  //captures new data from steps form and increment step counter
  const handleNextStep = (newData, final = false) => {
    setData((next) => ({ ...next, ...newData }));

    //if current step is AccountDetails (check for account type for form redirection as per accountType)
    if (currentStep === 2 && newData.accountType === "Tutor") {
      setCurrentStep((next) => next + 2);
      return;
    }

    //final submission
    if (final === true) {
      createData();
      return;
    }
    console.log(newData);
    setCurrentStep((next) => next + 1);
  };

  const steps = [
    <AccountDetails next={handleNextStep} data={data} />,
    <PersonalDetails next={handleNextStep} data={data} />,
    <ContactDetails next={handleNextStep} data={data} />,
    <StudentSuccess next={handleNextStep} data={data} />,
    <TutorSubjects next={handleNextStep} data={data} />,
    <TutorQualification next={handleNextStep} data={data} />,
    <TutorSuccess next={handleNextStep} data={data} />,
  ];

  const quotes = [
    '"Education is the most powerful weapon which you can use to change the world" - Nelson Mandela',
    '"Live as if you were to die tomorrow. Learn as if you were to live forever - Mahatma Gandhi"',
    '"The cure for boredom is curiosity. There is no cure for curiosity" - Dorothy Parker',
    '"If You are planning for a year, sow rice; if you are planning for a decade, plant trees; if you are planning for a lifetime, educate people - Chinese Proverb"',
    '"Its not that I am so smart, its just that I stay with problems longer" - Albert Einstein',
    '"Teachers open the door, but you must enter by yourself" - Chinese Proverb',
    '"The beautiful thing about learning is that no one can take it away from you" - B. B. King',
  ];

  return (
    <>
      <BannerContainer container direction="column">
        <BannerItems>
          <Logo to="/">Tutorhuntz</Logo>
          <BannerQuotes>{quotes[currentStep]}</BannerQuotes>
          {currentStep !== 0 && (
            <Stepper activeStep={currentStep} alternativeLabel>
              <Step key="AccountDetails">
                <StepLabel>Account Details</StepLabel>
              </Step>

              <Step key="PersonalDetails">
                <StepLabel>Personal Details</StepLabel>
              </Step>

              <Step key="ContactDetails">
                <StepLabel>Contact Details</StepLabel>
              </Step>

              {data.accountType === "Tutor" && (
                <Step key="Subjects">
                  <StepLabel>Subjects</StepLabel>
                </Step>
              )}

              {data.accountType === "Tutor" && (
                <Step key="Qualification">
                  <StepLabel>Qualification</StepLabel>
                </Step>
              )}

              <Step key="VerifyDetails">
                <StepLabel>Verify Details</StepLabel>
              </Step>
            </Stepper>
          )}
        </BannerItems>
      </BannerContainer>
      <div>{steps[currentStep]}</div>
    </>
  );
};

export default Register;
