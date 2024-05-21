const nodemailer = require("nodemailer");

class EmailManager {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "coderhouse50015@gmail.com",
        pass: "norp renb afxw uxyq",
      },
    });
  }

  async sendPurchaseEmail(email, first_name, ticket) {
    try {
      const mailOptions = {
        from: "Coder Test <coderhouse50015@gmail.com>",
        to: email,
        subject: "Purchase Confirmation",
        html: `
                    <h1>Congratulations ${first_name}!</h1>
                    <p>Purchase Order: ${ticket}</p>
                `,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Sending Email Error:", error);
    }
  }

  async sendRestoreEmail(email, first_name, token) {
    try {
      const mailOptions = {
        from: "Coder Test <coderhouse50015@gmail.com>",
        to: email,
        subject: "Password Restore",
        html: `
                    <h1>Password Restore</h1>
                    <p>Hello ${first_name}!</p>
                    <p>You asked to reset your password. We send you the confirmation code:<strong> ${token} </strong></p>
                    <p> This code expires in 1 hour </p>
                    <p> Click the following link to <a href="http://localhost:8080/password"> Reset Password </a></p>
                `,
      };
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email Sending Error:", error);
      throw new Error("Email Sending Error");
    }
  }
}

module.exports = EmailManager;
