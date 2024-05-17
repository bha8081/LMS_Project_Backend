import nodemailer from 'nodemailer';

// Send Mail
const sendEmail = async function (email, subject, message) {
    let transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
        auth: {
            user: process.env.SMPT_USERNAME,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    // send mail with defined transport object
    await transporter.sendEmail({
        from: process.env.SMPT_FROM_EMAIL,
        to: email,
        subject: subject,
        html: message,
    });
};

export default sendEmail;



// import nodemailer from 'nodemailer'

// const sendEmail = async function( email, subject, message){
//   const transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: false,
//     auth: {
//       //`user` and `pass` values from <https://forwardemail.net>
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });


// console.log("transporter");
// await transporter.sendMail({
//     from: process.env.SMTP_FROM_EMAIL, // sender address
//     to: email, // list of receivers
//     subject: subject, // Subject line
//     html: message, // html body
//   });

//   console.log("After transporter");

// }

// export default sendEmail;