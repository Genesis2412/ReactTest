import { styled } from "@mui/material/styles";
import { Avatar } from "@mui/material";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import ChatIcon from "@mui/icons-material/Chat";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export const AvatarContainer = styled(Avatar)`
  position: relative;
  top: 50px;
  left: 23%;
  width: 150px;
  height: auto;
  @media screen and (max-width: 768px) {
    width: 120px;
    height: auto;
  }
`;

export const VideoCallMaterialIcon = styled(VideoCallIcon)`
  color: #45a29e;
`;
export const ChatMaterialIcon = styled(ChatIcon)`
  color: #45a29e;
`;

export const HorizontalDotMaterialIcon = styled(MoreHorizIcon)`
  color: #45a29e;
  float: right;
`;
