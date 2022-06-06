import "./App.css";
import { useEffect } from "react";
import Redirect from "./Redirect/Redirect";
import { StreamChat } from "stream-chat";

const client = StreamChat.getInstance(process.env.REACT_APP_STREAM_API_KEY);
var authToken = window.localStorage.getItem("tkxn");
var userId = window.localStorage.getItem("zpxn");

if (authToken && userId) {
  client.connectUser(
    {
      token: authToken,
      id: userId,
    },
    authToken
  );
}

function App() {
  return (
    <>
      <Redirect />
    </>
  );
}

export default App;
