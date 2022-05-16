import "./App.css";
import Redirect from "./Redirect/Redirect";
import { StreamChat } from "stream-chat";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);
var authToken = window.sessionStorage.getItem("tkxn");
var userId = window.sessionStorage.getItem("zpxn");

if (authToken?.length !== 0) {
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
