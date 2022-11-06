const nodemailer = require("nodemailer");

exports.generateOTP = (otp_length = 6) => {
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    const randomVal = Math.round(Math.random() * 9);
    OTP += randomVal;
  }

  return OTP;
};

exports.mailTransporter = nodemailer.createTransport({
  host: process.env.MAIL_TRAP_HOST,
  port: process.env.MAIL_TRAP_PORT,
  auth: {
    user: process.env.MAIL_TRAP_USER,
    pass: process.env.MAIL_TRAP_PASS,
  },
});
