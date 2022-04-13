import styled from "styled-components";
import { Link } from "react-router-dom";

// Logo
export const Logo = styled(Link)`
  font-size: 2.4rem;
  font-family: "Kaushan Script", cursive;
  margin-left: 24px;
  margin-top: 24px;
  color: #1f2833;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    font-size: 2.1rem;
  }
`;

// Login and registration
export const BannerHeading = styled.h1`
  color: "#c5c6c7";
  margin-top: 24px;
  margin-left: 24px;

  @media screen and (max-width: 768px) {
    font-size: 1.4rem;
  }
`;

export const BannerQuotes = styled.p`
  color: "#c5c6c7";
  margin-top: 24px;
  margin-left: 24px;
  font-size: 20px;
  font-style: italic;

  @media screen and (max-width: 768px) {
    font-size: 15px;
  }
`;

export const FormIcon = styled.img`
  width: 50%;
  height: auto;
`;

export const SignUpLink = styled(Link)`
  position: absolute;
  top: 24px;
  right: 24px;
  text-decoration: none;
  color: #0b0c10;

  &:hover {
    border-bottom: 2px solid #45a29e;
  }

  @media screen and (max-width: 768px) {
    position: absolute;
    top: 45%;
    left: 65%;

    &:hover {
      border: 0;
    }
  }
`;

export const LoginLink = styled(Link)`
  position: absolute;
  top: 35vh;
  left: 40px;
  text-decoration: none;
  color: #0b0c10;

  &:hover {
    border-bottom: 2px solid #45a29e;
  }

  @media screen and (max-width: 768px) {
    position: absolute;
    top: 25vh;
    left: 40px;

    &:hover {
      border: 0;
    }
  }
`;

export const FormFooter = styled.h1`
  position: absolute;
  bottom: 0;
  left: 15%;
  font-size: 15px;
  font-weight: 100;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
export const ClassesIcon = styled.img`
  width: 40%;
  height: auto;
  @media screen and (max-width: 768px) {
    margin-top: 20vh;
    width: 90%;
  }
`;

export const AssignmentIcon = styled.img`
  width: 20%;
  height: auto;
  @media screen and (max-width: 768px) {
    margin-top: 10px;
    width: 80%;
  }
`;

export const ViewSubmissionsImg = styled.img`
  width: 40%;
  height: auto;
  @media screen and (max-width: 768px) {
    margin-top: 20vh;
    width: 95%;
  }
`;

export const PeopleViewIcon = styled.img`
  width: 20%;
  height: auto;
  @media screen and (max-width: 768px) {
    width: 95%;
  }
`;
