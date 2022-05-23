import React, { useState } from "react";
import {
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
import { useUserAuth } from "../../../Context/UserAuthContext";
import { StreamChat } from "stream-chat";
import LoadingSpinner from "../../LoadingSpinner/LoadingSpinner";

const Sidebar = () => {
  const { logOut, userDetails, setUserDetails, setUser, setClasses } =
    useUserAuth();
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const apiKey = "k248hxcdpdqk";
  const client = StreamChat.getInstance(apiKey);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logOut();
      await client.disconnectUser();
      window.localStorage.removeItem("tkxn");
      window.localStorage.removeItem("zpxn");
      window.localStorage.removeItem("userStorageDetails");
      setIsSubmitting(false);
      //emptying maps
      setUserDetails({});
      setUser({});
      setClasses([]);
    } catch (err) {
      alert(err.message); //To check for error codes
    }
  };

  return (
    <>
      <LoadingSpinner stateLoader={isSubmitting} />
      <Container>
        <Button clicked={click} onClick={() => handleClick()}>
          Click
        </Button>
        <SidebarContainer>
          <SlickBar clicked={click}>
            <Item onClick={() => setClick(false)} to="/dashboard/classes">
              <ClassMaterialIcon />
              <Text clicked={click}>Classes</Text>
            </Item>
            <Item onClick={() => setClick(false)} to="/dashboard/chats">
              <ChatMaterialIcon />
              <Text clicked={click}>Chats</Text>
            </Item>

            {userDetails?.accountType === "Tutor" && (
              <Item onClick={() => setClick(false)} to="/dashboard/videocall">
                <VideoMaterialIcon />
                <Text clicked={click}>Videocall</Text>
              </Item>
            )}

            {userDetails?.accountType === "Student" && (
              <Item onClick={() => setClick(false)} to="/dashboard/tutors">
                <PeopleMaterialIcon />
                <Text clicked={click}>Tutor Profiles</Text>
              </Item>
            )}

            <Item onClick={() => setClick(false)} to="/dashboard/bookings">
              <ContactMaterialCalendarIcon />
              <Text clicked={click}>Bookings</Text>
            </Item>
          </SlickBar>

          <Profile clicked={profileClick}>
            <AvatarMaterial
              onClick={() => handleProfileClick()}
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
                  onClick={() => setprofileClick(false)}
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
