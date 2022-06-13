import React from "react";
import {
  MobilebarContainer,
  Icon,
  CloseIcon,
  MobilebarWrapper,
  MobilebarMenu,
  MobilebarLink,
  MobilebtnWrapper,
  MobilebarRoute,
} from "./NavbarElements";

const Mobilebar = ({ isOpen, toggle }) => {
  return (
    <>
      <MobilebarContainer isOpen={isOpen}>
        <Icon>
          <CloseIcon onClick={toggle} />
        </Icon>
        <MobilebarWrapper>
          <MobilebarMenu>
            <MobilebarLink to="aboutus" onClick={toggle}>
              About Us
            </MobilebarLink>
            <MobilebarLink to="/forstudent" onClick={toggle}>
              For Students
            </MobilebarLink>
            <MobilebarLink to="/fortutor" onClick={toggle}>
              For Tutors
            </MobilebarLink>
          </MobilebarMenu>
          <MobilebtnWrapper>
            <MobilebarRoute to="/login">Sign in</MobilebarRoute>
          </MobilebtnWrapper>
        </MobilebarWrapper>
      </MobilebarContainer>
    </>
  );
};

export default Mobilebar;
