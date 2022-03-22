import React, { useState } from "react";
import { BannerContainer, BannerItems } from "./RegisterElements";
import { Logo, BannerHeading } from "../GlobalStyles";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import AccountDetails from "./AccountDetails";
import StudentSuccess from "./StudentSuccess";
import TutorSuccess from "./TutorSuccess";

const Register = () => {
  const [data, setData] = useState({
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
    // Account Details
    accountType: "",
    email: "",
    password: "",
    confirmPassword: "",

    // Tutors/Students subjects
    subjectOne: "",
    subjectTwo: "",
    subjectThree: "",
    subjectFour: "",
    subjectFive: "",
    subjectSix: "",

    // Tutors Qualification
    aLevelDegree: "",
    aLevelDegreeInfo: "",
    diplomaDegree: "",
    diplomaDegreeInfo: "",
    uploadCV: "",
    uploadProfilePic: "",

    // Tutors details
    criminalProsecution: "",
    criminalProsecutionWhat: "",
    employed: "",
    employedWhere: "",
  });

  const [currentStep, setCurrentStep] = useState(0); //**Hint: Do not forget do change to 0**

  //captures new data from steps form and increment step counter
  const handleNextStep = (newData, final = false) => {
    setData((next) => ({ ...next, ...newData }));

    //if current step is AccountDetails (check for account type for form redirection as per accountType)
    if (currentStep === 2 && newData.accountType === "Tutor") {
      setCurrentStep(4);
      return;
    }
    if (currentStep === 2 && (newData.accountType === "Student" || newData.accountType === "Parent")) {
      setCurrentStep(3); //StudentSuccess
      return;
    }

    if (final === true) {
      console.log("Form Submitted", data);
      return;
    }

    setCurrentStep((next) => next + 1);
  };

  const steps = [<PersonalDetails next={handleNextStep} data={data} />, <ContactDetails next={handleNextStep} data={data} />, <AccountDetails next={handleNextStep} data={data} />, <StudentSuccess next={handleNextStep} data={data} />, <TutorSuccess next={handleNextStep} data={data} />];

  return (
    <>
      <BannerContainer container direction="column">
        <BannerItems>
          <Logo to="/">Tutorhuntz</Logo>
          <BannerHeading>Enjoy the Experience</BannerHeading>
        </BannerItems>
      </BannerContainer>
      <div>{steps[currentStep]}</div>
    </>
  );
};

export default Register;
