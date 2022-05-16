// import React from "react";
// import axios from "axios";
// import { StreamChat } from "stream-chat";
// const apiKey = "k248hxcdpdqk";
// const client = StreamChat.getInstance(apiKey);

// const Read = () => {
//   const email = "Hire2p@hotmail.com";
//   const password = "Hiresh@20,";

//   const loginUserChat = async () => {
//     const URL = "http://localhost:5000/auth/login";
//     await axios
//       .post(URL, {
//         email,
//         password,
//       })
//       .then(({ data }) => {
//         if (data.token) {
//           client.connectUser(
//             {
//               id: data?.userId,
//               firstName: data?.firstName,
//               lastName: data?.lastName,
//               email: data?.email,
//             },
//             data.token
//           );
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   const logout = async () => {
//     await client.disconnectUser();
//   };

//   return (
//     <>
//       <button
//         onClick={() => {
//           loginUserChat();
//         }}
//       >
//         Click
//       </button>

//       <button
//         onClick={() => {
//           logout();
//         }}
//       >
//         Logout
//       </button>
//     </>
//   );
// };

// export default Read;

import React from "react";

const Read = () => {
  window.sessionStorage.setItem("animals", "cat");

  const deleteSession = () => {
    window.sessionStorage.removeItem("animals");
  };
  return (
    <button
      onClick={() => {
        deleteSession();
      }}
    >
      Delete
    </button>
  );
};

export default Read;
