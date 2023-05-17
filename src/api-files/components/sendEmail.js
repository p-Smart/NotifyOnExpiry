import nodemailer from 'nodemailer'
import error from './customError';
import productExpirationMessage from '../email-templates/productExpiration';

const transporter = nodemailer.createTransport({
    port: process.env.EMAIL_PORT || undefined,
    host: process.env.EMAIL_HOST || undefined,
    service: process.env.EMAIL_SERVICE || undefined,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
});


const sendEmail = async (email, prod_name, prod_exp_date, user_fname) => {
    try{
    const mailOptions = {
        from: 'NotifyOnExpiry no-reply@notifyonexpiry.vercel.app',
        to: email,
        subject: 'Product Expiration Reminder',
        html: productExpirationMessage(prod_name, prod_exp_date, user_fname),
    };

    const res = await transporter.sendMail(mailOptions)
    return res.response
    }
    catch(err){
        error(err.message)
        // console.error(err.message)
    }
}


export default sendEmail