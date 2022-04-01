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
import { db } from "../../../firebase-config";
import { doc, getDoc } from "firebase/firestore";

const Sidebar = () => {
  const { logOut, user, setUserDetails, userDetails } = useUserAuth();

  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

  const [profileClick, setprofileClick] = useState(false);
  const handleProfileClick = () => setprofileClick(!profileClick);

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getUserDetails = async () => {
      if (user.uid) {
        const docRef = doc(db, "tutors", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document data:", docSnap.data());
          setUserDetails(docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
    };
    getUserDetails();
  }, []);

  console.log(userDetails);

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
          <Item onClick={() => setClick(false)} to="/dashboard">
            <HomeMaterialIcon />
            <Text clicked={click}>Home</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/classes">
            <ClassMaterialIcon />
            <Text clicked={click}>Classes</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/chats">
            <ChatMaterialIcon />
            <Text clicked={click}>Chats</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/videocall">
            <VideoMaterialIcon />
            <Text clicked={click}>Videocall</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/notifications">
            <NotificationsMaterialIcon />
            <Text clicked={click}>Notifications</Text>
          </Item>
          <Item onClick={() => setClick(false)} to="/formclasses">
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
