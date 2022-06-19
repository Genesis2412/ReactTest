import styled from "styled-components";
import { styled as MaterialStyles } from "@mui/material/styles";
import { Link, NavLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import ClassIcon from "@mui/icons-material/Class";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import Avatar from "@mui/material/Avatar";
import ChatIcon from "@mui/icons-material/Chat";
import AddIcon from "@mui/icons-material/Add";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import PeopleIcon from "@mui/icons-material/People";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";

export const HomeMaterialIcon = MaterialStyles(HomeIcon)`
  &:hover {
    color: #66fcf1;
  }
`;
export const ClassMaterialIcon = MaterialStyles(ClassIcon)`
  &:hover {
    color: #66fcf1;
  }
`;
export const VideoMaterialIcon = MaterialStyles(VideoCallIcon)`
  &:hover {
    color: #66fcf1;
  }
`;

export const ChatMaterialIcon = MaterialStyles(ChatIcon)`
  &:hover {
    color: #66fcf1;
  }
`;
export const PowerMaterialIcon = MaterialStyles(PowerSettingsNewIcon)`
  color: red;
  &:hover {
    color: #66fcf1;
  }
`;

export const AddMaterialIcon = MaterialStyles(AddIcon)`
  &:hover {
    color: #66fcf1;
  }
`;

export const PeopleMaterialIcon = MaterialStyles(PeopleIcon)`
  &:hover {
    color: #66fcf1;
  }
`;

export const ContactMaterialCalendarIcon = MaterialStyles(
  PermContactCalendarIcon
)`
  &:hover {
    color: #66fcf1;
  }
`;

export const AvatarMaterial = MaterialStyles(Avatar)`
  cursor:pointer;
  `;

export const Container = styled.div`
  /* position: fixed; */
  z-index: 20;
  .active {
    color: #66fcf1;
  }
`;
export const Button = styled.button`
  background-color: #0b0c10;
  border: none;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin: 0.5rem 0 0 0.5rem;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  &::before,
  &::after {
    content: "";
    background-color: #66fcf1;
    height: 2px;
    width: 1rem;
    position: absolute;
    transition: all 0.3s ease;
  }
  &::before {
    top: ${(props) => (props.clicked ? "1.5" : "1rem")};
    transform: ${(props) => (props.clicked ? "rotate(135deg)" : "rotate(0)")};
  }
  &::after {
    top: ${(props) => (props.clicked ? "1.2" : "1.5rem")};
    transform: ${(props) => (props.clicked ? "rotate(-135deg)" : "rotate(0)")};
  }
`;

export const SidebarContainer = styled.div`
  background-color: #0b0c10;
  width: 3.5rem;
  height: 80vh;
  margin-top: 1rem;
  border-radius: 0 30px 30px 0;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

export const SlickBar = styled.ul`
  color: #c5c6c7;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #0b0c10;
  padding: 2rem 0;
  position: absolute;
  top: 6rem;
  left: 0;
  width: ${(props) => (props.clicked ? "12rem" : "3.5rem")};
  transition: all 0.5s ease;
  border-radius: 0 30px 30px 0;

  @media screen and (max-width: 768px) {
    padding: 3.5rem 0;
  }
`;

export const Item = styled(NavLink)`
  text-decoration: none;
  color: #c5c6c7;
  width: 80%;
  padding: 1.5rem 0;
  cursor: pointer;
  display: flex;
  padding-left: 1rem;
`;

export const ViewProfileLink = styled(Link)`
  text-decoration: none;
  color: #c5c6c7;
`;

export const Text = styled.span`
  width: ${(props) => (props.clicked ? "100%" : "0")};
  overflow: hidden;
  margin-left: ${(props) => (props.clicked ? "1.5rem" : "0")};
  padding-top: 3px;
  transition: all 0.3s ease;
  &:hover {
    color: #66fcf1;
  }
`;

export const Profile = styled.div`
  width: ${(props) => (props.clicked ? "16rem" : "1.5rem")};
  height: 3rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: ${(props) => (props.clicked ? "13rem" : "0")};
  background-color: #0b0c10;
  color: #c5c6c7;
  transition: all 0.3s ease;
  img {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    cursor: pointer;
  }
`;

export const Details = styled.div`
  display: ${(props) => (props.clicked ? "flex" : "none")};
  justify-content: space-between;
  align-items: center;
`;

export const Name = styled.div`
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h4 {
    display: inline-block;
  }
  a {
    font-size: 0.8rem;
    text-decoration: none;
    color: grey;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Logout = styled.button`
  border: none;
  width: 2rem;
  height: 2rem;
  background-color: transparent;
  cursor: pointer;
`;
