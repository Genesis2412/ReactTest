import React from "react";
import {
  Nav,
  NavbarContainer,
  NavLogo,
  MobileIcon,
  NavMenu,
  NavItems,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./NavbarElements";
import { FaBars } from "react-icons/fa";
import { useUserAuth } from "../../Context/UserAuthContext";
import { motion } from "framer-motion";

const Navbar = ({ toggle }) => {
  const { userDetails } = useUserAuth();
  return (
    <>
      <Nav
        as={motion.nav}
        initial={{ y: -50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { duration: 0.7, ease: "easeInOut" },
        }}
      >
        <NavbarContainer>
          <NavLogo to="/">MauTutorz</NavLogo>
          <MobileIcon onClick={toggle}>
            <FaBars />
          </MobileIcon>
          <NavMenu>
            <NavItems>
              <NavLinks to="/forstudent">For Students</NavLinks>
            </NavItems>
            <NavItems>
              <NavLinks to="/fortutor">For Tutors</NavLinks>
            </NavItems>
          </NavMenu>

          {!userDetails && (
            <>
              <NavBtn>
                <NavBtnLink to="/login">Sign In</NavBtnLink>
              </NavBtn>
              <NavBtn>
                <NavBtnLink to="/register">Sign Up</NavBtnLink>
              </NavBtn>
            </>
          )}

          {userDetails && (
            <NavBtn>
              <NavBtnLink to="/dashboard">My Dashboard</NavBtnLink>
            </NavBtn>
          )}
        </NavbarContainer>
      </Nav>
    </>
  );
};

export default Navbar;
