require("dotenv").config();
const mailgun = require("mailgun-js");
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

const sendEmail = async (req, res) => {
  const { from, to, subject, text, html } = req.body;
  const data = { from: from, to: to, subject: subject, text: text, html: html };

  try {
    await mg.messages().send(data);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = { sendEmail };
