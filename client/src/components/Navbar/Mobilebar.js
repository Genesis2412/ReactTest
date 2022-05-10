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
} from "./MobilebarElements";

const Mobilebar = ({ isOpen, toggle }) => {
  return (
    <>
      <MobilebarContainer isOpen={isOpen}>
        <Icon>
          <CloseIcon onClick={toggle} />
        </Icon>
        <MobilebarWrapper>
          <MobilebarMenu>
            <MobilebarLink to="about" onClick={toggle}>
              About Us
            </MobilebarLink>
            <MobilebarLink to="services" onClick={toggle}>
              Services
            </MobilebarLink>
            <MobilebarLink to="tutors" onClick={toggle}>
              Tutors
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
