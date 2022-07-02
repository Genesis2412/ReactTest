import React from "react";
import axios from "axios";
import ReactHtmlParser from "react-html-parser";

const Read = () => {
  const sendEmail = async () => {
    const from = "sandbox86b84da84de745eb8626025e460f6bb9.mailgun.org";
    const to = "hiresh.pandoo@umail.uom.ac.mu";
    const subject = "New Assignment";

    var tutorName = "Josh Malone";
    var studentName = "Paul Smith";
    var assignmentDetails = "Hello this is a new Assignment";
    var className = "Mathematics, Grade 10";
    var submissionDate = "15/05/2022 20:20";

    var html =
      "<div style='display: block;margin-left: auto;margin-right: auto;width: 50%;'>" +
      "<div style='color: #000; padding: 5px; background-color: #c5c6c7; border-radius: 5px; box-shadow: 5px  5px 5px 5px #888888;text-align: center;font-family: Helvetica;'>" +
      "<a style='font-size: 2.0rem;font-family: Kaushan Script,cursive;color: #000;font-weight: bold;text-decoration: none;cursor: pointer;' href='www.youtube.com'>MauTutorz</a>" +
      `<p style='font-size: 15px'>Hi ${studentName}</p>` +
      `<p style='margin-top:15px'>${tutorName} posted a new assignment in ${className}.</p>` +
      `<p style='text-align:left; padding-left:10px; margin-top:10px'>${assignmentDetails}</p>` +
      `<p style='text-align:left; padding-left:10px; margin-top:10px'>Submission Date: <span style='color:#008AB6'>${submissionDate}</span></p>` +
      "<div style='padding-top: 10px;margin-top:15px'><a href='www.youtube.com' style='text-decoration: none; border: 2px solid #45a29e; padding: 2px 5px 2px 5px;border-radius: 20px'>Follow here</a></div>" +
      "<p style='margin-top:15px'>Contact your tutor for more detail</p>" +
      "<p style='margin-top:10px'>This is a MauTutorz generated email. <strong>Do not reply</strong></p></div>" +
      "</div>";
    const URL = "https://maututorz.herokuapp.com/mail/sendEmail";

    await axios.post(URL, {
      from,
      to,
      subject,
      html,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          sendEmail();
        }}
      >
        Hello
      </button>
      {/* {ReactHtmlParser(html)} */}
    </>
  );
};

export default Read;
