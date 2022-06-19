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
import { useUserAuth } from "../../Context/UserAuthContext";

const Mobilebar = ({ isOpen, toggle }) => {
  const { user } = useUserAuth();
  return (
    <>
      <MobilebarContainer isOpen={isOpen}>
        <Icon>
          <CloseIcon onClick={toggle} />
        </Icon>
        <MobilebarWrapper>
          <MobilebarMenu>
            <MobilebarLink to="/forstudent" onClick={toggle}>
              For Students
            </MobilebarLink>
            <MobilebarLink to="/fortutor" onClick={toggle}>
              For Tutors
            </MobilebarLink>
          </MobilebarMenu>

          {!user && (
            <>
              <MobilebtnWrapper>
                <MobilebarRoute to="/login">Sign in</MobilebarRoute>
              </MobilebtnWrapper>
              <MobilebtnWrapper style={{ marginTop: 10 }}>
                <MobilebarRoute to="/register">Sign Up</MobilebarRoute>
              </MobilebtnWrapper>
            </>
          )}

          {user && (
            <MobilebtnWrapper style={{ marginTop: 10 }}>
              <MobilebarRoute to="/dashboard">My dashboard</MobilebarRoute>
            </MobilebtnWrapper>
          )}
        </MobilebarWrapper>
      </MobilebarContainer>
    </>
  );
};

export default Mobilebar;
