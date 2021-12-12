const nodemailer = require("nodemailer");
const ejs = require("ejs");


module.exports = async ({sender, from,  replyTo, to, title, file, content}) => {
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD,
        },
      })
          
      const data = await ejs.renderFile(process.cwd() + `/views/templates/${file}`, content);

      // configure message body
      const messagePayload = {
        sender: sender || 'claceey@gmail.com',
        replyTo: replyTo || 'claceey@gmail.com',
        from: from || 'The good guys @clace academy',
        to,
        subject: title,
        html: data
      }
          
      const sent = await transporter.sendMail(messagePayload);
      return ({
        success: true,
        message: 'message sent successfuly',
        data: sent.response
    })
    }
    catch(err) {
        return ({
            success: false,
            message: err.message,
            data: null
        })
    }
}