import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Mobilebar from "../components/Navbar/Mobilebar";
import HeroSection from "../components/HeroSection/HeroSection";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <Router>
        <Mobilebar isOpen={isOpen} toggle={toggle} />
        <Navbar toggle={toggle} />
        <HeroSection />
      </Router>
    </>
  );
};

export default Home;
