import { styled as MaterialStyles } from "@mui/material/styles";
import styled from "styled-components";
import { Avatar } from "@mui/material";

export const AvatarContainer = MaterialStyles(Avatar)`
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

export const Image = styled.img`
  width: 100%;
  height: 72vh;
  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;
