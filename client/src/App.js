import "./App.css";
import Redirect from "./Redirect/Redirect";
import { StreamChat } from "stream-chat";
import Cookies from "universal-cookie";

const apiKey = "k248hxcdpdqk";
const client = StreamChat.getInstance(apiKey);
const cookies = new Cookies();

const authToken = cookies.get("token");

if (authToken?.length !== 0) {
  client.connectUser(
    {
      token: cookies.get("token"),
      id: cookies.get("userId"),
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
