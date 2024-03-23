
const nodemailer = require('nodemailer');

const sendEmail = async (user,resetTokenUrl)=>{

    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });


    const options = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Login password Recovery!',
        text:resetTokenUrl
    };

    await transporter.sendMail(options);
}

module.exports=sendEmail;