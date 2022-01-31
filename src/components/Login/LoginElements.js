import { styled } from "@mui/material/styles";
import { Button, TextField, Grid, Modal, Box } from "@mui/material";
import CopyrightIcon from "@mui/icons-material/Copyright";
import ImageBanner from "../../images/ImageBanner.jpg";

export const LoginWrapper = styled(Grid)`
  height: 100vh;

  @media screen and (max-width: 768px) {
    display: block;
  }
`;

export const BannerGrid = styled(Grid)`
  background-image: url(${ImageBanner});
  background-size: cover;

  @media screen and (max-width: 768px) {
    height: 40vh;
  }
`;

export const FormGrid = styled(Grid)`
  background-color: #fff;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 768px) {
    height: 60vh;
  }
`;

export const LoginField = styled(TextField)`
  margin-top: 20px;

  @media screen and (max-width: 768px) {
    display: block;
    width: 300px;
  }
`;

export const LoginButton = styled(Button)`
  background-color: #45a29e;
  color: white;
  margin-top: 20px;
  width: 100%;

  &:hover {
    background-color: #c5c6c7;
    color: #0b0c10;
  }
`;
export const ForgotPassword = styled(Button)`
  text-decoration: none;
  color: #0b0c10;
  cursor: pointer;
  margin-top: 20px;
`;

export const IconCopyright = styled(CopyrightIcon)`
  position: absolute;
  bottom: 8px;
  left: 13%;

  @media screen and (max-width: 768px) {
    position: absolute;
    left: 27%;
  }
`;

export const ResetForm = styled(Modal)`
  width: 100%;
`;

export const ResetWrapper = styled(Box)`
  position: absolute;
  border-radius: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 650px;
  height: 30vh;
  background-color: rgba(241, 221, 231, 0.9);
  text-align: center;
`;

export const EmailField = styled(TextField)`
  margin-top: 40px;
  width: 500px;
`;

export const EmailResetBtn = styled(Button)`
  background-color: #45a29e;
  color: white;
  margin-top: 20px;
  width: 500px;

  &:hover {
    background-color: #c5c6c7;
    color: #0b0c10;
  }
`;
