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

export const FormIcon = styled.img`
  width: 50%;
  height: auto;

  @media screen and (max-width: 768px) {
    margin-top: -30px;
  }
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
    top: 41%;
    left: 65%;

    &:hover {
      border: 0;
    }
  }
`;

export const FormFooter = styled.p`
  position: absolute;
  bottom: 10px;
  left: 15%;

  @media screen and (max-width: 768px) {
    position: absolute;
    left: 35%;
  }
`;
