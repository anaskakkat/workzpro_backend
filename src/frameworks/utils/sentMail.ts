import nodemailer from "nodemailer";
import { AUTH_MAIL, AUTH_MAIL_PASSWORD } from "../constants/env";

export default class NodemailerEmailService {
  private transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: AUTH_MAIL,
      pass: AUTH_MAIL_PASSWORD,
    },
  });

  async sendEmail(email: string, otp: string | number): Promise<void> {
    await this.transporter.sendMail({
      from: AUTH_MAIL,
      to: email,
      subject: "WorkzPro Email Verification",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; text-align: center; background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
          <h2 style="color: #003383;">WorkzPro Email Verification</h2>
          <p>Hello ${email},</p>
          <p>Your verification code is:</p>
          <div style="display: inline-block; background-color: #3B82F6; color: white; padding: 10px; border-radius: 5px; font-size: 18px; text-align: center;">
            ${otp}
          </div>
          <p style="margin-top: 20px;">Please use this code to complete your verification process.</p>
          <p>Thank you,<br>WorkzPro Team</p>
        </div>
      `,
    });
  }
}
