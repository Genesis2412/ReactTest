import React from "react";
import axios from "axios";
import { StreamChat } from "stream-chat";
const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);

const Read = () => {
  const userId = "Hire2p@hotmail.com";
  const password = "Hiresh@20,";

  const loginUserChat = async () => {
    const URL = "http://localhost:5000/auth/deleteUser";
    await axios
      .post(URL, {
        userId,
      })
      .then(({ data }) => {
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const logout = async () => {
  //   await client.disconnectUser();
  // };

  return (
    <>
      <button
        onClick={() => {
          loginUserChat();
        }}
      >
        Click
      </button>

      {/* <button
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button> */}
    </>
  );
};

export default Read;

// import React from "react";
// import { StreamChat } from "stream-chat";
// const apiKey = "k248hxcdpdqk";
// const client = StreamChat.getInstance(apiKey);

// const Read = () => {
//   console.log(client);

//   const updateUser = async () => {
//     client.partialUpdateUser({
//       id: "71b71a412764988b2580b17560f11f34",
//       set: {
//         image:
//           "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
//         testssd: "Hello",
//       },
//     });
//     client.on("user.updated", () => {
//       // console.log(client.user.description); // 'New description'
//     });
//   };
//   return (
//     <button
//       onClick={() => {
//         updateUser();
//       }}
//     >
//       Read
//     </button>
//   );
// };

// export default Read;
