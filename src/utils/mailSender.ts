import nodemailer from 'nodemailer';

interface Options {
  to: string;
  subject: string;
  text: string;
}

const sendEmail = (options: Options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_ACCOUNT,
      clientId: process.env.MAIL_CLIENT_ID,
      clientSecret: process.env.MAIL_CLIENT_SECRET,
      refreshToken: process.env.MAIL_REFRESH_TOKEN,
      accessToken: process.env.MAIL_ACCESS_TOKEN,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.text,
  };
  transporter.sendMail(mailOptions, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default sendEmail;
