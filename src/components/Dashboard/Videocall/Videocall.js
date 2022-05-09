import React from "react";
import { JitsiMeeting } from "@jitsi/react-sdk";
import { useUserAuth } from "../../../Context/UserAuthContext";
import { v4 as uuidv4 } from "uuid";

const Videocall = () => {
  const { userDetails } = useUserAuth();
  const name = userDetails?.name?.firstName + " " + userDetails?.name?.lastName;
  const videoId = uuidv4();

  return (
    <JitsiMeeting
      roomName={videoId}
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
