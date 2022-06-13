import React, { useState } from "react";
import Video from "../../videos/videoSelect.mp4";
import {
  HeroContainer,
  HeroBg,
  VideoBg,
  HeroContent,
  HeroHeading,
  HeroBtnWrapper,
  HeroButton,
} from "./HeroElements";
import Navbar from "./Navbar";
import Mobilebar from "./Mobilebar";

const HeroSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Mobilebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />
      <HeroContainer>
        <HeroBg>
          <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
        </HeroBg>
        <HeroContent>
          <HeroHeading>Are you a student or a tutor?</HeroHeading>

          <HeroBtnWrapper style={{ display: "inline-block" }}>
            <HeroButton to="/forstudent">Student</HeroButton>
            <HeroButton to="/fortutor" style={{ marginTop: 30 }}>
              Tutor
            </HeroButton>
          </HeroBtnWrapper>
        </HeroContent>
      </HeroContainer>
    </>
  );
};

export default HeroSection;
