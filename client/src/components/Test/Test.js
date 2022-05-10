import React from "react";
import { useUserAuth } from "../../Context/UserAuthContext";

const Test = () => {
  const { user, logOut, resetPassword } = useUserAuth();

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleReset = async () => {
    try {
      resetPassword(user.email).then(() => {
        console.log("sent");
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      Hello {user.uid}
      <br />
      <br />
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
};

export default Test;
