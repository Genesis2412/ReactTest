import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const AddChannel = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
  type,
}) => (
  <AddCircleIcon
    sx={{ fontSize: 16, color: "#66fcf1" }}
    onClick={() => {
      setCreateType(type);
      setIsCreating((prevState) => !prevState);
      setIsEditing(false);
      if (setToggleContainer) {
        setToggleContainer((prevState) => !prevState);
      }
    }}
  />
);
