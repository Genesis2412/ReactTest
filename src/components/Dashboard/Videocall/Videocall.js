import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useUserAuth } from "../../../Context/UserAuthContext";

const Videocall = () => {
  const { userDetails } = useUserAuth();
  const name = userDetails?.name?.firstName + " " + userDetails?.name?.lastName;

  return (
    <JitsiMeeting
      roomName={"Newmeetsxcw"}
      getIFrameRef={(iframeRef) => {
        iframeRef.style.height = "800px";
      }}
      userInfo={{
        displayName: name,
      }}
      configOverwrite={{
        startWithAudioMuted: true,
        startWithVideoMuted: true,
      }}
    />
  );
};

export default Videocall;
