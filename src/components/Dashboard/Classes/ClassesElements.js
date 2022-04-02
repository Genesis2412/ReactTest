import { styled } from "@mui/material/styles";
import { Box, Avatar } from "@mui/material";

export const Boxes = styled(Box)`
  background-color: grey;
  width: 100%;
  @media screen and (max-width: 768px) {
    height: 80px;
    width: 35vh;
  }
`;

export const Avatarx = styled(Avatar)`
  position: absolute;
  bottom: 90px;
  left: 26%;
  width: 150px;
  height: auto;
  @media screen and (max-width: 768px) {
    width: 120px;
    height: auto;
    bottom: 120px;
    left: 28%;
  }
`;
