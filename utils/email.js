import { createTransport } from "nodemailer";

export const sendVerificationEmail = async (to, token) => {
    const transporter = createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAILPASS
        }
    });

    const verifyUrl = `http://localhost:${process.env.PORT}/verify-email?token=${token}`;

    await transporter.sendMail({
        from: '"Your App" <no-reply@yourapp.com>',
        to,
        subject: 'Verify your email',
        html: `<p>Please verify your email by clicking the link below:</p>
                <a href="${verifyUrl}>${verifyUrl}</a>`
    });
};

