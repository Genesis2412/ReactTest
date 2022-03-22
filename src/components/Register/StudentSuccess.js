import React from "react";
import { FormItems, ListContainerOne, ListContainerTwo, ListContainerThree, ListContainer, StudentList, StudentListItem, StudentListItemText, RegisterButton } from "./RegisterElements";

const StudentSuccess = (props) => {
  const handleSubmit = (values) => {
    props.next(values, true);
  };
  return (
    <>
      <FormItems container item spacing={2}>
        <ListContainerOne item xs={12} sm="auto" md={4}>
          <StudentList>
            <StudentListItem>
              <StudentListItemText primary="Title" secondary={props.data.title} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Gender" secondary={props.data.gender} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Full Name" secondary={props.data.firstName + " " + props.data.lastName} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Date of birth" secondary={props.data.day + " " + props.data.month + " " + props.data.year} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Nationality" secondary={props.data.nationality} />
            </StudentListItem>
          </StudentList>
        </ListContainerOne>

        <ListContainerTwo item xs={12} sm="auto" md={4}>
          <StudentList>
            <StudentListItem>
              <StudentListItemText primary="Address" secondary={props.data.streetAddress + " " + props.data.city + " " + props.data.district} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Home Number" secondary={props.data.homeNumber} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Mobile Number" secondary={props.data.mobileNumber} />
            </StudentListItem>

            <StudentListItem>
              <StudentListItemText primary="Additional Number" secondary="Paul Pieer" />
            </StudentListItem>
          </StudentList>
        </ListContainerTwo>

        <ListContainerThree item xs={12} sm="auto" md={4}>
          <StudentList>
            <StudentListItem>
              <StudentListItemText primary="Account Type" secondary={props.data.accountType} />
            </StudentListItem>
            <StudentListItem>
              <StudentListItemText primary="Email" secondary={props.data.email} />
            </StudentListItem>
          </StudentList>
        </ListContainerThree>
      </FormItems>

      <ListContainer item>
        <RegisterButton onClick={handleSubmit}>Submit</RegisterButton>
      </ListContainer>
    </>
  );
};

export default StudentSuccess;
