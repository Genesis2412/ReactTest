const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
