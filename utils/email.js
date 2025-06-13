import { createTransport } from "nodemailer";

export const sendVerificationEmail = async (to, verifyUrl) => {
    const transporter = createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.APPEMAIL,
            pass: process.env.APPEMAILPASS
        }
    });

    await transporter.sendMail({
        from: `"Your App" <${process.env.APPEMAIL}>`,
        to,
        subject: 'Verify your email',
        html: `
            <p>Please verify your email by clicking the button below:</p>
            <a href="${verifyUrl}" 
            style="display: inline-block; padding: 10px 20px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px;">
            Verify Email
            </a>
        `
    });
};


