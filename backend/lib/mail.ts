const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  }
});

function makeEmail(text: string): string {
  return `
    <div styles="
      border: 1px solid black;
      padding: 20px;
      font-family: sans-serif;
      line-height: 2;
      font-size: 20px;
    ">
      <h2>Hello There!</h2>
      <p>${text}</>
      <p>😗, Test Email</p>
    </div>
  `
}

export async function sedPasswordResetEmail(resetToken: string, to: string) {
  // Email the user a token
  const info = await transport.sendMail({
    to,
    from: 'test@example.com',
    subject: 'Your password reset token!',
    html: makeEmail(`Your password reset token is here!
      <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here To Reset</a>
    `),
  });
}
