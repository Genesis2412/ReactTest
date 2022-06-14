import React from "react";
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
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <HeroContainer
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7 }}
    >
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
  );
};

export default HeroSection;
