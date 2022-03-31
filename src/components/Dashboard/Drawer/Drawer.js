import React, { useState } from "react";
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
} from "./DrawerElements";

const Sidebar = () => {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  return (
    <Container>
      <Button clicked={click} onClick={() => handleClick()}>
        Click
      </Button>
      <SidebarContainer>
        <SlickBar clicked={click}>
          <Item
            onClick={() => setClick(false)}
            exact
            activeClassName="active"
            to="/dashboard"
          >
            <HomeMaterialIcon />
            <Text clicked={click}>Home</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/classes"
          >
            <ClassMaterialIcon />
            <Text clicked={click}>Classes</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/chats"
          >
            <ChatMaterialIcon />
            <Text clicked={click}>Chats</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/videocall"
          >
            <VideoMaterialIcon />
            <Text clicked={click}>Videocall</Text>
          </Item>
          <Item
            onClick={() => setClick(false)}
            activeClassName="active"
            to="/notifications"
          >
            <NotificationsMaterialIcon />
            <Text clicked={click}>Notifications</Text>
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
              <h4>Jhon&nbsp;Doe</h4>
              <a href="/#">view&nbsp;profile</a>
            </Name>

            <Logout>
              <PowerMaterialIcon fontSize="large" />
            </Logout>
          </Details>
        </Profile>
      </SidebarContainer>
    </Container>
  );
};

export default Sidebar;
