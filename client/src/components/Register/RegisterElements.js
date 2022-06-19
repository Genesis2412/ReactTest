import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import ImageBanner from "../../images/registerBanner.png";

export const BannerContainer = styled(Grid)``;

export const BannerItems = styled(Grid)`
  background-image: url(${ImageBanner});
  background-size: cover;
  height: 40vh;

  @media screen and (max-width: 768px) {
    height: 30vh;
  }
`;

export const FormContainer = styled(Grid)`
  padding: 15px 10px 0px 10px;
`;

export const FormItems = styled(Grid)``;

export const FormInput = styled(Grid)``;

export const RegisterSelectItem = styled(MenuItem)`
  &:hover {
    background-color: #c5c6c7;
    color: #0b0c10;
  }
`;

export const RegisterField = styled(TextField)``;

export const RegisterButton = styled(Button)`
  background-color: #45a29e;
  color: white;

  margin-bottom: 10px;
  width: 100%;

  &:hover {
    background-color: #c5c6c7;
    color: #0b0c10;
  }
`;

//Student Success

export const ListContainerOne = styled(Grid)`
  border-right: 1px dashed #000;
  margin-top: 15px;
`;
export const ListContainerTwo = styled(Grid)`
  border-right: 1px dashed #000;
  margin-top: 15px;
`;
export const ListContainerThree = styled(Grid)`
  margin-top: 15px;
`;

export const ListContainerFour = styled(Grid)`
  border-left: 1px dashed #000;
  margin-top: 15px;
`;

export const ListContainer = styled(Grid)`
  margin-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
`;
export const SuccessList = styled(List)``;
export const SuccessListItem = styled(ListItem)``;
export const SuccessListItemText = styled(ListItemText)``;

export const Steppers = styled(Stepper)`
  margin-top: 20px;
`;
export const Steps = styled(Step)``;
export const StepLabels = styled(StepLabel)``;
