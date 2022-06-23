const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.js");
const mailRoutes = require("./routes/mailer.js");

const app = express();
const PORT = process.env.PORT || 5000;

require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/auth", authRoutes);
app.use("/mail", mailRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
