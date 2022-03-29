import React, { useState } from "react";
import { BannerContainer, BannerItems } from "./RegisterElements";
import { Logo, BannerQuotes, SignUpLink } from "../GlobalStyles";
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
import { useUserAuth } from "../../Context/UserAuthContext";
import { useNavigate } from "react-router-dom";

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

  const { signUp, user } = useUserAuth();

  //state for error
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  //insert data in firestore
  const createData = async () => {
    //array for subjects
    var subjectsArray = [];
    if (data.subjectOne !== "") {
      subjectsArray.push(data.subjectOne);
    }
    if (data.subjectTwo !== "") {
      subjectsArray.push(data.subjectTwo);
    }

    if (data.subjectThree !== "") {
      subjectsArray.push(data.subjectThree);
    }
    if (data.Four !== "") {
      subjectsArray.push(data.subjectFour);
    }
    if (data.subjectFive !== "") {
      subjectsArray.push(data.subjectFive);
    }
    if (data.subjectSix !== "") {
      subjectsArray.push(data.subjectSix);
    }

    //array for grades
    var gradesArray = [];
    if (data.gradeSeven === "yes") {
      gradesArray.push(7);
    }
    if (data.gradeEight === "yes") {
      gradesArray.push(8);
    }
    if (data.gradeNine === "yes") {
      gradesArray.push(9);
    }
    if (data.gradeTen === "yes") {
      gradesArray.push(10);
    }
    if (data.gradeEleven === "yes") {
      gradesArray.push(11);
    }
    if (data.gradeTwelveThirteen === "yes") {
      gradesArray.push(12);
      gradesArray.push(13);
    }

    setIsSubmitting(true);

    //adding email and password to Firebase Auth
    try {
      await signUp(data.email, data.password).then((cred) => {
        //inserting students/parents data in firestore
        if (data.accountType === "Student" || data.accountType === "Parent") {
          const studentsRef = collection(db, "students");
          setDoc(doc(studentsRef, cred.user.uid), {
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
          }).then(() => {
            navigate("/test");
            setIsSubmitting(false);
          });
        }

        if (data.accountType === "Tutor") {
          const tutorsRef = collection(db, "tutors");
          setDoc(doc(tutorsRef, cred.user.uid), {
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
            subjects: subjectsArray,
            grades: gradesArray,
            qualification: {
              degree: data.degree ? "No" : false,
              degreeInfo: data.degreeInfo ? "" : false,
              teacherQualification: data.teacherQualification ? "No" : false,
              teacherQualificationInfo: data.teacherQualificationInfo
                ? ""
                : false,
              employed: data.employed ? "No" : false,
              employedInfo: data.employedInfo ? "" : false,
            },
          }).then(() => {
            navigate("/test");
            setIsSubmitting(false);
          });
        }
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const [currentStep, setCurrentStep] = useState(0); //**Hint: Do not forget do change to 0**

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
    <StudentSuccess
      next={handleNextStep}
      data={data}
      error={error}
      isSubmitting={isSubmitting}
    />,
    <TutorSubjects next={handleNextStep} data={data} />,
    <TutorQualification next={handleNextStep} data={data} />,
    <TutorSuccess
      next={handleNextStep}
      data={data}
      error={error}
      isSubmitting={isSubmitting}
    />,
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
          <SignUpLink to="/login">Login in now</SignUpLink>
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
