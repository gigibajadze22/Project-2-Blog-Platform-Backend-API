import nodemailer from "nodemailer";





const sendEmail = (email, subject, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html,
    };
    try{
        transporter.sendMail(mailOptions) 
         console.log(`Email sent to ${email}`);
    }
    catch(error){
        console.error('Error sending email:', error);
    }
}


export { sendEmail };