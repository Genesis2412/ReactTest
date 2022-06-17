import React, { useState } from "react";
import {
  HomeMaterialIcon,
  PeopleMaterialIcon,
  ClassMaterialIcon,
  ChatMaterialIcon,
  VideoMaterialIcon,
  Container,
  Button,
  SidebarContainer,
  SlickBar,
  Item,
  Text,
  Profile,
  Details,
  Name,
  Logout,
  PowerMaterialIcon,
  ContactMaterialCalendarIcon,
  ViewProfileLink,
  AvatarMaterial,
} from "./DrawerElements";
import { Badge } from "@mui/material";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { StreamChat } from "stream-chat";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const Sidebar = () => {
  const {
    logOut,
    userDetails,
    setUserDetails,
    setUser,
    setClasses,
    bookingCount,
  } = useUserAuth();
  const [click, setClick] = useState(false);
  const [profileClick, setProfileClick] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logOut();
      await client.disconnectUser();
      window.localStorage.removeItem("tkxn");
      window.localStorage.removeItem("zpxn");
      window.localStorage.removeItem("userStorageDetails");
      //emptying maps
      setUserDetails({});
      setUser({});
      setClasses([]);
      setIsSubmitting(false);
      window.location.reload(false);
    } catch (err) {
      alert("An error occurred, please try again"); //To check for error codes
    }
  };

  return (
    <>
      <LoadingSpinner stateLoader={isSubmitting} />

      <Container>
        <Button clicked={click} onClick={() => setClick(!click)}>
          Click
        </Button>
        <SidebarContainer>
          <SlickBar
            clicked={click}
            onMouseEnter={() => setClick(true)}
            onMouseLeave={() => setClick(false)}
          >
            <Item
              onClick={() => {
                setClick(false);
                setProfileClick(false);
              }}
              to="/dashboard"
            >
              <HomeMaterialIcon />
              <Text clicked={click}>Home</Text>
            </Item>

            <Item
              onClick={() => {
                setClick(false);
                setProfileClick(false);
              }}
              to="/dashboard/classes"
            >
              <ClassMaterialIcon />
              <Text clicked={click}>Classes</Text>
            </Item>
            <Item
              onClick={() => {
                setClick(false);
                setProfileClick(false);
              }}
              to="/dashboard/chats"
            >
              <ChatMaterialIcon />
              <Text clicked={click}>Chats</Text>
            </Item>

            {userDetails?.accountType === "Tutor" && (
              <Item
                onClick={() => {
                  setClick(false);
                  setProfileClick(false);
                }}
                to="/dashboard/videocall"
              >
                <VideoMaterialIcon />
                <Text clicked={click}>Videocall</Text>
              </Item>
            )}

            {userDetails?.accountType === "Student" && (
              <Item
                onClick={() => {
                  setClick(false);
                  setProfileClick(false);
                }}
                to="/dashboard/tutors"
              >
                <PeopleMaterialIcon />
                <Text clicked={click}>Tutor Profiles</Text>
              </Item>
            )}

            <Item
              onClick={() => {
                setClick(false);
                setProfileClick(false);
              }}
              to="/dashboard/bookings"
            >
              <Badge badgeContent={bookingCount} color="primary">
                <ContactMaterialCalendarIcon />
              </Badge>
              <Text clicked={click}>Bookings</Text>
            </Item>
          </SlickBar>

          <Profile clicked={profileClick}>
            <AvatarMaterial
              onClick={() => setProfileClick(!profileClick)}
              src={userDetails?.profilePic}
              alt={userDetails?.name?.firstName}
            />

            <Details clicked={profileClick}>
              <Name>
                <h4>
                  {userDetails?.name?.firstName +
                    " " +
                    userDetails?.name?.lastName}
                </h4>
                <ViewProfileLink
                  onClick={() => setProfileClick(false)}
                  to="/dashboard/viewprofile"
                >
                  view profile
                </ViewProfileLink>
              </Name>

              <Logout onClick={handleLogout} disabled={isSubmitting}>
                <PowerMaterialIcon fontSize="large" />
              </Logout>
            </Details>
          </Profile>
        </SidebarContainer>
      </Container>
    </>
  );
};

export default Sidebar;
