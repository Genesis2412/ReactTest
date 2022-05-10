// // import React from "react";
// // import { db } from "../../firebase-config";
// // import { collection, doc, setDoc, addDoc, getDoc } from "firebase/firestore";
// // import { useUserAuth } from "../../Context/UserAuthContext";

// // const Insert = () => {
// //   const { signUp, user } = useUserAuth();
// //   const class_code = "49c969a5-e79d-4a57-a41a-0a28ab34ad99";

// //   const createData = async () => {
// //     // 1. read if class_code exist
// //     const getClass = doc(db, "createdClasses", class_code);
// //     const classValues = await getDoc(getClass);
// //     if (classValues.exists()) {
// //       // console.log("Document data:", classValues.data());
// //       // 2. if exist insert into JoinedClasses
// //       const joinedRef = collection(db, "joinedClasses");

// //       setDoc(doc(joinedRef), {
// //         TutorFirstName: classValues.data().firstName,
// //         TutorLastName: classValues.data().lastName,
// //         subject: classValues.data().subject,
// //         TutorProfilePic: classValues.data().profilePic,
// //         grade: classValues.data().grade,
// //         userUid: user.uid,
// //         class_code: class_code,
// //       });
// //       console.log("Added Successfully");
// //     } else {
// //       // doc.data() will be undefined in this case
// //       console.log("No such document!");
// //     }
// //   };
// //   return <button onClick={createData}>Create</button>;
// // };

// // export default Insert;

// import React from "react";
// import Editor from "ckeditor5-custom-build/build/ckeditor";
// import { CKEditor } from "@ckeditor/ckeditor5-react";

// const Insert = () => {
//   return (
//     <CKEditor
//       editor={Editor}
//       data="<p>Hello from CKEditor 5!</p>"
//       onReady={(editor) => {
//         // You can store the "editor" and use when it is needed.
//         console.log("Editor is ready to use!", editor);
//       }}
//       onChange={(event, editor) => {
//         const data = editor.getData();
//         console.log({ event, editor, data });
//       }}
//       onBlur={(event, editor) => {
//         console.log("Blur.", editor);
//       }}
//       onFocus={(event, editor) => {
//         console.log("Focus.", editor);
//       }}
//     />
//   );
// };

// export default Insert;

import React from "react";

const Insert = () => {
  return (
    <div>
      <a href={"http://hangouts.google.com/start"} target={"blank"}>
        Google Meet
      </a>
      <br />
      <a href={"https://mail.google.com/chat/"} target={"blank"}>
        hangouts
      </a>
    </div>
  );
};

export default Insert;
