import { styled } from "@mui/material/styles";
import { Grid, TextField, Button, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import ImageBanner from "../../images/ImageBanner.jpg";

export const BannerContainer = styled(Grid)``;

export const BannerItems = styled(Grid)`
  background-image: url(${ImageBanner});
  background-size: cover;
  height: 40vh;

  @media screen and (max-width: 768px) {
    height: 40vh;
  }
`;

export const FormContainer = styled(Grid)`
  padding: 15px 10px 0px 10px;
`;

export const FormItems = styled(Grid)``;

export const FormInput = styled(Grid)``;

export const RegisterSelectItem = styled(MenuItem)``;

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

export const ListContainerFive = styled(Grid)`
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
