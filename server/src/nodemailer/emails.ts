// mailer/mailer.ts
import transporter, { sender } from "./nodemailer.config";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplate";

const sendMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const response = await transporter.sendMail({
      from: `"${sender.name}" <${sender.email}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", response.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(`Error sending email: ${error}`);
  }
};

export const sendVerificationEmail = async (
  email: string,
  verificationToken: number
) => {
  const subject = "Verify your email";
  const html = VERIFICATION_EMAIL_TEMPLATE.replace(
    "{verificationCode}",
    verificationToken.toString()
  );

  await sendMail({ to: email, subject, html });
};

export const sendWelcomeEmail = async (email: string, name: string) => {
  const subject = "Welcome to Auth Company";
  const html = `
    <h2>Welcome ${name},</h2>
    <p>Thank you for joining <strong>Auth Company</strong>! We're excited to have you on board.</p>
  `;

  await sendMail({ to: email, subject, html });
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
) => {
  const subject = "Reset your password";
  const html = PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL);

  await sendMail({ to: email, subject, html });
};

export const sendResetSuccessEmail = async (email: string) => {
  const subject = "Password Reset Successful";
  const html = PASSWORD_RESET_SUCCESS_TEMPLATE;

  await sendMail({ to: email, subject, html });
};
