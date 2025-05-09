import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "stha07ashok@gmail.com",
    pass: "ynmz htta joyk jteo",
  },
});

export const sender = {
  email: "stha07ashok@gmail.com",
  name: "Ashok Shrestha",
};

export default transporter;
