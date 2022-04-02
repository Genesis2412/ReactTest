import React, { useState, useEffect } from "react";
import {
  HomeMaterialIcon,
  ClassMaterialIcon,
  ChatMaterialIcon,
  VideoMaterialIcon,
  NotificationsMaterialIcon,
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
  AddMaterialIcon,
} from "./DrawerElements";
import { useUserAuth } from "../../../Context/UserAuthContext";

const Sidebar = () => {
  const { logOut, userDetails } = useUserAuth();

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogout = async () => {
    try {
      setIsSubmitting(true);
      await logOut();
      setIsSubmitting(false);
    } catch (err) {
      alert(err.message); //To check for error codes
    }
  };

  return (
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
          <Item onClick={() => setClick(false)} to="/dashboard/videocall">
            <VideoMaterialIcon />
            <Text clicked={click}>Videocall</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/dashboard/notifications">
            <NotificationsMaterialIcon />
            <Text clicked={click}>Notifications</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/dashboard/create">
            <AddMaterialIcon />
            <Text clicked={click}>Create Class</Text>
          </Item>
        </SlickBar>

        <Profile clicked={profileClick}>
          <img
            onClick={() => handleProfileClick()}
            src="https://picsum.photos/200"
            alt="Profile"
          />
          <Details clicked={profileClick}>
            <Name>
              <h4>
                {userDetails?.name?.firstName +
                  " " +
                  userDetails?.name?.lastName}
              </h4>
              <a href="/#">view&nbsp;profile</a>
            </Name>

            <Logout onClick={handleLogout} disabled={isSubmitting}>
              <PowerMaterialIcon fontSize="large" />
            </Logout>
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
