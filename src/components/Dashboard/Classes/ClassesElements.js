import { styled } from "@mui/material/styles";
import { Avatar } from "@mui/material";

export const AvatarContainer = styled(Avatar)`
  position: relative;
  top: 25px;
  left: 23%;
  width: 150px;
  height: auto;
  @media screen and (max-width: 768px) {
    width: 120px;
    height: auto;
  }
`;
