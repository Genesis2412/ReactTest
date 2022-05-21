const { connect } = require("getstream");
const bcrypt = require("bcrypt");
const StreamChat = require("stream-chat").StreamChat;
const crypto = require("crypto");
require("dotenv").config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userId = crypto.randomBytes(16).toString("hex");
    const serverClient = connect(api_key, api_secret, app_id);
    const hashedPassword = await bcrypt.hash(password, 10);
    const token = serverClient.createUserToken(userId);

    res
      .status(200)
      .json({ token, userId, firstName, lastName, email, hashedPassword });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);
    const { users } = await client.queryUsers({ email: email });

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const success = await bcrypt.compare(password, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      res.status(200).json({
        token,
        userId: users[0].id,
        firstName: users[0].firstName,
        lastName: users[0].lastName,
        email: users[0].email,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const passwordHash = async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const serverClient = connect(api_key, api_secret, app_id);
    const client = StreamChat.getInstance(api_key, api_secret);
    const { users } = await client.queryUsers({ email: email });

    if (users.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const success = await bcrypt.compare(oldPassword, users[0].hashedPassword);
    const token = serverClient.createUserToken(users[0].id);

    if (success) {
      const userId = users[0].id;
      const newHashedPassword = await bcrypt.hash(newPassword, 10);

      try {
        client.partialUpdateUser({
          id: userId,
          set: {
            hashedPassword: newHashedPassword,
          },
        });
        res.status(200).json({
          token,
          userId: users[0].id,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      return res.status(400).json({ message: "Old password not valid" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const client = StreamChat.getInstance(api_key, api_secret);
    await client.deleteUser(userId, {
      delete_conversation_channels: true,
      mark_messages_deleted: true,
      hard_delete: true,
    });
    res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = { register, login, passwordHash, deleteUser };
