import React, { useState } from "react";
import Video from "../../videos/video.mp4";
import {
  HeroContainer,
  HeroBg,
  VideoBg,
  HeroContent,
  HeroHeading,
  HeroParagraph,
  HeroBtnWrapper,
  HeroButton,
  ArrowForward,
  ArrowRight,
} from "./HeroElements";
import Typical from "react-typical";
import { motion } from "framer-motion";

const HeroMain = () => {
  const [hover, setHover] = useState();

  const onHover = () => {
    setHover(!hover);
  };

  return (
    <HeroContainer>
      <HeroBg>
        <VideoBg autoPlay loop muted src={Video} type="video/mp4" />
      </HeroBg>
      <HeroContent>
        <HeroHeading
          as={motion.div}
          initial={{ y: 50, opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeInOut" },
          }}
        >
          Tutoring Made Easy for Grade 7 to 13
        </HeroHeading>
        <HeroParagraph>Sign up for a new account today</HeroParagraph>
        <HeroParagraph>
          <Typical
            steps={[
              "Book your tutors",
              1000,
              "Start tutoring",
              1000,
              "Enjoy the experience",
              1000,
            ]}
            loop={3}
            wrapper="p"
          />
        </HeroParagraph>

        <HeroBtnWrapper>
          <HeroButton
            to="/select"
            onMouseEnter={onHover}
            onMouseLeave={onHover}
          >
            Get Started {hover ? <ArrowForward /> : <ArrowRight />}
          </HeroButton>
        </HeroBtnWrapper>
      </HeroContent>
    </HeroContainer>
  );
};

export default HeroMain;
