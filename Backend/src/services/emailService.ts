import nodemailer from "nodemailer";

const testAccount = await nodemailer.createTestAccount();

const transporter = nodemailer.createTransport({
    host: testAccount.smtp.host,
    port: testAccount.smtp.port,
    secure: testAccount.smtp.secure,
    auth: {
        user: testAccount.user,
        pass: testAccount.pass
    }
})

export const sendPasswordResetEmail = async( recipientEmail: string, resetUrl: string) => {
const info = await transporter.sendMail({
    from: '"Job Tracker" <no-reply@jobtracker.test>',
    to: recipientEmail,
    subject: "Reset your password",
    text: `Reset your password: ${resetUrl}`,
    html: `<a href="${resetUrl}">Reset your password</a>`
})
    const previewUrl = nodemailer.getTestMessageUrl(info)

    console.log("Email preview:", previewUrl)

    return previewUrl
}