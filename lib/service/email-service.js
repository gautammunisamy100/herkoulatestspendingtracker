const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const fileService = require("./file-service");
dotenv.config();

let config = {
  to: "",
  subject: "",
  text: "",
  html: "",
  attachments: [],
};

module.exports = {
  sendPasswordResetEmail: async function (toEmail, password, username) {
    const output = `
             <h3>"Please don't Share this Information"</h3>
              <p>Spending Tracker Login Credential</p>
              <p>Dear ${username},</p>
             <ul>
                <li>UserName: ${username}</li>
                <li>Password: ${password}</li>
             </ul>
             <a href=${process.env.AUTHPAGEURL}>click to login</a>
             <h3>This is system generated mail, please do not reply to it.</h3>`;
    config.to = toEmail;
    config.subject = "Speding Tracker Credential";
    config.text = "Please dont share the information";
    config.html = output;
    config.attachments = [];
    try {
      await this.sendEmailTo(config);
      return true;
    } catch (err) {
      err = `\n  Error while sending Error Log" + ${err.message} \n`;
      fileService.writeErrorToLog(err);
      return false;
    }
  },
  sendErrorEmailToDev: async function () {
    if (fileService.getfileSize("error.log") <= 0) return;
    const output = ` <h3>"Please find the attachment"</h3>
          <p>Please go through the error log generated</p>
         <h3>This is system generated mail, please do not reply to it.</h3>`;
    config.to = process.env.DEV_EMAIL;
    config.subject = "Speding Tracker Devs Error";
    config.text = "Please go through the error log";
    config.html = output;
    config.attachments = [
      {
        path: "error.log",
      },
    ];
    try {
      await this.sendEmailTo(config);
      fileService.clearLogError();
      return true;
    } catch (err) {
      err = `\n  Error while sending Error Log" + ${err.message} \n`;
      fileService.writeErrorToLog(err);
      return false;
    }
  },
  sendEmailTo: async function () {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAILADDRESS,
        clientId: process.env.CLIENTID,
        clientSecret: process.env.CLIENTSECRET,
        refreshToken: process.env.REFRESHTOKEN,
        accessToken: process.env.ACCESSTOKEN,
      },
    });

    let mailOptions = {
      from: process.env.EMAILADDRESS,
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
      attachments: config.attachments,
    };
    return transporter.sendMail(mailOptions);
  },
};
