import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { Link as LinkRouter } from "react-router-dom";
import { Link as LinkScroll } from "react-scroll";

export const MobilebarContainer = styled.aside`
  position: fixed;
  z-index: 999;
  width: 100%;
  height: 100%;
  background-color: #0b0c10;
  display: grid;
  align-items: center;
  top: 0;
  left: 0;
  transition: 0.3s ease-in-out;
  /* If open set opacity to 100% else set it to 0 */
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  /* If open set top to 0 else set it to -100% */
  top: ${({ isOpen }) => (isOpen ? "0" : "-100%")};
`;

export const Icon = styled.div`
  position: absolute;
  top: 1.2rem;
  right: 1.5rem;
  background: transparent;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
`;

export const CloseIcon = styled(FaTimes)`
  color: #c5c6c7;
`;

export const MobilebarWrapper = styled.div`
  color: #66fcf1;
`;

export const MobilebarMenu = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: repeat(6, 80px);
  text-align: center;

  @media screen and (max-width: 768px) {
    grid-template-rows: repeat(6, 60px);
  } ;
`;

export const MobilebarLink = styled(LinkScroll)`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  text-decoration: none;
  list-style: none;
  transition: 0.2s ease-in-out;
  text-decoration: none;
  cursor: pointer;
`;

export const MobilebtnWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

export const MobilebarRoute = styled(LinkRouter)`
  border-radius: 50px;
  background-color: #c5c6c7;
  white-space: nowrap;
  padding: 16px 64px;
  color: #1f2833;
  font-size: 1.5rem;
  outline: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-decoration: none;

  &:hover {
    transition: all 0.2s ease-in-out;
    background-color: #fff;
    color: blue;
  }
`;
