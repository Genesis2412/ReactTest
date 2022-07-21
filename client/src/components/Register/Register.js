import React, { useState, useEffect } from "react";
import {
  BannerContainer,
  BannerItems,
  Steppers,
  Steps,
  StepLabels,
} from "./RegisterElements";
import Snackbar from "@mui/material/Snackbar";
import { Logo, BannerQuotes, LoginLink } from "../GlobalStyles";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import AccountDetails from "./AccountDetails";
import StudentSuccess from "./StudentSuccess";
import TutorQualification from "./TutorQualification";
import TutorSuccess from "./TutorSuccess";
import { db } from "../../firebase-config";
import { collection, doc, setDoc } from "firebase/firestore";
import { useUserAuth } from "../../Context/UserAuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StreamChat } from "stream-chat";
const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

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

    // Tutors Qualification
    degree: "",
    degreeInfo: "",
    teacherQualification: "",
    teacherQualificationInfo: "",
    employed: "",
    employedInfo: "",
  });

  const { signUp, user } = useUserAuth();

  const createUserChat = async (
    userId,
    accountType,
    title,
    firstName,
    lastName,
    email,
    password
  ) => {
    const URL = "https://maututorz.herokuapp.com/auth/register";
    await axios
      .post(URL, {
        userId,
        firstName,
        lastName,
        email,
        password,
      })
      .then(({ data }) => {
        if (data.token) {
          if (accountType === "Tutor") {
            client
              .connectUser(
                {
                  id: data?.userId,
                  name: `${title} ${data?.firstName} ${data?.lastName}`,
                  email: data?.email,
                  hashedPassword: data?.hashedPassword,
                },
                data.token
              )
              .then(async () => {
                const URL = "https://maututorz.herokuapp.com/auth/login";
                await axios
                  .post(URL, {
                    email,
                    password,
                  })
                  .then(({ data }) => {
                    if (data.token) {
                      window.localStorage.setItem("tkxn", data?.token);
                      window.localStorage.setItem("zpxn", data?.userId);
                    }
                  })
                  .catch((err) => {});
              });
          }
          if (accountType === "Student") {
            client
              .connectUser(
                {
                  id: data?.userId,
                  name: `${data?.firstName} ${data?.lastName}`,
                  email: data?.email,
                  hashedPassword: data?.hashedPassword,
                },
                data.token
              )
              .then(async () => {
                const URL = "https://maututorz.herokuapp.com/auth/login";
                await axios
                  .post(URL, {
                    email,
                    password,
                  })
                  .then(({ data }) => {
                    if (data.token) {
                      window.localStorage.setItem("tkxn", data?.token);
                      window.localStorage.setItem("zpxn", data?.userId);
                    }
                  })
                  .catch((err) => {});
              });
          }
        }
      })
      .catch((err) => {});
  };

  //state for error
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [snackBarOpen, setSnackBarOpen] = useState(false);

  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  //insert data in firestore
  const createData = async () => {
    setIsSubmitting(true);

    //adding email and password to Firebase Auth
    try {
      await signUp(data.email, data.password).then(async (cred) => {
        //inserting students/parents data in firestore
        if (data.accountType === "Student") {
          const studentsRef = collection(db, "students");
          setDoc(doc(studentsRef, cred.user.uid), {
            accountType: data.accountType,
            email: data.email,
            title: data.title,
            gender: data.gender,
            name: { firstName: data.firstName, lastName: data.lastName },
            dateOfBirth: { day: data.day, month: data.month, year: data.year },
            nationality: data.nationality,
            address: {
              streetAddress: data.streetAddress,
              city: data.city,
              district: data.district,
            },
            contact: {
              homeNumber: data.homeNumber,
              mobileNumber: data.mobileNumber,
              additionalNumber: data.additionalNumber,
            },
            profilePic: "",
          }).then(() => {
            navigate("/dashboard");
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
            dateOfBirth: { day: data.day, month: data.month, year: data.year },
            nationality: data.nationality,
            address: {
              streetAddress: data.streetAddress,
              city: data.city,
              district: data.district,
            },
            contact: {
              homeNumber: data.homeNumber,
              mobileNumber: data.mobileNumber,
              additionalNumber: data.additionalNumber,
            },

            qualification: {
              degree: data.degree,
              degreeInfo: data.degreeInfo,
              teacherQualification: data.teacherQualification,
              teacherQualificationInfo: data.teacherQualificationInfo,
              employed: data.employed,
              employedInfo: data.employedInfo,
            },
            profilePic: "",
            classes: [],
          }).then(() => {
            navigate("/dashboard");
            setIsSubmitting(false);
          });
        }

        await createUserChat(
          cred.user.uid,
          data.accountType,
          data.title,
          data.firstName,
          data.lastName,
          data.email,
          data.password
        );
      });
    } catch (err) {
      if (err.message.includes("auth/invalid-email")) {
        setError("Email is not valid");
      }
      if (err.message.includes("auth/email-already-in-use")) {
        setError("Email is already taken");
      }
      setError(err.message);
    }
  };

  const [currentStep, setCurrentStep] = useState(0); //**Hint: Do not forget do change to 0**

  //captures new data from steps form and increment step counter
  const handleNextStep = (newData, final = false) => {
    setData((next) => ({ ...next, ...newData }));

    //final submission
    if (final === true) {
      createData();
      return;
    }
    // console.log(newData);
    setCurrentStep((next) => next + 1);
  };

  var steps = [
    <AccountDetails next={handleNextStep} data={data} />,
    <PersonalDetails next={handleNextStep} data={data} />,
    <ContactDetails next={handleNextStep} data={data} />,
  ];

  if (data.accountType === "Tutor") {
    steps.push(
      <TutorQualification next={handleNextStep} data={data} />,
      <TutorSuccess
        next={handleNextStep}
        data={data}
        error={error}
        isSubmitting={isSubmitting}
      />
    );
  }
  if (data.accountType === "Student") {
    steps.push(
      <StudentSuccess
        next={handleNextStep}
        data={data}
        error={error}
        isSubmitting={isSubmitting}
      />
    );
  }

  const quotes = [
    '"Education is the most powerful weapon which you can use to change the world" - Nelson Mandela',
    '"Live as if you were to die tomorrow. Learn as if you were to live forever - Mahatma Gandhi"',
    '"The cure for boredom is curiosity. There is no cure for curiosity" - Dorothy Parker',
    '"If You are planning for a year, sow rice; if you are planning for a decade, plant trees; if you are planning for a lifetime, educate people - Chinese Proverb"',
    '"Its not that I am so smart, its just that I stay with problems longer" - Albert Einstein',
    '"Teachers open the door, but you must enter by yourself" - Chinese Proverb',
    '"The beautiful thing about learning is that no one can take it away from you" - B. B. King',
  ];

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <>
      <BannerContainer container direction="column">
        <BannerItems>
          <Logo to="/" style={{ color: "white" }}>
            MauTutorz
          </Logo>

          <LoginLink to="/login" style={{ color: "white" }}>
            Login in now
          </LoginLink>
          <BannerQuotes style={{ color: "white" }}>
            {quotes[currentStep]}
          </BannerQuotes>
        </BannerItems>
      </BannerContainer>
      <div>
        {currentStep !== 0 && (
          <Steppers activeStep={currentStep} alternativeLabel>
            <Steps key="AccountDetails">
              <StepLabels>Account Details</StepLabels>
            </Steps>

            <Steps key="PersonalDetails">
              <StepLabels>Personal Details</StepLabels>
            </Steps>

            <Steps key="ContactDetails">
              <StepLabels>Contact Details</StepLabels>
            </Steps>

            {data.accountType === "Tutor" && (
              <Steps key="Qualification">
                <StepLabels>Qualification</StepLabels>
              </Steps>
            )}

            <Steps key="VerifyDetails">
              <StepLabels>Verify Details</StepLabels>
            </Steps>
          </Steppers>
        )}
        {steps[currentStep]}
      </div>

      <Snackbar
        open={snackBarOpen}
        autoHideDuration={3000}
        onClose={handleSnackClose}
        message={error}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default Register;
