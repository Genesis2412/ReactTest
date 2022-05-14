import React from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export const AddChannel = ({
  setCreateType,
  setIsCreating,
  setIsEditing,
  setToggleContainer,
  setIsViewing,
  type,
}) => (
  <AddCircleIcon
    sx={{
      fontSize: 16,
      color: "#66fcf1",
      position: "relative",
      bottom: "1px",
      cursor: "pointer",
    }}
    onClick={() => {
      setCreateType(type);
      setIsCreating((prevState) => !prevState);
      setIsEditing(false);
      setIsViewing(false);
      if (setToggleContainer) {
        setToggleContainer((prevState) => !prevState);
      }
    }}
  />
);
