import React, { useState } from "react";
import Navbar from "./Navbar";
import Mobilebar from "./Mobilebar";
import { Routes, Route, useLocation } from "react-router-dom";
import HeroMain from "./HeroMain";
import HeroSection from "./HeroSelection";
import HeroStudent from "./HeroStudent";
import HeroTutor from "./HeroTutor";
import { AnimatePresence } from "framer-motion";
import ErrorPage from "../ErrorPage/ErrorPage";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Mobilebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} />

      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HeroMain />} />
          <Route path="/select" element={<HeroSection />} />
          <Route path="/forstudent" element={<HeroStudent />} />
          <Route path="/fortutor" element={<HeroTutor />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

export default Home;
