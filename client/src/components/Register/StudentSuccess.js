import React from "react";
import {
  FormItems,
  ListContainerOne,
  ListContainerTwo,
  ListContainerThree,
  ListContainer,
  SuccessList,
  SuccessListItem,
  SuccessListItemText,
  RegisterButton,
} from "./RegisterElements";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const StudentSuccess = (props) => {
  const handleSubmit = (values) => {
    props.next(values, true);
  };

  return (
    <>
      <FormItems container item spacing={2}>
        <ListContainerOne item xs={12} sm="auto" md={4}>
          <SuccessList>
            <SuccessListItem>
              <SuccessListItemText
                primary="Title"
                secondary={props.data.title}
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Gender"
                secondary={props.data.gender}
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Full Name"
                secondary={props.data.firstName + " " + props.data.lastName}
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Date of birth"
                secondary={
                  props.data.day +
                  " " +
                  props.data.month +
                  " " +
                  props.data.year
                }
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Nationality"
                secondary={props.data.nationality}
              />
            </SuccessListItem>
          </SuccessList>
        </ListContainerOne>

        <ListContainerTwo item xs={12} sm="auto" md={4}>
          <SuccessList>
            <SuccessListItem>
              <SuccessListItemText
                primary="Address"
                secondary={
                  props.data.streetAddress +
                  ", " +
                  props.data.city +
                  ", " +
                  props.data.district
                }
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Home Number"
                secondary={props.data.homeNumber}
              />
            </SuccessListItem>

            <SuccessListItem>
              <SuccessListItemText
                primary="Mobile Number"
                secondary={props.data.mobileNumber}
              />
            </SuccessListItem>

            {props.data.additionalNumber && (
              <SuccessListItem>
                <SuccessListItemText
                  primary="Additional Number"
                  secondary={props.data.additionalNumber}
                />
              </SuccessListItem>
            )}
          </SuccessList>
        </ListContainerTwo>

        <ListContainerThree item xs={12} sm="auto" md={4}>
          <SuccessList>
            <SuccessListItem>
              <SuccessListItemText
                primary="Account Type"
                secondary={props.data.accountType}
              />
            </SuccessListItem>
            <SuccessListItem>
              <SuccessListItemText
                primary="Email"
                secondary={props.data.email}
              />
            </SuccessListItem>
          </SuccessList>
        </ListContainerThree>
      </FormItems>

      {props.error && <Alert severity="error">{props.error}</Alert>}

      <ListContainer item>
        <RegisterButton
          disabled={props.isSubmitting}
          value="Submit"
          onClick={handleSubmit}
        >
          {props.isSubmitting ? (
            <CircularProgress color="secondary" />
          ) : (
            "Submit"
          )}
        </RegisterButton>
      </ListContainer>
    </>
  );
};

export default StudentSuccess;
