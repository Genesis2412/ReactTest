import React from "react";
import {
  FormItems,
  ListContainerOne,
  ListContainerTwo,
  ListContainerThree,
  ListContainerFour,
  ListContainerFive,
  ListContainer,
  SuccessList,
  SuccessListItem,
  SuccessListItemText,
  RegisterButton,
} from "./RegisterElements";
import { Alert, CircularProgress } from "@mui/material";

const TutorSuccess = (props) => {
  const handleSubmit = (values) => {
    props.next(values, true);
  };

  var spacing = 0;
  if (
    props.data.degree === "" ||
    props.data.teacherQualification === "" ||
    props.data.employed === ""
  ) {
    spacing = 3;
  } else {
    spacing = 4;
  }

  console.log(spacing);

  return (
    <>
      <FormItems container item spacing={2}>
        <ListContainerOne item xs={12} sm="auto" md={spacing}>
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

        <ListContainerTwo item xs={12} sm="auto" md={spacing}>
          <SuccessList>
            <SuccessListItem>
              <SuccessListItemText
                primary="Address"
                secondary={
                  props.data.streetAddress +
                  " " +
                  props.data.city +
                  " " +
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

        <ListContainerThree item xs={12} sm="auto" md={spacing}>
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

        <ListContainerFour item xs={12} sm="auto" md={spacing}>
          <SuccessList>
            {props.data.degree === "Yes" && (
              <SuccessListItem>
                <SuccessListItemText
                  primary="Degree In"
                  secondary={props.data.degreeInfo}
                />
              </SuccessListItem>
            )}
            {props.data.teacherQualification === "Yes" && (
              <SuccessListItem>
                <SuccessListItemText
                  primary="Teacher Qualification In"
                  secondary={props.data.teacherQualificationInfo}
                />
              </SuccessListItem>
            )}
            {props.data.employed === "Yes" && (
              <SuccessListItem>
                <SuccessListItemText
                  primary="Employed at"
                  secondary={props.data.employedInfo}
                />
              </SuccessListItem>
            )}
          </SuccessList>
        </ListContainerFour>
      </FormItems>

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

export default TutorSuccess;
